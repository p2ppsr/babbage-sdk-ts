import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Resolves identity information by attributes from the user's trusted certifiers.
 * @param {Object} obj All parameters are provided in an object
 * @param {Object} obj.attributes An object containing key value pairs to query for (ex. { firstName: 'Bob' } )
 * @param {string} [obj.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
 * @returns {Promise<Object[]>}
 */
export async function discoverByAttributes(args: {
  attributes: Record<string, string>,
  description: string
})
: Promise<object[]>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'discoverByAttributes',
    params: {
      attributes: args.attributes,
      description: args.description
    },
    bodyJsonParams: true,
    isGet: false
  })
  return r as object[]
}

export default discoverByAttributes