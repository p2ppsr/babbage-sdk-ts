import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Waits for a user to be authenticated.
 *
 * @returns {Promise<true>} Always returns true
*/
async function waitForAuthentication() : Promise<boolean> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'waitForAuthentication',
    params: {}
  })
  return r as boolean
}

export { waitForAuthentication }
export default waitForAuthentication