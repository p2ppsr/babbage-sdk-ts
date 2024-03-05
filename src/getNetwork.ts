import connectToSubstrate from './utils/connectToSubstrate'

/**
  * Returns which BSV network we are using (mainnet or testnet)
  * @param {String} format for the returned string. Either with (default) or without (nonet) a 'net' suffix.
  * @returns {String} The current BSV network formatted as requested.
  */
export async function getNetwork(format?: 'default' | 'nonet') : Promise<string> {
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getNetwork',
    nameHttp: 'network',
    params: {
      format
    },
    isGet: true,
  })
  return r as string
}

export default getNetwork