import { CertificateApi, ProveCertificateResult } from './types'
import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Creates certificate proof specifically for verifier
 * @param {Object} args All parameters for this function are provided in an object
 * @param {CertificateApi} args.certificate The certificate to prove
 * @param {Array<string>} args.fieldsToReveal The names of the fields to reveal to the verifier
 * @param {string} args.verifierPublicIdentityKey The public identity key of the verifier
 * @returns {Promise<ProveCertificateResult>} A certificate for presentation to the verifier for field examination
 */
export async function proveCertificate(args: {
  certificate: CertificateApi,
  fieldsToReveal: string[],
  verifierPublicIdentityKey: string
})
: Promise<ProveCertificateResult>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'proveCertificate',
    params: {
      certificate: args.certificate,
      fieldsToReveal: args.fieldsToReveal,
      verifierPublicIdentityKey: args.verifierPublicIdentityKey
    },
    bodyJsonParams: true,
  })
  return r as ProveCertificateResult
}

export default proveCertificate