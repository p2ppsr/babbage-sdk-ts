import { CreateActionInput, CreateActionOutput, CreateActionResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/** Creates and broadcasts a BitCoin transaction with the provided inputs and outputs.
 * @param {object} args All parameters for this function are provided in an object
 * @param {Record<string, CreateActionInput>} args.inputs Input scripts to spend as part of this Action. This is an object whose keys are TXIDs and whose values are [BRC-8](https://brc.dev/8) transaction envelopes that contain an additional field called `outputsToRedeen`. This additional field is an array of objects, each containing `index` and `unlockingScript` properties (with an optional `sequenceNumber`). The `index` property is the output number in the transaction you are spending, and `unlockingScript` is the hex-encoded Bitcoin script that unlocks and spends the output (the `sequenceNumber` is applied to the input). Any signatures should be created with `SIGHASH_NONE | ANYONECANPAY` so that additional modifications to the resulting transaction can be made afterward without invalidating them. You may substitute `SIGHASH_NONE` for `SIGHASH_SINGLE` if required for a token contract, or drop `ANYONECANPAY` if you are self-funding the Action and the outputs require no other funding inputs.
 * @param {CreateActionOutput[]} args.outputs The array of transaction outputs (amounts and scripts) that you want in the transaction. Each object contains "satoshis" and "script", which can be any custom locking script of your choosing.
 * @param {number} args.lockTime The lock time of the created transaction.
 * @param {string} args.description A present-tense description of the user Action being facilitated or represented by this BitCoin transaction.
 * @param {boolean} args.dangerouslyDisableMapi Optional. Disables returning mAPI responses with created transaction, dramatically improving performance while removing the ability of recipients to check for double-spends by checking mAPI signatures.
 * @returns {Promise<CreateActionResult>} An Action object containing "txid", "rawTx" "mapiResponses" and "inputs".
 */
export async function createAction(args: {
  inputs: Record<string, CreateActionInput>,
  outputs: CreateActionOutput[],
  lockTime?: number,
  description: string,
  dangerouslyDisableMapi?: boolean
})
: Promise<CreateActionResult>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'createAction',
    params: {
      inputs: args.inputs,
      outputs: args.outputs,
      lockTime: args.lockTime || 0,
      description: args.description,
      dangerouslyDisableMapi: args.dangerouslyDisableMapi || false
    },
    bodyJsonParams: true,
  })
  return r as CreateActionResult
}

export default createAction