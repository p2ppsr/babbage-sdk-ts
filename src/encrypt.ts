import { ProtocolID } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Encrypts data with a key belonging to the user.
 * If a counterparty is provided, also allows the counterparty to decrypt the data.
 * The same protocolID, keyID, counterparty and privileged parameters must be used when decrypting.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string|Uint8Array} args.plaintext The data to encrypt. If given as a string, TextEncoder is used to encode it as Uint8Array.
 * @param {ProtocolID} args.protocolID Specify an identifier for the protocol under which this operation is being performed.
 * @param {string} args.keyID An identifier for the message being encrypted. When decrypting, the same message ID will be required. This can be used to prevent key re-use, even when the same two users are using the same protocol to encrypt multiple messages. It can be randomly-generated, sequential, or even fixed.
 * @param {string} [args.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
 * @param {Uint8Array|string} [args.counterparty=self] If specified, the user with this identity key will also be able to decrypt the message, as long as they specify the current user's identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone".
 * @param {boolean} [args.privileged=false] When true, the data will be encrypted with the user's privileged keyring instead of their primary keyring.
 * @param {string} [args.returnType='Uint8Array'] Specify the data type for the returned ciphertext. Available types are `string` (base64 encoded binary) and `Uint8Array`.
 *
 * @returns {Promise<string|Uint8Array>} The encrypted ciphertext.
 */
export async function encrypt(args: {
  plaintext: string | Uint8Array,
  protocolID: ProtocolID,
  keyID: string,
  description?: string,
  counterparty?: string,
  privileged?: boolean,
  returnType?: "Uint8Array" | "string"
}) : Promise<string | Uint8Array> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'encrypt',
    params: {
      plaintext: typeof args.plaintext === 'string' ? new TextEncoder().encode(args.plaintext) : args.plaintext,
      protocolID: args.protocolID,
      keyID: args.keyID,
      description: args.description || '',
      counterparty: args.counterparty || 'self',
      privileged: args.privileged || false,
      returnType: args.returnType || 'Uint8Array'
    },
    bodyParamKey: 'plaintext',
    contentType: 'application/octet-stream'
  })
  return r as (string | Uint8Array)
}

/**
 * Encrypts data with a key belonging to the user.
 * If a counterparty is provided, also allows the counterparty to decrypt the data.
 * The same protocolID, keyID, counterparty and privileged parameters must be used when decrypting.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string|Uint8Array} args.plaintext The data to encrypt. If given as a string, TextEncoder is used to encode it as Uint8Array.
 * @param {Array|string} args.protocolID Specify an identifier for the protocol under which this operation is being performed.
 * @param {string} args.keyID An identifier for the message being encrypted. When decrypting, the same message ID will be required. This can be used to prevent key re-use, even when the same two users are using the same protocol to encrypt multiple messages. It can be randomly-generated, sequential, or even fixed.
 * @param {string} [args.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
 * @param {Uint8Array|string} [args.counterparty=self] If specified, the user with this identity key will also be able to decrypt the message, as long as they specify the current user's identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone".
 * @param {Boolean} [args.privileged=false] When true, the data will be encrypted with the user's privileged keyring instead of their primary keyring.
 *
 * @returns {Promise<string>} The encrypted ciphertext data as base64 encoded string.
 */
export async function encryptAsString(args: {
  plaintext: string | Uint8Array,
  protocolID: string,
  keyID: string,
  description?: string,
  counterparty?: string,
  privileged?: boolean
}) : Promise<string> {
  return encrypt({
    ...args,
    returnType: 'string'
  }) as Promise<string>
}

/**
 * Encrypts data with a key belonging to the user.
 * If a counterparty is provided, also allows the counterparty to decrypt the data.
 * The same protocolID, keyID, counterparty and privileged parameters must be used when decrypting.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string|Uint8Array} args.plaintext The data to encrypt. If given as a string, TextEncoder is used to encode it as Uint8Array.
 * @param {Array|string} args.protocolID Specify an identifier for the protocol under which this operation is being performed.
 * @param {string} args.keyID An identifier for the message being encrypted. When decrypting, the same message ID will be required. This can be used to prevent key re-use, even when the same two users are using the same protocol to encrypt multiple messages. It can be randomly-generated, sequential, or even fixed.
 * @param {string} [args.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
 * @param {Uint8Array|string} [args.counterparty=self] If specified, the user with this identity key will also be able to decrypt the message, as long as they specify the current user's identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone".
 * @param {Boolean} [args.privileged=false] When true, the data will be encrypted with the user's privileged keyring instead of their primary keyring.
 *
 * @returns {Promise<Uint8Array>} The encrypted ciphertext data.
 */
export async function encryptAsArray(args: {
  plaintext: string | Uint8Array,
  protocolID: string,
  keyID: string,
  description?: string,
  counterparty?: string,
  privileged?: boolean
}) : Promise<Uint8Array> {
  return encrypt({
    ...args,
    returnType: 'Uint8Array'
  }) as Promise<Uint8Array>
}

export default encrypt