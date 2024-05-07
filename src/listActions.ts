import { ListActionsResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns a list of Actions with a given label
 * @param {Object} args All parameters are given in an object
 * @param {String} args.label The label for the transactions to return
 * @param {Boolean} [args.addInputsAndOutputs] Optional. If true, include the list of transaction inputs and outputs when retrieving transactions. Enabling this option adds the 'inputs' and 'outputs' properties to each transaction, providing detailed information about the transaction's inputs and outputs.
 * @param {Boolean} [args.includeBasket] Optional. If true, the basket for each input and output will be included.
 * @param {Boolean} [args.includeTags] Optional. If true, the tags on each input and output will be included.
 * @param {Boolean} [args.noRawTx] Optional. If true, excludes rawTx and outputScript properties from results. 
 * @param {Number} [args.limit=25] Provide a limit on the number of outputs that will be returned.
 * @param {Number} [args.offset=0] Provide an offset into the list of outputs.
 * @returns {Promise<ListActionsResult>} A set of outputs that match the criteria
 */
export async function listActions(args: {
  label: string,
  addInputsAndOutputs?: boolean, // = false,
  includeBasket?: boolean, // = false,
  includeTags?: boolean, // = false
  noRawTx?: boolean, // = false
  limit?: number, // = 25,
  offset?: number // = 0
})
: Promise<ListActionsResult>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getTransactions',
    nameHttp: 'listActions',
    params: {
      label: args.label,
      addInputsAndOutputs: args.addInputsAndOutputs,
      includeBasket: args.includeBasket,
      includeTags: args.includeTags,
      noRawTx: args.noRawTx,
      limit: args.limit || 25,
      offset: args.offset || 0
    },
    bodyJsonParams: true,
    isNinja: true
  })
  return r as ListActionsResult
}

export default listActions