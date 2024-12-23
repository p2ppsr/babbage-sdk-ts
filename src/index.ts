import { abortAction } from './abortAction'
export { abortAction }
import { createAction, validateCreateActionOptions } from './createAction'
export { createAction, validateCreateActionOptions }
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
import { getPreferredCurrency } from './getPreferredCurrency'
export { getPreferredCurrency }
import { encrypt, encryptAsArray, encryptAsString } from './encrypt'
export { encrypt, encryptAsArray, encryptAsString }
import { getCertificates } from './getCertificates'
export { getCertificates }
import { getHeight } from './getHeight'
export { getHeight }
import { getInfo } from './getInfo'
export { getInfo }
import { getMerkleRootForHeight } from './getMerkleRootForHeight'
export { getMerkleRootForHeight }
import { getNetwork } from './getNetwork'
export { getNetwork }
import { getPublicKey } from './getPublicKey'
export { getPublicKey }
import { getEnvelopeForTransaction } from './getEnvelopeForTransaction'
export { getEnvelopeForTransaction }
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
import { signAction } from './signAction'
export { signAction }
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
import { Beef, BeefTx, BeefParty } from '@bsv/sdk'
export { Beef, BeefTx, BeefParty }
import { buildTransactionForSignActionUnlocking } from './utils/buildTransactionForSignActionUnlocking'
export { buildTransactionForSignActionUnlocking }
import { toBEEFfromEnvelope, convertMerklePathToProof, convertProofToMerklePath, convertProofToMerklePathWithLookup, validateOptionalEnvelopeEvidence, resolveOptionalEnvelopeEvidence } from './utils/toBEEF'
export { toBEEFfromEnvelope, convertMerklePathToProof, convertProofToMerklePath, convertProofToMerklePathWithLookup, validateOptionalEnvelopeEvidence, resolveOptionalEnvelopeEvidence }
import { WalletError, WERR_BAD_REQUEST, WERR_INTERNAL, WERR_INVALID_PARAMETER, WERR_MISSING_PARAMETER, WERR_NETWORK_CHAIN, WERR_NOT_IMPLEMENTED, WERR_UNAUTHORIZED } from './sdk/index'
export { WalletError, WERR_BAD_REQUEST, WERR_INTERNAL, WERR_INVALID_PARAMETER, WERR_MISSING_PARAMETER, WERR_NETWORK_CHAIN, WERR_NOT_IMPLEMENTED, WERR_UNAUTHORIZED }

export * from './types'
export * as Helpers from './utils/Helpers'
export * as sdk from './sdk/index'

export const BabbageSDK = {
  abortAction,
  createAction,
  createHmac,
  createCertificate,
  createSignature,
  decrypt, decryptAsArray, decryptAsString,
  discoverByAttributes,
  discoverByIdentityKey,
  getPreferredCurrency,
  encrypt, encryptAsArray, encryptAsString,
  getCertificates,
  getHeight,
  getInfo,
  getMerkleRootForHeight,
  getNetwork,
  getPublicKey,
  getEnvelopeForTransaction,
  getTransactionOutputs,
  getVersion,
  isAuthenticated,
  listActions,
  proveCertificate,
  requestGroupPermission,
  revealKeyLinkage, revealKeyLinkageCounterparty, revealKeyLinkageSpecific,
  signAction,
  submitDirectTransaction,
  unbasketOutput,
  verifyHmac,
  verifySignature,
  waitForAuthentication,
}

export default BabbageSDK
