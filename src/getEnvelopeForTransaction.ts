import { EnvelopeApi } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
  * Returns an Everett Style envelope for the given txid.
  *
  * A transaction envelope is a tree of inputs where all the leaves are proven transactions.
  * The trivial case is a single leaf: the envelope for a proven transaction is the rawTx and its proof.
  *
  * Each branching level of the tree corresponds to an unmined transaction without a proof,
  * in which case the envelope is:
  * - rawTx
  * - mapiResponses from transaction processors (optional)
  * - inputs object where keys are this transaction's input txids and values are recursive envelope for those txids.
  *
  * @param {Object} args All parameters are given in an object
  * @param {string} [args.txid] double hash of transaction as big endian hex string
  * @returns {Promise<EnvelopeApi | undefined>} Undefined if the txid does not exist or an envelope can't be generated.
  */
export async function getEnvelopeForTransaction(args: {
  txid: string
})
: Promise<EnvelopeApi | undefined>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getEnvelopeForTransaction',
    params: {
      txid: args.txid
    },
    bodyJsonParams: true,
    isGet: false,
    isNinja: true
  })
  if (!r) return undefined
  return r as EnvelopeApi
}

export default getEnvelopeForTransaction