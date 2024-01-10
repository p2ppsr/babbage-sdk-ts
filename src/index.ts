/*
export * from './createAction'
export * from './createHmac'
export * from './createSignature'
export * from './decrypt'
export * from './getNetwork'
export * from './getPublicKey'
export * from './getVersion'
export * from './isAuthenticated'
export * from './verifyHmac'
export * from './verifySignature'
export * from './waitForAuthentication'
export * from './createCertificate'
export * from './getCertificates'
export * from './proveCertificate'
export * from './submitDirectTransaction'
export * from './getTransactionOutputs'
export * from './listActions'
export * from './revealKeyLinkage'
export * from './requestGroupPermission'
export * from './unbasketOutput'
*/
import { encryptAsArray, encryptAsString, encrypt } from './encrypt'

export const BabbageSDK = {
    encrypt,
    encryptAsArray,
    encryptAsString
}

export default BabbageSDK
