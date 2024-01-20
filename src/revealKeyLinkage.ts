import { CounterpartyKeyLinkageResult, ProtocolID, SpecificKeyLinkageResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Reveals the linkage between a key held by this user and a key held by another user.
 * In one mode, reveals all keys associated with a counterparty,
 * in the other mode reveals only the linkage of a specific interaction.
 * 
 * Encrypts the linkage value so that only the specified verifier can access it.
 * Refer to [BRC-72](https://brc.dev/72) for full details.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string} args.mode When "counterparty" it will reveal all keys for the counterparty.
 * When "specific" it will reveal only the linkage for the specific protocolID and keyID provided
 * @param {string} args.counterparty The identity of the person who is associated with the linked key to reveal.
 * Must be a hexadecimal string representing a 33-byte or 65-byte value.
 * @param {string} args.verifier The identity key of the person to whom this revelation is being made.
 * The linkage will be encrypted so that only the verifier can access it.
 * @param {string} args.protocolID BRC-43 Protocol ID under which the linkage is to be revealed
 * @param {string} args.keyID BRC-43 Key ID under which the linkage is to be revealed
 * @param {string} [args.description] Describe the high-level operation being performed,
 * so that the user can make an informed decision if permission is needed.
 * @param {Boolean} [args.privileged=false] This indicates which keyring should be used.
 *
 * @returns {Promise<CounterpartyKeyLinkageResult | SpecificKeyLinkageResult>} The revealed linkage payload, as described in [BRC-72](https://brc.dev/72).
 */
export async function revealKeyLinkage(args: {
  mode: "counterparty" | "specific",
  counterparty: string,
  verifier: string,
  protocolID: ProtocolID,
  keyID: string,
  description: string,
  privileged?: boolean // = false
})
: Promise<CounterpartyKeyLinkageResult | SpecificKeyLinkageResult>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'revealKeyLinkage',
    params: {
      mode: args.mode,
      counterparty: args.counterparty,
      verifier: args.verifier,
      protocolID: args.protocolID,
      keyID: args.keyID,
      description: args.description,
      privileged: args.privileged || false
    },
    isGet: true
  })
  return r as CounterpartyKeyLinkageResult | SpecificKeyLinkageResult
}

/**
 * Reveals the linkage between a key held by this user and a key held by another user.
 * Reveals all keys associated with a counterparty,
 * 
 * Encrypts the linkage value so that only the specified verifier can access it.
 * Refer to [BRC-72](https://brc.dev/72) for full details.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string} args.counterparty The identity of the person who is associated with the linked key to reveal.
 * Must be a hexadecimal string representing a 33-byte or 65-byte value.
 * @param {string} args.verifier The identity key of the person to whom this revelation is being made.
 * The linkage will be encrypted so that only the verifier can access it.
 * @param {string} args.protocolID BRC-43 Protocol ID under which the linkage is to be revealed
 * @param {string} [args.description] Describe the high-level operation being performed,
 * so that the user can make an informed decision if permission is needed.
 * @param {Boolean} [args.privileged=false] This indicates which keyring should be used.
 *
 * @returns {Promise<CounterpartyKeyLinkageResult>} The revealed linkage payload, as described in [BRC-72](https://brc.dev/72).
 */
export async function revealKeyLinkageCounterparty(args: {
  counterparty: string,
  verifier: string,
  protocolID: ProtocolID,
  description: string,
  privileged?: boolean // = false
})
: Promise<CounterpartyKeyLinkageResult>
{
  const r = await revealKeyLinkage({
    mode: 'counterparty',
    counterparty: args.counterparty,
    verifier: args.verifier,
    protocolID: args.protocolID,
    keyID: '1',
    description: args.description,
    privileged: args.privileged
  })
  return r as CounterpartyKeyLinkageResult
}

/**
 * Reveals the linkage between a key held by this user and a key held by another user.
 * Reveals only the linkage of a specific interaction.
 * 
 * Encrypts the linkage value so that only the specified verifier can access it.
 * Refer to [BRC-72](https://brc.dev/72) for full details.
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string} args.counterparty The identity of the person who is associated with the linked key to reveal.
 * Must be a hexadecimal string representing a 33-byte or 65-byte value.
 * @param {string} args.verifier The identity key of the person to whom this revelation is being made.
 * The linkage will be encrypted so that only the verifier can access it.
 * @param {string} args.protocolID BRC-43 Protocol ID under which the linkage is to be revealed
 * @param {string} args.keyID BRC-43 Key ID under which the linkage is to be revealed
 * @param {string} [args.description] Describe the high-level operation being performed,
 * so that the user can make an informed decision if permission is needed.
 * @param {Boolean} [args.privileged=false] This indicates which keyring should be used.
 *
 * @returns {Promise<SpecificKeyLinkageResult>} The revealed linkage payload, as described in [BRC-72](https://brc.dev/72).
 */
export async function revealKeyLinkageSpecific(args: {
  counterparty: string,
  verifier: string,
  protocolID: ProtocolID,
  keyID: string,
  description: string,
  privileged?: boolean // = false
})
: Promise<SpecificKeyLinkageResult>
{
  const r = await revealKeyLinkage({
    mode: 'specific',
    counterparty: args.counterparty,
    verifier: args.verifier,
    protocolID: args.protocolID,
    keyID: args.keyID,
    description: args.description,
    privileged: args.privileged
  })
  return r as SpecificKeyLinkageResult
}

export default revealKeyLinkage