import { MerklePath, Transaction, Utils, Hash, ChainTracker } from "@bsv/sdk";

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
        throw new Error('Internal')
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
            throw new Error('a valid serialized Transaction is expected')
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

/*
 * BEEF standard: BRC-62: Background Evaluation Extended Format (BEEF) Transactions
 * https://github.com/bitcoin-sv/BRCs/blob/master/transactions/0062.md
 * 
 * BUMP standard: BRC-74: BSV Unified Merkle Path (BUMP) Format
 * https://github.com/bitcoin-sv/BRCs/blob/master/transactions/0074.md
 * 
 * A valid serialized BEEF is the cornerstone of Simple Payment Validation (SPV)
 * where they are exchanged between two non-trusting parties to establish the
 * validity of a newly constructed bitcoin transaction and its inputs from prior
 * transactions.
 * 
 * A `Beef` is fundamentally an list of `BUMP`s and a list of transactions.
 * 
 * A `BUMP` is a partial merkle tree for a 'mined' bitcoin block.
 * It can therefore be used to prove the validity of transaction data
 * for each transaction txid whose merkle path is included in the tree.
 * 
 * To be valid, the list of transactions must be sorted in dependency order:
 * oldest transaction first;
 * and each transaction must either
 * have a merkle path in one of the bumps, or
 * have all of its input transactions included in the list of transactions.
 * 
 * The `Beef` class supports the construction of valid BEEFs by allowing BUMPs,
 * merkle paths, and transactions to be merged sequentially.
 * 
 * The `Beef` class also extends the standard by supporting 'known' transactions.
 * A 'known' transaction is represented solely by its txid.
 * To become valid, all the 'known' transactions in a `Beef` must be replaced by full
 * transactions and merkle paths, if they are mined.
 * 
 * The purpose of supporting 'known' transactions is that one or both parties
 * generating and exchanging BEEFs often possess partial knowledge of valid transactions
 * due to their history.
 * 
 * A valid `Beef` is only required when sent to a party with no shared history,
 * such as a transaction processor.
 */
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
            throw new Error('bumpIndex is undefined')

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
     * Sorts `txs` and checks structural validity of beef.
     *
     * Validity requirements:
     * 1. No 'known' txids, unless `allowKnown` is true.
     * 2. All transactions have bumps or their inputs chain back to bumps (or are known).
     * 3. Order of transactions satisfies dependencies before dependents.
     * 4. No transactions with duplicate txids.
     * 
     * @param allowKnown optional. If true, transaction txid is assumed valid
     * @param chainTracker optional. If defined, used to verify computed merkle path roots for all bump txids.
     */
    isValid(allowKnown?: boolean) : boolean {
        return this.verifyValid(allowKnown).valid
    }

    /**
     * Sorts `txs` and confirms validity of transaction data contained in beef
     * by validating structure of this beef and confirming computed merkle roots
     * using `chainTracker`.
     *
     * Validity requirements:
     * 1. No 'known' txids, unless `allowKnown` is true.
     * 2. All transactions have bumps or their inputs chain back to bumps (or are known).
     * 3. Order of transactions satisfies dependencies before dependents.
     * 4. No transactions with duplicate txids.
     * 
     * @param chainTracker Used to verify computed merkle path roots for all bump txids.
     * @param allowKnown optional. If true, transaction txid is assumed valid
     */
    async verify(chainTracker: ChainTracker, allowKnown?: boolean) : Promise<boolean> {
        const r = this.verifyValid(allowKnown)
        if (!r.valid) return false

        for (const height in Object.keys(r.roots)) {
            const isValid = await chainTracker.isValidRootForHeight(r.roots[height], Number(height))
            if (!isValid)
                return false
        }

        return true
    }

    private verifyValid(allowKnown?: boolean, chainTracker?: ChainTracker)
    : { valid: boolean, roots: Record<number, string> } {

        const r: { valid: boolean, roots: Record<number, string> } = { valid: false, roots: {} }

        this.sortTxs()

        // valid txids: known txids, bump txids, then txids with input's in txids
        const txids: Record<string, boolean> = {}

        for (const tx of this.txs) {
            if (tx.known) {
                if (!allowKnown) return r
                txids[tx.txid] = true
            }
        }

        const confirmComputedRoot = (b: MerklePath, txid: string) : boolean => {
            const root = b.computeRoot(txid)
            if (!r.roots[b.blockHeight]) {
                // accept the root as valid for this block and reuse for subsequent txids
                r.roots[b.blockHeight] = root
            }
            if (r.roots[b.blockHeight] !== root)
                return false
            return true
        }

        for (const b of this.bumps) {
            for (const n of b.path[0]) {
                if (n.txid && n.hash) {
                    txids[n.hash] = true
                    // all txid hashes in all bumps must have agree on computed merkle path roots
                    if (!confirmComputedRoot(b, n.hash))
                        return r
                }
            }
        }

        for (const t of this.txs) {
            for (const i of t.inputTxids)
                // all input txids must be included before they are referenced
                if (!txids[i]) return r
            txids[t.txid] = true
        }

        r.valid = true
        return r
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
            throw new Error(`Serialized BEEF must start with ${BEEF_MAGIC} but starts with ${version}`)
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
            log += `  BUMP ${i}\n    block: ${b.blockHeight}\n    txids: [\n${b.path[0].filter(n => !!n.txid).map(n => `      '${n.hash}'`).join(',\n')}\n    ]\n`
        }
        i = -1
        for (const t of this.txs) {
            i++
            log += `  TX ${i}\n    txid: ${t.txid}\n`
            if (t.bumpIndex !== undefined) {
                log += `    bumpIndex: ${t.bumpIndex}\n`
            }
            if (t.known) {
                log += `    known\n`
            }
            if (t.inputTxids.length > 0) {
                log += `    inputs: [\n${t.inputTxids.map(it => `      '${it}'`).join(',\n')}\n    ]\n`
            }
        }
        return log
    }
}

