import { CreateActionInput, DojoCreateTransactionResultApi, AbortActionResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'
import { stampLog } from './utils/stampLog'

/** Aborts a previously created action which required custom input unlocking script signing.
 * @param {object} args All parameters for this function are provided in an object
 * @param {referenceNumber} args.referenceNumber The referenceNumber associated with a prior createAction result where signActionRequired is true.
 * @returns {Promise<AbortActionResult>} An Action object containing "txid", "rawTx" "mapiResponses" and "inputs".
 */
export async function abortAction(args: {
  referenceNumber: string,
  log?: string
})
: Promise<AbortActionResult>
{
  const connection = await connectToSubstrate()
  let log = stampLog('', 'start sdk-ts abortAction')
  const r = <AbortActionResult>await connection.dispatch({
    name: 'abortAction',
    params: {
      referenceNumber: args.referenceNumber,
      log
    },
    bodyJsonParams: true,
  })
  r.log = stampLog(r.log, 'end sdk-ts abortAction')
  if (typeof args.log === 'string')
    r.log = args.log + r.log
  return r
}

export default abortAction