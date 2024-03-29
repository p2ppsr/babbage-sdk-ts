import { ProtocolID } from './types'
import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Creates a digital signature with a key belonging to the user. The SHA-256 hash of the data is used with ECDSA.
 *
 * To allow other users to externally verify the signature, use getPublicKey with the same protocolID, keyID and privileged parameters. The signature should be valid under that public key.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {Uint8Array|string} args.data The data to sign. If given as a string, it must be in base64 format.
 * @param {Array|string} args.protocolID Specify an identifier for the protocol under which this operation is being performed.
 * @param {string} args.keyID An identifier for the message being signed. During verification, or when retrieving the public key used, the same message ID will be required. This can be used to prevent key re-use, even when the same user is using the same protocol to sign multiple messages.
 * @param {string} [args.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
 * @param {Uint8Array|string} [args.counterparty=self] If specified, the user with this identity key will also be able to verify the signature, as long as they specify the current user's identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone".
 * @param {string} [args.privileged=false] This indicates whether the privileged keyring should be used for signing, as opposed to the primary keyring.
 *
 * @returns {Promise<Uint8Array>} The ECDSA message signature.
 */
export async function createSignature(args: {
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
    name: 'createSignature',
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

export default createSignature