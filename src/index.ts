import { createAction } from './createAction'
import { createHmac } from './createHmac'
import { createCertificate } from './createCertificate'
import { createSignature } from './createSignature'
import { encrypt, encryptAsArray, encryptAsString } from './encrypt'
import { decrypt, decryptAsArray, decryptAsString } from './decrypt'
import { getCertificates } from './getCertificates'
import { getNetwork } from './getNetwork'
import { getPublicKey } from './getPublicKey'
import { getTransactionOutputs } from './getTransactionOutputs'
import { getVersion } from './getVersion'
import { isAuthenticated } from './isAuthenticated'
import { listActions } from './listActions'
import { proveCertificate } from './proveCertificate'
import { requestGroupPermission } from './requestGroupPermission'
import { revealKeyLinkage, revealKeyLinkageCounterparty, revealKeyLinkageSpecific } from './revealKeyLinkage'
import { submitDirectTransaction } from './submitDirectTransaction'
import { unbasketOutput } from './unbasketOutput'
import { verifyHmac } from './verifyHmac'
import { verifySignature } from './verifySignature'
import { waitForAuthentication } from './waitForAuthentication'

export * from './types'

export const BabbageSDK = {
    createAction,
    createHmac,
    createCertificate,
    createSignature,
    decrypt, decryptAsArray, decryptAsString,
    encrypt, encryptAsArray, encryptAsString,
    getCertificates,
    getNetwork,
    getPublicKey,
    getTransactionOutputs,
    getVersion,
    isAuthenticated,
    listActions,
    proveCertificate,
    requestGroupPermission,
    revealKeyLinkage, revealKeyLinkageCounterparty, revealKeyLinkageSpecific,
    submitDirectTransaction,
    unbasketOutput,
    verifyHmac,
    verifySignature,
    waitForAuthentication,
}

export default BabbageSDK
