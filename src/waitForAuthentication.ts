import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Waits for a user to be authenticated.
 *
 * @returns {Promise<Object>} An object containing a boolean indicating that a user is authenticated
*/
async function waitForAuthentication() : Promise<object> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'waitForAuthentication',
    params: {}
  })
  return r as object
}

export { waitForAuthentication }
export default waitForAuthentication