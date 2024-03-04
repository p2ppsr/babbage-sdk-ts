import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns the current chain height of the network
 * @returns {Promise<number>} The current chain height
 */
export async function getHeight() : Promise<number> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getHeight',
    params: {},
    isGet: true,
    isNinja: true
  })
  return r as number
}

export default getHeight