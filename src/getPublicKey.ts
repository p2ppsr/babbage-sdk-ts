import { ProtocolID } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns the public key. If identityKey is specified, returns the current user's identity key. If a counterparty is specified, derives a public key for the counterparty.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {Array|string} [args.protocolID] Optional. Specify an identifier for the protocol under which this operation is being performed.
 * @param {string} [args.keyID] Optional. An identifier for retrieving the public key used. This can be used to prevent key re-use, even when the same user is using the same protocol to perform actions.
 * @param {string} [args.privileged=false] This indicates whether the privileged keyring should be used, as opposed to the primary keyring.
 * @param {string} [args.identityKey=false] If true, the identity key will be returned, and no key derivation will be performed
 * @param {string} [args.reason] The reason for requiring access to the user's privilegedKey
 * @param {string} [args.counterparty=self] The counterparty to use for derivation. If provided, derives a public key for this counterparty, who can derive the corresponding private key.
 * @param {boolean} [args.forSelf=false] Whether the derived child public key corresponds to a private key held by the current user.
 *
* @returns {Promise<string>} The user's public key
 */
export async function getPublicKey(args: {
  protocolID?: ProtocolID,
  keyID?: string,
  privileged?: boolean, // = false,
  identityKey?: boolean, // = false,
  reason?: string, // = 'No reason provided.',
  counterparty?: string, // = 'self',
  forSelf?: boolean // = false
})
: Promise<string>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getPublicKey',
    nameHttp: 'publicKey',
    params: {
      protocolID: args.protocolID,
      keyID: args.keyID,
      privileged: args.privileged || false,
      identityKey: args.identityKey || false,
      reason: args.reason || 'No reason provided.',
      counterparty: args.counterparty || 'self',
      forSelf: args.forSelf || false
    },
    isGet: true
  })
  return r as string
}

export default getPublicKey