function asBuffer(val: Buffer | string | number[], encoding?: BufferEncoding): Buffer {
  let b: Buffer
  if (Buffer.isBuffer(val)) b = val
  else if (typeof val === 'string') b = Buffer.from(val, encoding ?? 'hex')
  else b = Buffer.from(val)
  return b
}

function asString (val: Buffer | string, encoding?: BufferEncoding): string {
  return Buffer.isBuffer(val) ? val.toString(encoding ?? 'hex') : val
}

/**
 * Calculate the SHA256 hash of a Buffer.
 * @returns sha256 hash of buffer contents.
 * @publicbody
 */
function sha256Hash(buffer: Buffer): Buffer {
    const msg = asArray(buffer)
    const first = new Hash.SHA256().update(msg).digest()
    return asBuffer(first)
}

/**
 * Calculate the SHA256 hash of the SHA256 hash of a Buffer.
 * @param data is Buffer or hex encoded string
 * @returns double sha256 hash of buffer contents, byte 0 of hash first.
 * @publicbody
 */
function doubleSha256HashLE (data: string | Buffer, encoding?: BufferEncoding): Buffer {
    const msg = asArray(data, encoding)
    const first = new Hash.SHA256().update(msg).digest()
    const second = new Hash.SHA256().update(first).digest()
    return asBuffer(second)
}

/**
 * Calculate the SHA256 hash of the SHA256 hash of a Buffer.
 * @param data is Buffer or hex encoded string
 * @returns reversed (big-endian) double sha256 hash of data, byte 31 of hash first.
 * @publicbody
 */
function doubleSha256BE (data: string | Buffer, encoding?: BufferEncoding): Buffer {
    return doubleSha256HashLE(data, encoding).reverse()
}

function asArray(val: Buffer | string | number[], encoding?: BufferEncoding): number[] {
  let a: number[]
  if (Array.isArray(val)) a = val
  else if (Buffer.isBuffer(val)) a = Array.from(val)
  else a = Array.from(Buffer.from(val, encoding || 'hex'))
  return a
}