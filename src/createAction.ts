import { CreateActionInput, CreateActionOutput, CreateActionParams, CreateActionResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'
import { stampLog } from './utils/stampLog'

/** Creates and broadcasts a BitCoin transaction with the provided inputs and outputs.
 * @param {object} args All parameters for this function are provided in an object
 * @param {Record<string, CreateActionInput>} args.inputs Input scripts to spend as part of this Action. This is an object whose keys are TXIDs and whose values are [BRC-8](https://brc.dev/8) transaction envelopes that contain an additional field called `outputsToRedeen`. This additional field is an array of objects, each containing `index` and `unlockingScript` properties (with an optional `sequenceNumber`). The `index` property is the output number in the transaction you are spending, and `unlockingScript` is the hex-encoded Bitcoin script that unlocks and spends the output (the `sequenceNumber` is applied to the input). Any signatures should be created with `SIGHASH_NONE | ANYONECANPAY` so that additional modifications to the resulting transaction can be made afterward without invalidating them. You may substitute `SIGHASH_NONE` for `SIGHASH_SINGLE` if required for a token contract, or drop `ANYONECANPAY` if you are self-funding the Action and the outputs require no other funding inputs.
 * @param {CreateActionOutput[]} args.outputs The array of transaction outputs (amounts and scripts) that you want in the transaction. Each object contains "satoshis" and "script", which can be any custom locking script of your choosing.
 * @param {number} args.lockTime Optional. Default is zero. When the transaction can be processed into a block: >= 500,000,000 values are interpreted as minimum required unix time stamps in seconds. < 500,000,000 values are interpreted as minimum required block height.
 * @param {number} args.version Optional. Transaction version number, default is current standard transaction version value.
 * @param {string} args.description A present-tense description of the user Action being facilitated or represented by this BitCoin transaction.
 * @param {Array<String>} args.labels An array of transaction labels to apply to the Action
 * @param {Boolean} args.acceptDelayedBroadcast=true If true, self-signs initial validation response, watchman handles broadcast and proof verification. DEPRECATED: Use same parameter in `options`.
 * @param {CreateActionOptions} args.options Optional processing options.
 * Outputs are immediately available to following transactions using the same mode.
 * If false, waits for broadcast to transaction processing network response. Throws an error if not accepted by at least one processor.
 * Recommended mode for situations in which a double spend is possible.
 * @returns {Promise<CreateActionResult>} An Action object containing "txid", "rawTx" "mapiResponses" and "inputs".
 */
export async function createAction(args: CreateActionParams)
: Promise<CreateActionResult>
{
  const connection = await connectToSubstrate()
  let log = stampLog('', 'start sdk-ts createAction')
  const options = args.options || {}
  if (args.acceptDelayedBroadcast !== undefined) options.acceptDelayedBroadcast = args.acceptDelayedBroadcast
  if (options.acceptDelayedBroadcast === undefined) options.acceptDelayedBroadcast = true
  const r = <CreateActionResult>await connection.dispatch({
    name: 'createAction',
    params: {
      inputs: args.inputs,
      outputs: args.outputs,
      lockTime: args.lockTime || 0,
      version: args.version || 1,
      description: args.description,
      labels: args.labels,
      options: args.options,
      log
    },
    bodyJsonParams: true,
  })
  r.log = stampLog(r.log, 'end sdk-ts createAction')
  if (typeof args.log === 'string')
    r.log = args.log + r.log
  return r
}

export default createAction