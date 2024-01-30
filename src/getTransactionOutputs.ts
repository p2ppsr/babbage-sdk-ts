import { GetTransactionOutputResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns a set of transaction outputs that Dojo has tracked
 * @param {Object} args All parameters are given in an object
 * @param {string} [args.basket] If provided, indicates which basket the outputs should be selected from.
 * @param {boolean} [args.tracked] If provided, only outputs with the corresponding tracked value will be returned (true/false).
 * @param {boolean} [args.spendable] If given as true or false, only outputs that have or have not (respectively) been spent will be returned. If not given, both spent and unspent outputs will be returned.
 * @param {String[]} [args.tags] If provided, only outputs that are tagged with one of the given tags will be returned (depending on the tagQueryMode which defaults to all).
 * @param {string} [args.type] If provided, only outputs of the specified type will be returned. If not provided, outputs of all types will be returned.
 * @param {Boolean} [args.includeEnvelope] If provided, returns a structure with the SPV envelopes for the UTXOS that have not been spent.
 * @param {Boolean} [args.includeBasket] If provided, returns the basket a UTXO is a member of, or undefined if it is not in a basket.
 * @param {Boolean} [args.includeTags] If provided, returns one or more tags a UTXO is tagged with.
 * @param {boolean} [args.includeCustomInstructions] If true, returns the customInstructions property with each output.
 * @param {String} [args.tagQueryMode] If provided, will return outputs that match either 'all' (default) the tags, or 'any' of them.
 * @param {number} [args.limit] Provide a limit on the number of outputs that will be returned.
 * @param {number} [args.offset] Provide an offset into the list of outputs.
 * @returns {Promise<Array<TransactionOutputDescriptor>>} A set of outputs that match the criteria
 */
export async function getTransactionOutputs(args: {
  basket?: string,
  tracked?: boolean,
  spendable?: boolean,
  tags?: string[],
  type?: string,
  includeEnvelope?: boolean, // = false,
  includeBasket?: boolean, // = false,
  includeCustomInstructions?: boolean, // = false
  includeTags?: boolean, // = false,
  tagQueryMode?: 'all' | 'any' // = 'all'
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
      spendable: args.spendable,
      tags: args.tags,
      type: args.type,
      includeEnvelope: args.includeEnvelope || false,
      includeBasket: args.includeBasket || false,
      includeCustomInstructions: args.includeCustomInstructions || false,
      includeTags: args.includeTags || false,
      tagQueryMode: args.tagQueryMode || 'all',
      limit: args.limit || 25,
      offset: args.offset || 0
    },
    bodyJsonParams: true,
    isGet: false,
    isNinja: true
  })
  return r as GetTransactionOutputResult[]
}

export default getTransactionOutputs