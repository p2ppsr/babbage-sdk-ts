/*
export * from './createAction'
export * from './createHmac'
export * from './createSignature'
export * from './getPublicKey'
export * from './verifyHmac'
export * from './verifySignature'
export * from './createCertificate'
export * from './getCertificates'
export * from './proveCertificate'
export * from './submitDirectTransaction'
export * from './getTransactionOutputs'
export * from './listActions'
export * from './revealKeyLinkage'
*/
import { encryptAsArray, encryptAsString, encrypt } from './encrypt'
import { decryptAsArray, decryptAsString, decrypt } from './decrypt'
import { getVersion } from './getVersion'
import { getNetwork } from './getNetwork'
import { isAuthenticated } from './isAuthenticated'
import { requestGroupPermission } from './requestGroupPermission'
import { unbasketOutput } from './unbasketOutput'
import { waitForAuthentication } from './waitForAuthentication'

export const BabbageSDK = {
    decrypt,
    decryptAsArray,
    decryptAsString,
    encrypt,
    encryptAsArray,
    encryptAsString,
    getNetwork,
    getVersion,
    isAuthenticated,
    requestGroupPermission,
    unbasketOutput,
    waitForAuthentication,
}

export default BabbageSDK
