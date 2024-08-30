import { MerklePath, Transaction, Utils } from "@bsv/sdk";
import { asString, doubleSha256BE, ERR_INTERNAL, ERR_INVALID_PARAMETER } from "cwi-base";

/*
 * BEEF standard: BRC-62: Background Evaluation Extended Format (BEEF) Transactions
 * https://github.com/bitcoin-sv/BRCs/blob/master/transactions/0062.md
 * 
 * BUMP standard: BRC-74: BSV Unified Merkle Path (BUMP) Format
 * https://github.com/bitcoin-sv/BRCs/blob/master/transactions/0074.md
 */

export const BEEF_MAGIC = 4022206465 // 0100BEEF in LE order
export const BEEF_MAGIC_KNOWN_TXID_EXTENSION = 4022206465 // 0100BEEF in LE order

export class BeefTx {
    _bumpIndex?: number
    _tx?: Transaction
    _rawTx?: number[]
    _txid?: string
    known: boolean
    inputTxids: string[] = []
    degree: number = 0

    get bumpIndex() : number | undefined { return this._bumpIndex}

    set bumpIndex(v: number | undefined) {
        this._bumpIndex = v
        this.updateInputTxids()
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
            const inputTxids: Record<string, boolean> = {}
            for (const input of this.tx!.inputs)
                inputTxids[input.sourceTXID!] = true
            this.inputTxids = Object.keys(inputTxids)
        }
        this.bumpIndex = bumpIndex
    }

    updateInputTxids() {
        if (this.bumpIndex !== undefined || this.known || !this.tx)
            // If we have a proof, or are known, no inputs need proving
            this.inputTxids = []
        else {
            const inputTxids = {};
            for (const input of this.tx.inputs)
                inputTxids[input.sourceTXID!] = true;
            this.inputTxids = Object.keys(inputTxids);
        }
    }

    toWriter(writer: Utils.Writer) : void {
        if (this._txid && this.known) {
            // Encode just the txid of a known transaction using the txid
            writer.writeUInt32LE(BEEF_MAGIC_KNOWN_TXID_EXTENSION)
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
        if (version === BEEF_MAGIC_KNOWN_TXID_EXTENSION) {
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
     * Replaces existing transaction with same txid.
     * 
     * @param rawTx 
     * @returns txid of rawTx
     */
    mergeRawTx(rawTx: number[]) : string {
        const newTx: BeefTx = new BeefTx(rawTx)
        this.removeExistingTxid(newTx.txid)
        this.txs.push(newTx)
        this.tryToValidateBumpIndex(newTx)
        return newTx.txid
    }

    /**
     * Merge a `Transaction` and any referenced `merklePath` and `sourceTransaction`, recursifely.
     * 
     * Replaces existing transaction with same txid.
     * 
     * Attempts to match an existing bump to the new transaction.
     * 
     * @param tx 
     * @returns txid of tx
     */
    mergeTransaction(tx: Transaction) {
        const txid = tx.id('hex')
        this.removeExistingTxid(txid)
        let bumpIndex: number | undefined = undefined
        if (tx.merklePath)
            bumpIndex = this.mergeBump(tx.merklePath)
        const newTx = new BeefTx(tx, bumpIndex)
        this.txs.push(newTx)
        this.tryToValidateBumpIndex(newTx)
        bumpIndex = newTx.bumpIndex
        if (bumpIndex === undefined) {
            for (const input of tx.inputs) {
                if (input.sourceTransaction)
                    this.mergeTransaction(input.sourceTransaction)
            }
        }
        return txid
    }

    removeExistingTxid(txid: string) {
        const existingTxIndex = this.txs.findIndex(t => t.txid === txid)
        if (existingTxIndex >= 0)
            this.txs.splice(existingTxIndex, 1)
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
     * Sorts `txs` and checks validity of beef.
     *
     * DOES NOT VERIFY VALIDITY OF BUMPS OR MERKLEROOTS (YET)
     *  
     * Validity requirements:
     * 1. No 'known' txids.
     * 2. All transactions have bumps or their inputs chain back to bumps.
     * 3. Order of transactions satisfies dependencies before dependents.
     * 4. No transaction duplicate txids.
     */
    isValid() {
        this.sortTxs()

        for (const tx of this.txs)
            if (tx.known) return false

        const txids: Record<string, boolean> = {}

        for (const b of this.bumps)
            for (const n of b.path[0])
                if (n.txid && n.hash) txids[n.hash] = true

        for (const t of this.txs) {
            for (const i of t.inputTxids)
                if (!txids[i]) return false
            txids[t.txid] = true
        }

        return true
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

    toHex() : string {
        return Utils.toHex(this.toBinary())
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

    static fromString(s: string, enc?: 'hex' | 'utf8' | 'base64'): Beef {
        enc ||= 'hex'
        const bin = Utils.toArray(s, enc)
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

    /**
     * Sort the `txs` by input txid dependency order.
     * @returns array of input txids of unproven transactions that aren't included in txs.
     */
    sortTxs() : string[] {
        const missingInputs: Record<string, boolean> = {}

        const txidToTx: Record<string, BeefTx> = {}

        for (const tx of this.txs) {
            txidToTx[tx.txid] = tx
            // All transactions in this beef start at degree zero.
            tx.degree = 0
        }

        for (const tx of this.txs) {
            if (tx.bumpIndex === undefined) {
                // For all the unproven transactions,
                // link their inputs that exist in this beef,
                // make a note of missing inputs.
                for (const inputTxid of tx.inputTxids) {
                    if (!txidToTx[inputTxid])
                        missingInputs[inputTxid] = true
                }
            }
        }

        // queue of transactions that no unsorted transactions depend upon...
        const queue: BeefTx[] = []
        // sorted transactions
        const result: BeefTx[] = []

        // Increment each txid's degree for every input reference to it by another txid
        for (const tx of this.txs) {
            for (const inputTxid of tx.inputTxids) {
                const tx = txidToTx[inputTxid]
                if (tx)
                    tx.degree++
            }
        }
        // Since circular dependencies aren't possible, start with the txids no one depends on.
        // These are the transactions that should be sent last...
        for (const tx of this.txs) {
            if (tx.degree === 0) {
                queue.push(tx)
            }
        }
        // As long as we have transactions to send...
        while (queue.length) {
            let tx = queue.shift()!
            // Add it as new first to send
            result.unshift(tx)
            // And remove its impact on degree
            // noting that any tx achieving a
            // value of zero can be sent...
            for (const inputTxid of tx.inputTxids) {
                const inputTx = txidToTx[inputTxid]
                if (inputTx) {
                    inputTx.degree--
                    if (inputTx.degree === 0) {
                        queue.push(inputTx)
                    }
                }
            }
        }
        this.txs = result

        return Object.keys(missingInputs)
    }

    toLogString() : string {
        let log = ''
        log += `BEEF with ${this.bumps.length} BUMPS and ${this.txs.length} Transactions, isValid ${this.isValid()}\n`
        let i = -1
        for (const b of this.bumps) {
            i++
            log += `  BUMP ${i}\n    block: ${b.blockHeight}\n    txids: [${b.path[0].filter(n => !!n.txid).map(n => `'${n.txid}'`).join(',')}]\n`
        }
        i = -1
        for (const t of this.txs) {
            i++
            log += `  TX ${i}\n    txid: ${t.txid}\n`
            if (t.bumpIndex !== undefined) {
                log += `    bumpIndex: ${t.bumpIndex}\n`
            }
            if (t.inputTxids.length > 0) {
                log += `    inputs: [${t.inputTxids.map(it => `'${it}'`).join(',')}]\n`
            }
        }
        return log
    }
}
