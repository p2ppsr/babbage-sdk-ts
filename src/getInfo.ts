import getPreferredCurrency from './getPreferredCurrency'
import getVersion from './getVersion'
import { GetInfoParams, GetInfoResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * @returns {Promise<GetInfoResult>} information about the metanet-client context (version, chain, height, user...).
 */
export async function getInfo(args?: GetInfoParams)
: Promise<GetInfoResult>
{
  args ||= {}

  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getInfo',
    params: args,
    isGet: true,
    isNinja: true
  })
  const info = r as GetInfoResult
  if (!info.metanetClientVersion){
    info.metanetClientVersion = await getVersion()
  }
  if (!info.perferredCurrency){
    info.perferredCurrency = await getPreferredCurrency(args)
  }
  return info
}

export default getInfo