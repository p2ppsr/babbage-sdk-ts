import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Resolves identity information by identity key from the user's trusted certifiers.
 * @param {Object} obj All parameters are provided in an object
 * @param {String} obj.identityKey The identity key to resolve information for
 * @param {string} [obj.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
 * @returns {Promise<Object[]>}
 */
export async function discoverByIdentityKey(args: {
  identityKey: string,
  description: string
})
: Promise<object[]>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'discoverByIdentityKey',
    params: {
      identityKey: args.identityKey,
      description: args.description
    },
    isGet: true
  })
  return r as object[]
}

export default discoverByIdentityKey