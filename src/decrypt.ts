import { ProtocolID } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Decrypts data with a key belonging to the user.
 * The same protocolID, keyID, counterparty and privileged parameters that were used during encryption
 * must be used to successfully decrypt.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string|Uint8Array} args.ciphertext The encrypted data to decipher.
 * If given as a string, it must be in base64 format.
 * @param {ProtocolID} args.protocolID Specify an identifier for the protocol
 * under which this operation is being performed.
 * It should be the same protocol ID used during encryption.
 * @param {string} args.keyID This should be the same message ID used during encryption.
 * @param {string} [args.description] Describe the high-level operation being performed,
 * so that the user can make an informed decision if permission is needed.
 * @param {Uint8Array|string} [args.counterparty=self] If a foreign user used the local user's
 * identity key as a counterparty when encrypting a message,
 * specify the foreign user's identity key and the message can be decrypted.
 * Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone".
 * @param {Boolean} [args.privileged=false] This indicates which keyring should be used when decrypting.
 * Use the same value as was used during encryption.
 * @param {string} [args.returnType=Uint8Array] Specify the data type for the returned plaintext.
 * Available types are `string` (TextDecoder decoded) and `Uint8Array`.
 *
 * @returns {Promise<string|Uint8Array>} The decrypted plaintext.
 */
export async function decrypt(args: {
  ciphertext: string | Uint8Array,
  protocolID: ProtocolID,
  keyID: string,
  description?: string,
  counterparty?: string,
  privileged?: boolean,
  returnType?: "Uint8Array" | "string"
}) : Promise<string | Uint8Array> {
  const connection = await connectToSubstrate()
  const r = <Uint8Array>await connection.dispatch({
    name: 'decrypt',
    params: {
      ciphertext: typeof args.ciphertext === 'string'
        ? Uint8Array.from(Buffer.from(args.ciphertext, 'base64'))
        : args.ciphertext,
      protocolID: args.protocolID,
      keyID: args.keyID,
      description: args.description || '',
      counterparty: args.counterparty || 'self',
      privileged: args.privileged || false,
      returnType: 'Uint8Array'
    },
    bodyParamKey: 'ciphertext',
    contentType: 'application/octet-stream'
  })
  if (args.returnType !== 'string')
    return r
  return new TextDecoder().decode(r)
}

/**
 * Decrypts data with a key belonging to the user.
 * The same protocolID, keyID, counterparty and privileged parameters that were used during encryption
 * must be used to successfully decrypt.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string|Uint8Array} args.ciphertext The encrypted data to decipher.
 * If given as a string, it must be in base64 format.
 * @param {ProtocolID} args.protocolID Specify an identifier for the protocol
 * under which this operation is being performed.
 * It should be the same protocol ID used during encryption.
 * @param {string} args.keyID This should be the same message ID used during encryption.
 * @param {string} [args.description] Describe the high-level operation being performed,
 * so that the user can make an informed decision if permission is needed.
 * @param {Uint8Array|string} [args.counterparty=self] If a foreign user used the local user's
 * identity key as a counterparty when encrypting a message,
 * specify the foreign user's identity key and the message can be decrypted.
 * Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone".
 * @param {Boolean} [args.privileged=false] This indicates which keyring should be used when decrypting.
 * Use the same value as was used during encryption.
 *
 * @returns {Promise<string>} The decrypted plaintext TextDecoder decoded to string.
 */
export async function decryptAsString(args: {
  ciphertext: string | Uint8Array,
  protocolID: ProtocolID,
  keyID: string,
  description?: string,
  counterparty?: string,
  privileged?: boolean,
}) : Promise<string> {
  return decrypt({
    ...args,
    returnType: 'string'
  }) as Promise<string>
}

/**
 * Decrypts data with a key belonging to the user.
 * The same protocolID, keyID, counterparty and privileged parameters that were used during encryption
 * must be used to successfully decrypt.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string|Uint8Array} args.ciphertext The encrypted data to decipher.
 * If given as a string, it must be in base64 format.
 * @param {ProtocolID} args.protocolID Specify an identifier for the protocol
 * under which this operation is being performed.
 * It should be the same protocol ID used during encryption.
 * @param {string} args.keyID This should be the same message ID used during encryption.
 * @param {string} [args.description] Describe the high-level operation being performed,
 * so that the user can make an informed decision if permission is needed.
 * @param {Uint8Array|string} [args.counterparty=self] If a foreign user used the local user's
 * identity key as a counterparty when encrypting a message,
 * specify the foreign user's identity key and the message can be decrypted.
 * Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone".
 * @param {Boolean} [args.privileged=false] This indicates which keyring should be used when decrypting.
 * Use the same value as was used during encryption.
 *
 * @returns {Promise<Uint8Array>} The decrypted plaintext.
 */
export async function decryptAsArray(args: {
  ciphertext: string | Uint8Array,
  protocolID: ProtocolID,
  keyID: string,
  description?: string,
  counterparty?: string,
  privileged?: boolean,
}) : Promise<Uint8Array> {
  return decrypt({
    ...args,
    returnType: 'string'
  }) as Promise<Uint8Array>
}

export default decrypt