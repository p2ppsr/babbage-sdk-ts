import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Checks if a user is currently authenticated.
 *
 * @returns {Promise<boolean>} Returns whether a user is currently authenticated.
*/
export async function isAuthenticated() : Promise<boolean> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'isAuthenticated',
    params: {},
    isGet: true
  })
  return r as boolean
}

export default isAuthenticated