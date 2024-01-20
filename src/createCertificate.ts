import { CreateCertificateResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Creates a signed certificate
 * @param {Object} args All parameters for this function are provided in an object
 * @param {string} args.certificateType The type of certificate to create
 * @param {Object} args.fieldObject The fields to add to the certificate
 * @param {string} args.certifierUrl The URL of the certifier signing the certificate
 * @param {string} args.certifierPublicKey The public identity key of the certifier signing the certificate
 * @returns {Promise<CreateCertificateResult>} A signed certificate
 */
export async function createCertificate(args: {
  certificateType: string,
  fieldObject: Record<string, string>,
  certifierUrl: string,
  certifierPublicKey: string,
})
: Promise<CreateCertificateResult>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'createCertificate',
    params: {
          certificateType: args.certificateType,
          fieldObject: args.fieldObject,
          certifierUrl: args.certifierUrl,
          certifierPublicKey: args.certifierPublicKey
    },
    bodyJsonParams: true,
  })
  return r as CreateCertificateResult
}

export default createCertificate