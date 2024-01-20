import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Waits for a user to be authenticated.
 *
 * @returns {Promise<true>} Always returns true
*/
export async function waitForAuthentication() : Promise<boolean> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'waitForAuthentication',
    params: {}
  })
  return r as boolean
}

export default waitForAuthentication