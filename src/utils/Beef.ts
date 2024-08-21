import { MerklePath, Transaction, Utils } from "@bsv/sdk";
import { asString, doubleSha256BE, ERR_INTERNAL, ERR_INVALID_PARAMETER } from "cwi-base";

export const BEEF_MAGIC = 4022206465 // 0100BEEF in LE order
export const BEEF_MAGIC_V1 = 4022206465 // 0100BEEF in LE order

export class BeefTx {
    bumpIndex?: number
    _tx?: Transaction
    _rawTx?: number[]
    _txid?: string
    known: boolean

    constructor (tx: Transaction | number[] | string, bumpIndex?: number) {
        if (typeof tx === 'string') {
            this.known = true
            this._txid = tx
        } else {
            this.known = false
            if (Array.isArray(tx)) {
                this._rawTx = tx
            } else {
                this._tx = <Transaction>tx
            }
        }
        this.bumpIndex = bumpIndex
    }

    toWriter(writer: Utils.Writer) : void {
        if (this._txid && this.known) {
            // Encode just the txid of a known transaction using the
            // v1 BEEF magic value.
            writer.writeUInt32LE(BEEF_MAGIC_V1)
            writer.writeReverse(Utils.toArray(this._txid, 'hex'))
        } else if (this._rawTx)
            writer.write(this._rawTx)
        else if (this._tx)
            writer.write(this._tx.toBinary())
        else
            throw new ERR_INTERNAL('a valid serialized Transaction is expected')
        if (this.bumpIndex === undefined) {
            writer.writeUInt8(0)
        } else {
            writer.writeUInt8(1)
            writer.writeVarIntNum(this.bumpIndex)
        }
    }

    static fromReader (br: Utils.Reader): BeefTx {
        let tx: Transaction | number[] | string | undefined = undefined
        const version = br.readUInt32LE()
        if (version === BEEF_MAGIC_V1) {
            // This is the extension to support known transactions
            tx = Utils.toHex(br.readReverse(32))
        } else {
            br.pos -= 4 // Unread the version...
            tx = Transaction.fromReader(br)
        }
        const bumpIndex = br.readUInt8() ? br.readVarIntNum() : undefined
        const beefTx = new BeefTx(tx, bumpIndex)
        return beefTx
    }

    get txid() {
        if (this._txid) return this._txid
        if (this._tx) return this._txid = this._tx.id('hex')
        if (this._rawTx) return this._txid = asString(doubleSha256BE(Buffer.from(this._rawTx)))
        throw new ERR_INTERNAL()
    }

    get tx() {
        if (this._tx) return this._tx
        if (this._rawTx) return this._tx = Transaction.fromBinary(this._rawTx)
        return undefined
    }

    get rawTx() {
        if (this._rawTx) return this._rawTx
        if (this._tx) return this._rawTx = this._tx.toBinary()
        return undefined
    }
}

export class Beef {
    bumps: MerklePath[] = []
    txs: BeefTx[] = []

    constructor () {
    }

    /**
     * Merge a MerklePath that is assumed to be fully valid.
     * @param bump 
     * @returns index of merged bump
     */
    mergeBump(bump: MerklePath) : number {
        let added = false
        let bumpIndex: number | undefined = undefined
        // If this proof is identical to another one previously added, we use that first. Otherwise, we try to merge it with proofs from the same block.
        for (let i = 0; i < this.bumps.length; i++) {
          const b = this.bumps[i]
          if (b === bump) { // Literally the same
            return i
          }
          if (b.blockHeight === bump.blockHeight) {
            // Probably the same...
            const rootA = b.computeRoot()
            const rootB = bump.computeRoot()
            if (rootA === rootB) {
              // Definitely the same... combine them to save space
              b.combine(bump)
              bumpIndex = i
              added = true
              break
            }
          }
        }

        // if the proof is not yet added, add a new path.
        if (!added) {
          bumpIndex = this.bumps.length
          this.bumps.push(bump)
        }

        if (bumpIndex === undefined) 
            throw new ERR_INTERNAL()

        // review if any transactions are proven by this bump
        const b = this.bumps[bumpIndex]
        for (const tx of this.txs) {
            const txid = tx.txid
            if (!tx.bumpIndex) {
                for (const n of b.path[0]) {
                    if (n.hash === txid) {
                        tx.bumpIndex = bumpIndex
                        n.txid = true
                        break
                    }
                }
            }
        }

        return bumpIndex
    }

