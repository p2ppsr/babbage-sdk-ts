import { MerklePath, Transaction } from "@bsv/sdk";
import { EnvelopeEvidenceApi } from "../types";
import { TscMerkleProofApi, asString } from "cwi-base";

export function toBEEFfromEnvelope(e: EnvelopeEvidenceApi, verify?: boolean)
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

export function convertProofToMerklePath(txid: string, proof: TscMerkleProofApi): MerklePath {
    if (proof.height === undefined || Buffer.isBuffer(proof.nodes)) {
        throw new Error('Unsupported proof format.')
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

