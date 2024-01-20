import { CreateCertificateResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Returns found certificates
 * @param {Object} obj All parameters for this function are provided in an object
 * @param {Array<string>} [obj.certifiers] The certifiers to filter certificates by
 * @param {Object} [obj.types] The certificate types to filter certificates by,
 * given as an object whose keys are types
 * and whose values are arrays of fields to request from certificates of the given type.
 * @returns {Promise<CreateCertificateResult[]>} An object containing the found certificates
 */
export async function getCertificates(args: {
  certifiers: string[],
  types: Record<string, string[]>
})
: Promise<CreateCertificateResult[]>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'findCertificates',
    params: {
      certifiers: args.certifiers,
      types: args.types
    },
    bodyJsonParams: true,
    isNinja: true
  })
  return r as CreateCertificateResult[]
}

export default getCertificates