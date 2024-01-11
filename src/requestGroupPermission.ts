import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Requests group permissions for an application.
 *
 * @returns {Promise<void>} Resolves after group permissions are completed by the user.
*/
async function requestGroupPermission() : Promise<void> {
  const connection = await connectToSubstrate()
  await connection.dispatch({
    name: 'requestGroupPermission',
    params: {}
  })
}

export { requestGroupPermission }
export default requestGroupPermission