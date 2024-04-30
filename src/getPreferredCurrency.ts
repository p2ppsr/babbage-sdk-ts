import { ProtocolID } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns the user's preferred currency for displaying within apps
 *
 * @param {Object} args All parameters are passed in an object.
 * @param {string} [args.description] Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.
* @returns {Promise<string>} The user's preferred currency
 */
export async function getPreferredCurrency(args: {
  description?: string
})
  : Promise<string> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getPreferredCurrency',
    nameHttp: 'getPreferredCurrency',
    params: {
      description: args.description
    },
    isGet: true
  })
  return r as string
}

export default getPreferredCurrency
