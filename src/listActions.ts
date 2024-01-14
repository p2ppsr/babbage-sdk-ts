import { ListActionsResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns a list of Actions with a given label
 * @param {Object} args All parameters are given in an object
 * @param {String} args.label The label for the transactions to return
 * @param {Number} [args.limit=25] Provide a limit on the number of outputs that will be returned.
 * @param {Number} [args.offset=0] Provide an offset into the list of outputs.
 * @returns {Promise<ListActionsResult>} A set of outputs that match the criteria
 */
async function listActions(args: {
  label: string,
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
      limit: args.limit || 25,
      offset: args.offset || 0
    },
    bodyJsonParams: true,
    isNinja: true
  })
  return r as ListActionsResult
}

export { listActions }
export default listActions