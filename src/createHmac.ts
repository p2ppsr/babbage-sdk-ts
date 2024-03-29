import { ProtocolID } from './types'
import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Creates a SHA-256 HMAC with a key belonging to the user.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {Uint8Array|string} args.data The data to HMAC. If given as a string, it must be in base64 format.
 * @param {Array|string} args.protocolID Specify an identifier for the protocol under which this operation is being performed.
 * @param {string} args.keyID An identifier for the message. During verification, the same message ID will be required. This can be used to prevent key re-use, even when the same user is using the same protocol to HMAC multiple messages.
 * @param {Uint8Array|string} [args.counterparty=self] If specified, the user with this identity key will also be able to verify the HMAC, as long as they specify the current user's identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone".
 * @param {string} [args.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
 * @param {string} [args.privileged=false] This indicates whether the privileged keyring should be used for the HMAC, as opposed to the primary keyring.
 *
 * @returns {Promise<Uint8Array>} The SHA-256 HMAC of the data.
 */
export async function createHmac(args: {
  data: Uint8Array | string,
  protocolID: ProtocolID,
  keyID: string,
  description?: string, // = '',
  counterparty?: string, // = 'self',
  privileged?: boolean, // = false,
})
: Promise<Uint8Array>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'createHmac',
    params: {
      data: args.data,
      protocolID: args.protocolID,
      keyID: args.keyID,
      description: args.description || '',
      counterparty: args.counterparty || 'self',
      privileged: args.privileged || false
    },
    bodyParamKey: 'data',
    contentType: 'application/octet-stream'
  })
  return r as Uint8Array
}

export default createHmac
