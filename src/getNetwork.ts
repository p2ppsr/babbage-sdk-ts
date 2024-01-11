import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns the current network (main or test)
 * @returns {Promise<String>} The current network (e.g. "main")
 */
async function getNetwork() : Promise<string> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getNetwork',
    nameHttp: 'network',
    params: {},
    isGet: true,
  })
  return r as string
}

export { getNetwork }
export default getNetwork