import { ProtocolID } from './types'
import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Verifies that a digital signature was created with a key belonging to the user.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {Uint8Array|string} args.data The data that was signed. If given as a string, it must be in base64 format.
 * @param {Uint8Array|string} args.signature The signature to verify, in the same format returned when it was created.
 * @param {Array|string} args.protocolID Specify the identifier for the protocol under which the data was signed.
 * @param {string} args.keyID An identifier for the message that was signed. This should be the same message ID that was used when creating the signature.
 * @param {string} [args.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
 * @param {Uint8Array|string} [args.counterparty=self] If specified, allows verification where the user with this identity key has created the signature, as long as they had specified the current user's identity key as their counterparty during creation. Must be a hexadecimal string representing a 33-byte or 65-byte value or "self". Note that signatures created with counterparty = "anyone" are verifiable by anyone, and do not need user keys through the kernel.
 * @param {string} [args.privileged=false] This indicates whether the privileged keyring was used for signing, as opposed to the primary keyring.
 * @param {string} [args.reason] The reason shown to the user for using the privileged key
 *
 * @returns {Promise<boolean>} An whether the signature was successfully verified.
 */
export async function verifySignature(args: {
  data: Uint8Array | string,
  signature: Uint8Array | string,
  protocolID: ProtocolID,
  keyID: string,
  description?: string, // = '',
  counterparty?: string, // = 'self',
  privileged?: boolean, // = false,
  reason?: string // = ''
})
: Promise<boolean>
{
  let signature = args.signature
  if (signature && typeof signature !== 'string') {
    // Uint8Arrays need to be converted to strings.
    if (signature.constructor === Uint8Array || signature.constructor === Buffer) {
      signature = Buffer.from(signature).toString('base64')
    }
  }

  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'verifySignature',
    params: {
      data: args.data,
      signature,
      protocolID: args.protocolID,
      keyID: args.keyID,
      description: args.description || '',
      counterparty: args.counterparty || 'self',
      privileged: args.privileged || false,
      reason: args.reason || ''
    },
    bodyParamKey: 'data',
    contentType: 'application/octet-stream'
  })
  return r as boolean
}

export default verifySignature