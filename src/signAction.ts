import { CreateActionInput, DojoCreateTransactionResultApi, SignActionResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'
import { stampLog } from './utils/stampLog'

/** Completes a previously created action which required custom input unlocking script signing.
 * @param {object} args All parameters for this function are provided in an object
 * @param {Record<string, CreateActionInput>} args.inputs Input scripts to spend as part of this Action. This is an object whose keys are TXIDs and whose values are [BRC-8](https://brc.dev/8) transaction envelopes that contain an additional field called `outputsToRedeen`. This additional field is an array of objects, each containing `index` and `unlockingScript` properties (with an optional `sequenceNumber`). The `index` property is the output number in the transaction you are spending, and `unlockingScript` is the hex-encoded Bitcoin script that unlocks and spends the output (the `sequenceNumber` is applied to the input). Any signatures should be created with `SIGHASH_NONE | ANYONECANPAY` so that additional modifications to the resulting transaction can be made afterward without invalidating them. You may substitute `SIGHASH_NONE` for `SIGHASH_SINGLE` if required for a token contract, or drop `ANYONECANPAY` if you are self-funding the Action and the outputs require no other funding inputs.
 * @param {boolean} args.acceptDelayedBroadcast=true Must match value passed to createAction.
 * @returns {Promise<SignActionResult>} An Action object containing "txid", "rawTx" "mapiResponses" and "inputs".
 */
export async function signAction(args: {
  inputs?: Record<string, CreateActionInput>,
  createResult: DojoCreateTransactionResultApi,
  acceptDelayedBroadcast?: boolean, // = true
  log?: string
})
: Promise<SignActionResult>
{
  const connection = await connectToSubstrate()
  let log = stampLog('', 'start sdk-ts signAction')
  const r = <SignActionResult>await connection.dispatch({
    name: 'signAction',
    params: {
      inputs: args.inputs,
      createResult: args.createResult,
      acceptDelayedBroadcast: args.acceptDelayedBroadcast === undefined ? true : args.acceptDelayedBroadcast,
      log
    },
    bodyJsonParams: true,
  })
  r.log = stampLog(r.log, 'end sdk-ts signAction')
  if (typeof args.log === 'string')
    r.log = args.log + r.log
  return r
}

export default signAction