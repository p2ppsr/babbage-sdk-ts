import connectToSubstrate from './utils/connectToSubstrate'
/**
 * Returns the current version of the kernal
 * @returns {Promise<String>} The current kernel version (e.g. "0.3.49")
 */
async function getVersion() : Promise<string> {
  const connection = await connectToSubstrate()
  return connection.version
}

export { getVersion }
export default getVersion
