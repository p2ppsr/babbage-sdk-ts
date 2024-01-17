import { GetTransactionOutputResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns a set of transaction outputs that Dojo has tracked
 * @param {Object} args All parameters are given in an object
 * @param {string} [args.basket] If provided, indicates which basket the outputs should be selected from.
 * @param {boolean} [args.tracked] If provided, only outputs with the corresponding tracked value will be returned (true/false).
 * @param {boolean} [args.includeEnvelope] If provided, returns a structure with the SPV envelopes for the UTXOS that have not been spent.
 * @param {boolean} [args.spendable] If given as true or false, only outputs that have or have not (respectively) been spent will be returned. If not given, both spent and unspent outputs will be returned.
 * @param {string} [args.type] If provided, only outputs of the specified type will be returned. If not provided, outputs of all types will be returned.
 * @param {number} [args.limit] Provide a limit on the number of outputs that will be returned.
 * @param {number} [args.offset] Provide an offset into the list of outputs.
 * @returns {Promise<Array<TransactionOutputDescriptor>>} A set of outputs that match the criteria
 */
async function getTransactionOutputs(args: {
  basket?: string,
  tracked?: boolean,
  includeEnvelope?: boolean, // = false,
  includeCustomInstructions?: boolean,
  spendable?: boolean,
  type?: string,
  limit?: number, // = 25,
  offset?: number, // = 0
})
: Promise<GetTransactionOutputResult[]>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getTransactionOutputs',
    params: {
      basket: args.basket,
      tracked: args.tracked,
      includeEnvelope: args.includeEnvelope || false,
      includeCustomInstructions: args.includeCustomInstructions || false,
      spendable: args.spendable,
      type: args.type,
      limit: args.limit || 25,
      offset: args.offset || 0
    },
    bodyJsonParams: true,
    isNinja: true
  })
  return r as GetTransactionOutputResult[]
}

export { getTransactionOutputs }
export default getTransactionOutputs