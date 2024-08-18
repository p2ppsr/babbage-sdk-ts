import { Hash, Utils, MerklePath, Transaction } from "@bsv/sdk";
import { EnvelopeEvidenceApi, OptionalEnvelopeEvidenceApi, TscMerkleProofApi } from "../types";

/**
 * BEEF standard: BRC-62: Background Evaluation Extended Format (BEEF) Transactions
 * https://github.com/bitcoin-sv/BRCs/blob/master/transactions/0062.md
 * 
 * BUMP standard: BRC-74: BSV Unified Merkle Path (BUMP) Format
 * https://github.com/bitcoin-sv/BRCs/blob/master/transactions/0074.md
 */

/**
 * @param input Either a `Transaction` with sourceTransaction and merklePath,
 * recursively, on inputs,
 * or a serialized BEEF of the transaction.
 * @returns Everett-style Envelope for the transaction.
 */
export function toEnvelopeFromBEEF(input: Transaction | number[])
: EnvelopeEvidenceApi {
    let tx: Transaction
    if (Array.isArray(input)) {
        tx = Transaction.fromBEEF(input)
    } else {
        tx = input
    }
    const r: EnvelopeEvidenceApi = {
        rawTx: tx.toHex(),
        txid: tx.id('hex'),
    }
    if (tx.merklePath) {
        r.proof = convertMerklePathToProof(r.txid!, tx.merklePath)
    } else {
        r.inputs = {}
        for (const input of tx.inputs) {
            if (!r.inputs[input.sourceTXID!]) {
                if (!input.sourceTransaction) {
                    throw new Error(`Missing sourceTransaction for ${input.sourceTXID}`)
                }
                r.inputs[input.sourceTXID!] = toEnvelopeFromBEEF(input.sourceTransaction!)
            }
        }
    }
    return r
}

/**
 * Converts a BRC-8 Everett-style Transaction Envelope 
 * to a @bsv/sdk-ts Transaction
 * with corresponding merklePath and sourceTransaction properties.
 * 
 * Uses tx.toBEEF() to generate binary BEEF data.
 * 
 * @param e 
 * @returns tx: Transaction containing required merklePath and sourceTransaction values
 * @returns beef: tx.toBEEF()
 */
export function toBEEFfromEnvelope(e: EnvelopeEvidenceApi)
: { tx: Transaction, beef: number[] }
{
    const merklePaths: Record<string, MerklePath> = {}
    convertUniqueProofsToMerklePaths(e, merklePaths)
    const transactions: Record<string, Transaction> = {}
    const tx = createTransactionFromEnvelope(e, merklePaths, transactions)
    const beef = tx.toBEEF()
    return { tx, beef }
}

function createTransactionFromEnvelope(
    e: EnvelopeEvidenceApi,
    merklePaths: Record<string, MerklePath>,
    transactions: Record<string, Transaction>
) : Transaction {

    if (e.txid && transactions[e.txid]) return transactions[e.txid]

    const tx = Transaction.fromHex(e.rawTx)
    const txid = tx.id('hex')
    if (e.txid) {
        if (e.txid !== txid) throw new Error(`txid doesn't match rawTx`)
    } else {
        e.txid = txid
    }

    if (e.txid && transactions[e.txid]) return transactions[e.txid]

    const mp = merklePaths[txid]
    if (mp) {
        tx.merklePath = mp
    } else if (e.inputs) {
        for (const input of tx.inputs) {
            const txid = verifyTruthy(input.sourceTXID)
            const ie = e.inputs[txid]
            input.sourceTransaction = createTransactionFromEnvelope(ie, merklePaths, transactions)
        }
    }

    transactions[txid] = tx

    return tx
}

function convertUniqueProofsToMerklePaths(e: EnvelopeEvidenceApi, merklePaths: Record<string, MerklePath>) {
    if (!e.txid && e.rawTx) {
        const hash = Hash.hash256(e.rawTx, 'hex')
        hash.reverse()
        e.txid = Utils.toHex(hash)
    }
    const txid = verifyTruthy(e.txid)
    if (merklePaths[txid])
        // No need to proceed
        return
    if (e.proof && !Buffer.isBuffer(e.proof)) {
        const mp = convertProofToMerklePath(txid, e.proof)
        merklePaths[txid] = mp
    } else if (e.inputs) {
        for (const [txid, ie] of Object.entries(e.inputs || {})) {
            if (!ie.txid)
                ie.txid = txid
            convertUniqueProofsToMerklePaths(ie, merklePaths)
        }
    }
}

/**
 * Convert a MerklePath to a single BRC-10 proof
 * @param txid the txid in `mp` for which a BRC-10 proof is needed
 * @param mp MerklePath
 * @returns transaction proof in BRC-10 string format.
 */
