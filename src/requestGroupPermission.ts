import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Requests group permissions for an application.
 *
 * @returns {Promise<void>} Resolves after group permissions are completed by the user.
*/
export async function requestGroupPermission() : Promise<void> {
  const connection = await connectToSubstrate()
  await connection.dispatch({
    name: 'requestGroupPermission',
    params: {}
  })
}

export default requestGroupPermission