    /**
     * Merge a serialized transaction.
     * 
     * Checks that a transaction with the same txid hasn't already been merged.
     * 
     * Attempts to match an existing bump to the new transaction.
     * 
     * @param rawTx 
     * @returns 
     */
    mergeRawTx(rawTx: number[]) : number {
        const newTx: BeefTx = new BeefTx(rawTx)
        const i = this.txs.findIndex(t => t.txid === newTx.txid)
        if (i >= 0) {
            return i
        }
        this.txs.push(newTx)
        this.tryToValidateBumpIndex(newTx)
        return this.txs.length - 1
    }

    /**
     * Merge a `Transaction` and any referenced `merklePath` and `sourceTransaction`, recursifely.
     * 
     * Attempts to match an existing bump to the new transaction.
     * 
     * @param rawTx 
     * @returns 
     */
    mergeTransaction(tx: Transaction) {
        const txid = tx.id('hex')
        let bumpIndex: number | undefined = undefined
        if (tx.merklePath)
            bumpIndex = this.mergeBump(tx.merklePath)
        const existingTx = this.txs.find(t => t.txid === txid)
        if (!existingTx) {
            const newTx = new BeefTx(tx, bumpIndex)
            this.txs.push(newTx)
            this.tryToValidateBumpIndex(newTx)
            bumpIndex = newTx.bumpIndex
        }
        if (bumpIndex === undefined) {
            for (const input of tx.inputs) {
                if (input.sourceTransaction)
                    this.mergeTransaction(input.sourceTransaction)
            }
        }
    }

    mergeKnownTxid(txid: string) {
        const existingTx = this.txs.find(t => t.txid === txid)
        if (!existingTx) {
            const newTx = new BeefTx(txid)
            this.txs.push(newTx)
            this.tryToValidateBumpIndex(newTx)
        }
    }

    mergeBeef(beef: number[] | Beef) {
        const b: Beef = Array.isArray(beef) ? Beef.fromBinary(beef) : beef

        for (const bump of b.bumps)
            this.mergeBump(bump)

        // TODO: Resolve replacing known txid's with actual transactions.

        for (const tx of b.txs) {
            if (tx.known)
                this.mergeKnownTxid(tx.txid)
            else if (tx.rawTx)
                this.mergeRawTx(tx.rawTx)
        }
    }

    /**
     * Validity requirements:
     * 1. No 'known' txids.
     * 2. All transactions have bumps or their inputs chain back to bumps.
     * 3. Order of transactions satisfies dependencies before dependents.
     * 4. No transaction duplicate txids.
     */
    validate() {

    }

    toBinary() : number[] {
        const writer = new Utils.Writer()
        writer.writeUInt32LE(BEEF_MAGIC)

        writer.writeVarIntNum(this.bumps.length)
        for (const b of this.bumps) {
            writer.write(b.toBinary())
        }

        writer.writeVarIntNum(this.txs.length)
        for (const tx of this.txs) {
            tx.toWriter(writer)
        }

        return writer.toArray()
    }

    static fromReader (br: Utils.Reader): Beef {
        const version = br.readUInt32LE()
        if (version !== BEEF_MAGIC)
            throw new ERR_INVALID_PARAMETER('binary Beef data', 'start with ${BEEF_MAGIC} but starts with ${version}')
        const beef = new Beef()
        const bumpsLength = br.readVarIntNum()
        for (let i = 0; i < bumpsLength; i++) {
            const bump = MerklePath.fromReader(br)
            beef.bumps.push(bump)
        }
        const txsLength = br.readVarIntNum()
        for (let i = 0; i < txsLength; i++) {
            const beefTx = BeefTx.fromReader(br)
            beef.txs.push(beefTx)
        }
        return beef
    }

    static fromBinary(bin: number[]): Beef {
        const br = new Utils.Reader(bin)
        return Beef.fromReader(br)
    }

    /**
     * Try to validate newTx.bumpIndex by looking for an existing bump
     * that proves newTx.txid
     * 
     * @param newTx A new `BeefTx` that has been added to this.txs
     * @returns true if a bump was found, false otherwise
     */
    tryToValidateBumpIndex(newTx: BeefTx) : boolean {
        if (newTx.bumpIndex !== undefined)
            return true
        const txid = newTx.txid
        for (let i = 0; i < this.bumps.length; i++) {
            const j = this.bumps[i].path[0].findIndex(b => b.hash === txid)
            if (j >= 0) {
                newTx.bumpIndex = i
                this.bumps[i].path[0][j].txid = true
                return true
            }
        }
        return false
    }

}