export function convertMerklePathToProof(txid: string, mp: MerklePath) : TscMerkleProofApi {
    const l = mp.path[0].find(l => l.txid && l.hash === txid)
    if (l === undefined) {
        throw new Error(`MerklePath does not contain txid ${txid}`)
    }
    const nodes: string[] = []

    const r: TscMerkleProofApi = {
        height: mp.blockHeight,
        index: l.offset,
        txOrId: txid,
        target: mp.blockHeight.toString(),
        targetType: 'height',
        nodes
    }

    let index = r.index
    for (let h = 0; h < mp.path.length; h++) {
        const isOdd = index % 2 === 1
        const offset = isOdd ? index - 1 : index + 1
        const l = mp.path[h].find(l => l.offset === offset)
        if (l === undefined) {
            throw new Error(`Invalid MerklePath for txid ${txid}`)
        }
        const hash = (l!.duplicate) ? '*' : l!.hash!
        nodes.push(hash)
        index = index >> 1
    }

    return r
}

/**
 * Convert a single BRC-10 proof to a MerklePath
 * @param txid transaction hash as big endian hex string
 * @param proof transaction proof in BRC-10 string format.
 * @returns corresponding MerklePath
 */
export function convertProofToMerklePath(txid: string, proof: TscMerkleProofApi): MerklePath {
    if (proof.height === undefined) {
        throw new Error('Merkle proofs must include height.')
    }
    if (Buffer.isBuffer(proof.nodes)) {
        throw new Error('Serialized merkle proof format is currently unsupported.')
    }
    const blockHeight = proof.height
    const treeHeight = proof.nodes.length
    type Leaf = {
        offset: number
        hash?: string
        txid?: boolean
        duplicate?: boolean
    }
    const path: Leaf[][] = Array(treeHeight).fill(0).map(() => ([]))
    let index = proof.index
    for (let level = 0; level < treeHeight; level++) {
        const node = proof.nodes[level]
        const isOdd = index % 2 === 1
        const offset = isOdd ? index - 1 : index + 1
        const leaf: Leaf = { offset }
        if (node === '*' || (level === 0 && node === txid)) {
            leaf.duplicate = true
        } else {
            leaf.hash = node
        }
        path[level].push(leaf)
        if (level === 0) {
            const txidLeaf: Leaf = {
                offset: proof.index,
                hash: txid,
                txid: true,
            }
            if (isOdd) {
                path[0].push(txidLeaf)
            } else {
                path[0].unshift(txidLeaf)
            }
        }
        index = index >> 1
    }
    return new MerklePath(blockHeight, path)
}

export function verifyTruthy<T> (v: T | null | undefined, description?: string): T {
  if (v == null) throw new Error(description ?? 'A truthy value is required.')
  return v
}

/**
 * Convert OptionalEnvelopeEvidenceApi to EnvelopeEvidenceApi.
 * 
 * Missing data (rawTx / proofs) can be looked up if lookupMissing is provided.
 * 
 * Any mising data will result in an Error throw.
 * 
 * @param e 
 * @param lookupMissing 
 */
export async function resolveOptionalEnvelopeEvidence(
    e: OptionalEnvelopeEvidenceApi,
    lookupMissing?: (txid: string) => Promise<{ rawTx?: string, proof?: TscMerkleProofApi }>
) : Promise<EnvelopeEvidenceApi> {
    let rawTx = e.rawTx
    let proof = e.proof
    if (!rawTx) {
        if (lookupMissing && e.txid) {
            const r = await lookupMissing(e.txid)
            rawTx = r.rawTx
            proof ||= r.proof
        }
    }
    if (!rawTx) {
        throw new Error('Missing rawTx')
    }
    const r: EnvelopeEvidenceApi = {
        ...e,
        rawTx,
        proof,
        inputs: undefined
    }
    if (e.inputs) {
        r.inputs = {}
        for (const [txid, oe] of Object.entries(e.inputs)) {
            const ee = await resolveOptionalEnvelopeEvidence(oe, lookupMissing)
            if (ee) {
                r.inputs[txid] = ee
            }
        }
    }
    return r
}

export function validateOptionalEnvelopeEvidence(
    e: OptionalEnvelopeEvidenceApi,
) : EnvelopeEvidenceApi {
    let rawTx = e.rawTx
    if (!rawTx) {
        throw new Error('Missing rawTx')
    }
    const r: EnvelopeEvidenceApi = {
        ...e,
        rawTx,
        inputs: undefined
    }
    if (e.inputs) {
        r.inputs = {}
        for (const [txid, oe] of Object.entries(e.inputs)) {
            const ee = validateOptionalEnvelopeEvidence(oe)
            r.inputs[txid] = ee
        }
    }
    if (!e.inputs && !e.proof)
        throw new Error('Either inputs or proof is required.')
    return r
}


