import { SubmitDirectTransaction, SubmitDirectTransactionResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Submits a transaction directly to a ninja
 * @param {Object} obj All parameters for this function are provided in an object
 * @param {string} obj.protocol Specify the transaction submission payment protocol to use. Currently, the only supported protocol is that with BRFC ID "3241645161d8"
 * @param {SubmitDirectTransaction} obj.transaction The transaction envelope to submit, including key derivation information
 * @param {string} obj.senderIdentityKey Provide the identity key for the person who sent the transaction
 * @param {string} obj.note Human-readable description for the transaction
 * @param {Number} obj.amount Amount of satoshis associated with the transaction
 * @param {string} [obj.derivationPrefix] A derivation prefix used for all outputs. If provided, derivation prefixes on all outputs are optional.
 * @returns {Promise<SubmitDirectTransactionResult>} Object containing reference number, status=success, and human-readable note acknowledging the transaction
 */
export async function submitDirectTransaction(args: {
  protocol?: string,
  transaction: SubmitDirectTransaction,
  senderIdentityKey: string,
  note: string,
  amount: number,
  derivationPrefix: string
})
: Promise<SubmitDirectTransactionResult>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'submitDirectTransaction',
    params: {
      protocol: args.protocol,
      transaction: args.transaction,
      senderIdentityKey: args.senderIdentityKey,
      note: args.note,
      amount: args.amount,
      derivationPrefix: args.derivationPrefix
    },
    bodyJsonParams: true,
    isNinja: true
  })
  return r as SubmitDirectTransactionResult
}

export default submitDirectTransaction