import { createAction } from './createAction'
export { createAction }
import { createHmac } from './createHmac'
export { createHmac }
import { createCertificate } from './createCertificate'
export { createCertificate }
import { createSignature } from './createSignature'
export { createSignature }
import { decrypt, decryptAsArray, decryptAsString } from './decrypt'
export { decrypt, decryptAsArray, decryptAsString }
import { discoverByAttributes } from './discoverByAttributes'
export { discoverByAttributes }
import { discoverByIdentityKey } from './discoverByIdentityKey'
export { discoverByIdentityKey }
import { encrypt, encryptAsArray, encryptAsString } from './encrypt'
export { encrypt, encryptAsArray, encryptAsString }
import { getCertificates } from './getCertificates'
export { getCertificates }
import { getHeight } from './getHeight'
export { getHeight }
import { getMerkleRootForHeight } from './getMerkleRootForHeight'
export { getMerkleRootForHeight }
import { getNetwork } from './getNetwork'
export { getNetwork }
import { getPublicKey } from './getPublicKey'
export { getPublicKey }
import { getTransactionOutputs } from './getTransactionOutputs'
export { getTransactionOutputs }
import { getVersion } from './getVersion'
export { getVersion }
import { isAuthenticated } from './isAuthenticated'
export { isAuthenticated }
import { listActions } from './listActions'
export { listActions }
import { proveCertificate } from './proveCertificate'
export { proveCertificate }
import { requestGroupPermission } from './requestGroupPermission'
export { requestGroupPermission }
import { revealKeyLinkage, revealKeyLinkageCounterparty, revealKeyLinkageSpecific } from './revealKeyLinkage'
export { revealKeyLinkage, revealKeyLinkageCounterparty, revealKeyLinkageSpecific }
import { submitDirectTransaction } from './submitDirectTransaction'
export { submitDirectTransaction }
import { unbasketOutput } from './unbasketOutput'
export { unbasketOutput }
import { verifyHmac } from './verifyHmac'
export { verifyHmac }
import { verifySignature } from './verifySignature'
export { verifySignature }
import { waitForAuthentication } from './waitForAuthentication'
export { waitForAuthentication }
import { stampLog, stampLogFormat } from './utils/stampLog'
export { stampLog, stampLogFormat }

export * from './types'

export const BabbageSDK = {
    createAction,
    createHmac,
    createCertificate,
    createSignature,
    decrypt, decryptAsArray, decryptAsString,
    discoverByAttributes,
    discoverByIdentityKey,
    encrypt, encryptAsArray, encryptAsString,
    getCertificates,
    getHeight,
    getMerkleRootForHeight,
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
