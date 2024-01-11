import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Checks if a user is currently authenticated.
 *
 * @returns {Promise<Object>} Returns an object indicating whether a user is currently authenticated.
*/
async function isAuthenticated() : Promise<object> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'isAuthenticated',
    params: {},
    isGet: true
  })
  return r as object
}

export { isAuthenticated }
export default isAuthenticated