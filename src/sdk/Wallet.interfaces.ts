import {
  AtomicBEEF,
  Base64String,
  BasketStringUnder300Characters,
  BEEF,
  BooleanDefaultFalse,
  BooleanDefaultTrue,
  Byte,
  CertificateFieldNameUnder50Characters,
  DescriptionString5to50Characters,
  EntityIconURLStringMax500Characters,
  EntityNameStringMax100Characters,
  HexString,
  ISOTimestampString,
  KeyIDStringUnder800Characters,
  LabelStringUnder300Characters,
  OriginatorDomainNameString,
  OutpointString,
  OutputTagStringUnder300Characters,
  PositiveInteger,
  PositiveIntegerDefault10Max10000,
  PositiveIntegerMax10,
  PositiveIntegerOrZero,
  ProtocolString5To400Characters,
  PubKeyHex,
  SatoshiValue,
  TXIDHexString,
  VersionString7To30Characters
} from './Wallet.interface'

export type {
  AtomicBEEF,
  Base64String,
  BasketStringUnder300Characters,
  BEEF,
  BooleanDefaultFalse,
  BooleanDefaultTrue,
  Byte,
  CertificateFieldNameUnder50Characters,
  DescriptionString5to50Characters,
  EntityIconURLStringMax500Characters,
  EntityNameStringMax100Characters,
  HexString,
  ISOTimestampString,
  KeyIDStringUnder800Characters,
  LabelStringUnder300Characters,
  OriginatorDomainNameString,
  OutpointString,
  OutputTagStringUnder300Characters,
  PositiveInteger,
  PositiveIntegerDefault10Max10000,
  PositiveIntegerMax10,
  PositiveIntegerOrZero,
  ProtocolString5To400Characters,
  PubKeyHex,
  SatoshiValue,
  TXIDHexString,
  VersionString7To30Characters
}

export type WalletNetwork = 'mainnet' | 'testnet'

export type WalletProtocol = [0 | 1 | 2, ProtocolString5To400Characters]

export type WalletCounterparty = PubKeyHex | 'self' | 'anyone'

export type AcquisitionProtocol = 'direct' | 'issuance'

export type KeyringRevealer = PubKeyHex | 'certifier'

export type ActionStatus = | 'completed' | 'unprocessed' | 'sending' | 'unproven' | 'unsigned' | 'nosend' | 'nonfinal'

/**
 * Controls behavior of input BEEF validation.
 * 
 * If `known`, input transactions may omit supporting validity proof data for all TXIDs known to this wallet.
 * 
 * If undefined, input BEEFs must be complete and valid.
 */
export type TrustSelf = 'known'

/**
   * @param {OutpointString} outpoint - The outpoint being consumed.
   * @param {DescriptionString5to50Characters} inputDescription - A description of this input for contextual understanding of what it consumes.
   * @param {HexString} unlockingScript - Optional. The unlocking script needed to release the specified UTXO.
   * @param {PositiveInteger} unlockingScriptLength - Optional. Length of the unlocking script, in case it will be provided later using `signAction`.
   * @param {PositiveIntegerOrZero} sequenceNumber - Optional. The sequence number applied to the input.
 */
export interface CreateActionInput {
  outpoint: OutpointString
  inputDescription: DescriptionString5to50Characters
  unlockingScript?: HexString
  unlockingScriptLength?: PositiveInteger
  sequenceNumber?: PositiveIntegerOrZero
}

/**
   * @param {HexString} lockingScript - The locking script that dictates how the output can later be spent.
   * @param {SatoshiValue} satoshis - Number of Satoshis that constitute this output.
   * @param {DescriptionString5to50Characters} outputDescription - Description of what this output represents.
   * @param {BasketStringUnder300Characters} [basket] - Name of the basket where this UTXO will be held, if tracking is desired.
   * @param {string} [customInstructions] - Custom instructions attached onto this UTXO, often utilized within application logic to provide necessary unlocking context or track token histories.
   * @param {OutputTagStringUnder300Characters[]} [tags] - Tags assigned to the output for sorting or filtering.
 */
export interface CreateActionOutput {
  lockingScript: HexString
  satoshis: SatoshiValue
  outputDescription: DescriptionString5to50Characters
  basket?: BasketStringUnder300Characters
  customInstructions?: string
  tags?: OutputTagStringUnder300Characters[]
}

/**
   * @param {BooleanDefaultTrue} [signAndProcess] - Optional. If true and all inputs have unlockingScripts, the new transaction will be signed and handed off for processing by the network; result `txid` and `tx` are valid and `signableTransaciton` is undefined. If false or an input has an unlockingScriptLength, result `txid` and `tx` are undefined and `signableTransaction` is valid.
   * @param {BooleanDefaultTrue} [acceptDelayedBroadcast] - Optional. If true, the transaction will be sent to the network by a background process; use `noSend` and `sendWith` options to batch chained transactions. If false, the transaction will be broadcast to the network and any errors returned in result; note that rapidly sent chained transactions may still fail due to network propagation delays.
   * @param {'known'} [trustSelf] - Optional. If `known`, input transactions may omit supporting validity proof data for TXIDs known to this wallet.
   * @param {TXIDHexString[]} [knownTxids] - Optional. When working with large chained transactions using `noSend` and `sendWith` options, include TXIDs of inputs that may be assumed to be valid even if not already known by this wallet.
   * @param {BooleanDefaultFalse} [returnTXIDOnly] - Optional. If true, only a TXID will be returned instead of a transaction.
   * @param {BooleanDefaultFalse} [noSend] - Optional. If true, the transaction will be constructed but not sent to the network. Supports the creation of chained batches of transactions using the `sendWith` option.
   * @param {Array<OutPoint>} [noSendChange] - Optional. Valid when `noSend` is true. May contain `noSendChange` outpoints previously returned by prior `noSend` actions in the same batch of chained actions.
   * @param {Array<TXIDHexString>} [sendWith] - Optional. Sends a batch of actions previously created as `noSend` actions to the network; either synchronously if `acceptDelayedBroadcast` is true or by a background process.
   * @param {BooleanDefaultTrue} [randomizeOutputs] — optional. When set to false, the wallet will avoid randomizing the order of outputs within the transaction.
 */
export interface CreateActionOptions {
  signAndProcess?: BooleanDefaultTrue
  acceptDelayedBroadcast?: BooleanDefaultTrue
  trustSelf?: TrustSelf
  knownTxids?: TXIDHexString[]
  returnTXIDOnly?: BooleanDefaultFalse
  noSend?: BooleanDefaultFalse
  noSendChange?: OutpointString[]
  sendWith?: TXIDHexString[]
  randomizeOutputs?: BooleanDefaultTrue
}

export interface SendWithResult {
  txid: TXIDHexString
  status: 'unproven' | 'sending' | 'failed'
}

export interface SignableTransaction {
  tx: AtomicBEEF
  reference: Base64String
}

export interface CreateActionResult {
  txid?: TXIDHexString
  tx?: AtomicBEEF
  noSendChange?: OutpointString[]
  sendWithResults?: Array<SendWithResult>
  signableTransaction?: SignableTransaction
}

/**
   * @param {DescriptionString5to50Characters} description - A human-readable description of the action represented by this transaction.
   * @param {BEEF} [inputBEEF] - BEEF data associated with the set of input transactions from which UTXOs will be consumed.
   * @param {Array<Object>} [inputs] - An optional array of input objects used in the transaction.
   * @param {Array<Object>} [outputs] - An optional array of output objects for the transaction.
   * @param {PositiveIntegerOrZero} [lockTime] - Optional lock time for the transaction.
   * @param {PositiveInteger} [version] - Optional transaction version specifier.
   * @param {LabelStringUnder300Characters[]} [labels] - Optional labels providing additional categorization for the transaction.
   * @param {Object} [options] - Optional settings modifying transaction processing behavior.
 */
export interface CreateActionArgs {
  description: DescriptionString5to50Characters
  inputBEEF?: BEEF
  inputs?: Array<CreateActionInput>
  outputs?: Array<CreateActionOutput>
  lockTime?: PositiveIntegerOrZero
  version?: PositiveIntegerOrZero
  labels?: LabelStringUnder300Characters[]
  options?: CreateActionOptions
}

/**
   * @param {HexString} unlockingScript - The unlocking script for the corresponding input.
   * @param {PositiveIntegerOrZero} [sequenceNumber] - The sequence number of the input.
 */
export interface SignActionSpend {
  unlockingScript: HexString
  sequenceNumber?: PositiveIntegerOrZero
}

/**
   * @param {BooleanDefaultTrue} [acceptDelayedBroadcast] - Optional. If true, transaction will be sent to the network by a background process; use `noSend` and `sendWith` options to batch chained transactions. If false, transaction will be broadcast to the network and any errors returned in result; note that rapidly sent chained transactions may still fail due to network propagation delays.
   * @param {'known'} [trustSelf] - Optional. If `known`, input transactions may omit supporting validity proof data for TXIDs known to this wallet or included in `knownTxids`.
   * @param {TXIDHexString[]} [knownTxids] - Optional. When working with large chained transactions using `noSend` and `sendWith` options, include TXIDs of inputs that may be assumed to be valid even if not already known by this wallet.
   * @param {BooleanDefaultFalse} [returnTXIDOnly] - Optional. If true, only a TXID will be returned instead of a transaction.
   * @param {BooleanDefaultFalse} [noSend] - Optional. If true, the transaction will be constructed but not sent to the network. Supports the creation of chained batches of transactions using the `sendWith` option.
   * @param {Array<TXIDHexString>} [sendWith] - Optional. Sends a batch of actions previously created as `noSend` actions to the network; either synchronously if `acceptDelayedBroadcast` is true or by a background process.
 */
export interface SignActionOptions {
  acceptDelayedBroadcast?: BooleanDefaultTrue
  returnTXIDOnly?: BooleanDefaultFalse
  noSend?: BooleanDefaultFalse
  sendWith?: TXIDHexString[]
}

/**
   * @param {Record<PositiveIntegerOrZero, Object>} spends - Map of input indexes to the corresponding unlocking script and optional sequence number.
   * @param {Base64String} reference - Reference number returned from the call to `createAction`.
   * @param {Object} [options] - Optional settings modifying transaction processing behavior.
 */
export interface SignActionArgs {
  spends: Record<PositiveIntegerOrZero, SignActionSpend>
  reference: Base64String
  options?: SignActionOptions
}

/**
 * 
 */
export interface SignActionResult {
  txid?: TXIDHexString
  tx?: AtomicBEEF
  sendWithResults?: Array<SendWithResult>
}

/**
   * @param {Base64String} reference - Reference number for the transaction to abort.
 */
export interface AbortActionArgs {
  reference: Base64String
}

export interface AbortActionResult {
  aborted: true
}

/**
   * @param {LabelStringUnder300Characters[]} labels - An array of labels used to filter actions.
   * @param {'any' | 'all'} [labelQueryMode] - Specifies how to match labels (default is any which matches any of the labels).
   * @param {BooleanDefaultFalse} [includeLabels] - Whether to include transaction labels in the result set.
   * @param {boolean} [includeInputs] - Whether to include input details in the result set.
   * @param {boolean} [includeInputSourceLockingScripts] - Whether to include input source locking scripts in the result set.
   * @param {boolean} [includeInputUnlockingScripts] - Whether to include input unlocking scripts in the result set.
   * @param {boolean} [includeOutputs] - Whether to include output details in the result set.
   * @param {boolean} [includeOutputLockingScripts] - Whether to include output locking scripts in the result set.
   * @param {PositiveIntegerDefault10Max10000} [limit] - The maximum number of transactions to retrieve.
   * @param {PositiveIntegerOrZero} [offset] - Number of transactions to skip before starting to return the results.
   * @param {BooleanDefaultTrue} [seekPermission] — Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export interface ListActionsArgs {
  labels: LabelStringUnder300Characters[]
  labelQueryMode?: 'any' | 'all'
  includeLabels?: BooleanDefaultFalse
  includeInputs?: BooleanDefaultFalse
  includeInputSourceLockingScripts?: BooleanDefaultFalse
  includeInputUnlockingScripts?: BooleanDefaultFalse
  includeOutputs?: BooleanDefaultFalse
  includeOutputLockingScripts?: BooleanDefaultFalse
  limit?: PositiveIntegerDefault10Max10000
  offset?: PositiveIntegerOrZero
  seekPermission?: BooleanDefaultTrue
}

export interface WalletActionInput {
  sourceOutpoint: OutpointString
  sourceSatoshis: SatoshiValue
  sourceLockingScript?: HexString
  unlockingScript?: HexString
  inputDescription: DescriptionString5to50Characters
  sequenceNumber: PositiveIntegerOrZero
}

export interface WalletActionOutput {
  satoshis: SatoshiValue
  spendable: boolean
  outputIndex: PositiveIntegerOrZero
  outputDescription: DescriptionString5to50Characters

  lockingScript?: HexString
  customInstructions?: string

  basket: BasketStringUnder300Characters
  tags: OutputTagStringUnder300Characters[]
}

export interface WalletOutput {
  outpoint: OutpointString
  satoshis: SatoshiValue
  spendable: boolean

  basket?: string
  customInstructions?: string
  lockingScript?: HexString

  tags?: OutputTagStringUnder300Characters[]
  labels?: LabelStringUnder300Characters[]
}

export interface WalletAction {
  txid: TXIDHexString
  satoshis: SatoshiValue
  status: ActionStatus
  isOutgoing: boolean
  description: DescriptionString5to50Characters
  labels?: LabelStringUnder300Characters[]
  version: PositiveIntegerOrZero
  lockTime: PositiveIntegerOrZero
  inputs?: Array<WalletActionInput>
  outputs?: Array<WalletActionOutput>
}

export interface ListActionsResult {
  totalActions: PositiveIntegerOrZero
  actions: Array<WalletAction>
}

/**
   * @param {Base64String} derivationPrefix - Payment-level derivation prefix used by the sender for key derivation (for payments).
   * @param {Base64String} derivationSuffix - Specific output-level derivation suffix used by the sender for key derivation (for payments).
   * @param {PubKeyHex} senderIdentityKey - Public identity key of the sender (for payments).
 */
export interface WalletPayment {
  derivationPrefix: Base64String
  derivationSuffix: Base64String
  senderIdentityKey: PubKeyHex
}

/**
   * @param {BasketStringUnder300Characters} basket - Basket in which to place the output (for insertions).
   * @param {string} [customInstructions] - Optionally provided custom instructions attached to the output (for insertions).
   * @param {OutputTagStringUnder300Characters[]} [tags] - Tags attached to the output (for insertions).
 */
export interface BasketInsertion {
  basket: BasketStringUnder300Characters
  customInstructions?: string
  tags?: OutputTagStringUnder300Characters[]
}

/**
   * @param {PositiveIntegerOrZero} outputIndex - Index of the output within the transaction.
   * @param {'payment' | 'insert'} protocol - Specifies whether the output is a payment (to be received into the wallet balance) or an insert operation (into a particular basket).
   * @param {Object} [paymentRemittance] - Remittance data, structured accordingly for the payment operation.
   * @param {Object} [insertionRemittance] - Remittance data, structured accordingly for the insertion operation.
 */
export interface InternalizeOutput {
  outputIndex: PositiveIntegerOrZero
  protocol: 'wallet payment' | 'basket insertion'
  paymentRemittance?: WalletPayment
  insertionRemittance?: BasketInsertion
}

/**
   * @param {BEEF} tx - Atomic BEEF-formatted transaction to internalize.
   * @param {Array<Object>} outputs - Metadata about outputs, processed differently based on payment or insertion types.
   * @param {DescriptionString5to50Characters} description - Human-readable description of the transaction being internalized.
   * @param {LabelStringUnder300Characters[]} [labels] - Optional labels associated with this transaction.
   * @param {BooleanDefaultTrue} [seekPermission] — Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export interface InternalizeActionArgs {
  tx: AtomicBEEF
  outputs: Array<InternalizeOutput>
  description: DescriptionString5to50Characters
  labels?: LabelStringUnder300Characters[]
  seekPermission?: BooleanDefaultTrue
}

export interface InternalizeActionResult {
  accepted: true
}

/**
   * @param {BasketStringUnder300Characters} basket - The associated basket name whose outputs should be listed.
   * @param {OutputTagStringUnder300Characters[]} [tags] - Filter outputs based on these tags.
   * @param {'all' | 'any'} [tagQueryMode] - Filter mode, defining whether all or any of the tags must match. By default, any tag can match.
   * @param {'locking scripts' | 'entire transactions'} [include] - Whether to include locking scripts (with each output) or entire transactions (as aggregated BEEF, at the top level) in the result. By default, unless specified, neither are returned.
   * @param {BooleanDefaultFalse} [includeEntireTransactions] - Whether to include the entire transaction(s) in the result.
   * @param {BooleanDefaultFalse} [includeCustomInstructions] - Whether custom instructions should be returned in the result.
   * @param {BooleanDefaultFalse} [includeTags] - Whether the tags associated with the output should be returned.
   * @param {BooleanDefaultFalse} [includeLabels] - Whether the labels associated with the transaction containing the output should be returned.
   * @param {PositiveIntegerDefault10Max10000} [limit] - Optional limit on the number of outputs to return.
   * @param {PositiveIntegerOrZero} [offset] - Number of outputs to skip before starting to return results.
   * @param {BooleanDefaultTrue} [seekPermission] — Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
   * 
   * Extensions:
   * @param {BooleanDefaultFalse} [includeBasket] - Whether the basket associated with the output should be returned.
   * @param {BooleanDefaultFalse} [includeSpent] - Whether to include spent outputs, that is outputs with `spendable` = false.
   * @param {BooleanDefaultFalse} [includeLockingScript] - Whether each output includes the `lockingscript`. Equivalent to `include` = `'locking scripts'`.
   * @param {BooleanDefaultFalse} [includeTransaction] - Whether to include BEEF result with just raw transactions. Equivalent to `include` = `'entire transactions'`
   * @param {BooleanDefaultFalse} [includeBEEF] - Whether to include BEEF result with raw transactions and transaction proof data.
   * 
 */
export interface ListOutputsArgs {
  basket?: BasketStringUnder300Characters
  tags?: OutputTagStringUnder300Characters[]
  tagQueryMode?: 'all' | 'any'
  includeSpent?: BooleanDefaultFalse
  includeCustomInstructions?: BooleanDefaultFalse
  includeBasket?: BooleanDefaultFalse
  includeTags?: BooleanDefaultFalse
  includeLabels?: BooleanDefaultFalse
  include?: 'locking scripts' | 'entire transactions'
  includeLockingScript?: BooleanDefaultFalse
  includeTransaction?: BooleanDefaultFalse
  includeBEEF?: BooleanDefaultFalse
  limit?: PositiveIntegerDefault10Max10000
  offset?: PositiveIntegerOrZero
  seekPermission?: BooleanDefaultTrue
}

export interface ListOutputsResult {
  totalOutputs: PositiveIntegerOrZero
  BEEF?: BEEF
  outputs: Array<WalletOutput>
}

export interface RelinquishOutputArgs {
  basket: BasketStringUnder300Characters
  output: OutpointString
}

export interface RelinquishOutputResult {
  relinquished: true
}

/**
   * @param {WalletProtocol} protocolID - The security level and protocol string under which the data should be encrypted.
   * @param {KeyIDStringUnder800Characters} keyID - Key ID under which the encryption will be performed.
   * @param {DescriptionString5to50Characters} [privilegedReason] - Reason provided for privileged access, required if this is a privileged operation.
   * @param {WalletCounterparty} [counterparty] - Public key of the counterparty (if two-party encryption is desired).
   * @param {BooleanDefaultFalse} [privileged] - Whether this is a privileged request.
   * @param {BooleanDefaultTrue} [seekPermission] — Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export interface WalletEncryptionArgs {
  protocolID: WalletProtocol
  keyID: KeyIDStringUnder800Characters
  counterparty?: WalletCounterparty
  privileged?: BooleanDefaultFalse
  privilegedReason?: DescriptionString5to50Characters
  seekPermission?: BooleanDefaultTrue
}

/**
   * When `identityKey` is true, `WalletEncryptionArgs` are not used.
   * 
   * When `identityKey` is undefined, `WalletEncryptionArgs` are required.
   * 
   * @param {BooleanDefaultFalse|true} [identityKey] - Use true to retrieve the current user's own identity key, overriding any protocol ID, key ID, or counterparty specified.
   * @param {BooleanDefaultFalse} [forSelf] - Whether to return the public key derived from the current user's own identity (as opposed to the counterparty's identity).
 */
export interface GetPublicKeyArgs extends Partial<WalletEncryptionArgs> {
  identityKey?: true
  forSelf?: BooleanDefaultFalse
}

/**
   * @param {PubKeyHex} counterparty - The public key of the counterparty involved in the linkage.
   * @param {PubKeyHex} verifier - The public key of the verifier requesting the linkage information.
   * @param {DescriptionString5to50Characters} [privilegedReason] - Reason provided for privileged access, required if this is a privileged operation.
   * @param {BooleanDefaultFalse} [privileged] - Whether this is a privileged request.
 */
export interface RevealCounterpartyKeyLinkageArgs {
  counterparty: PubKeyHex
  verifier: PubKeyHex
  privileged?: BooleanDefaultFalse
  privilegedReason?: DescriptionString5to50Characters
}

/**
   * @param {PubKeyHex} counterparty - The public key of the counterparty involved in the linkage.
   * @param {PubKeyHex} verifier - The public key of the verifier requesting the linkage information.
   * @param {WalletProtocol} protocolID - The security level and protocol string associated with the linkage information to reveal.
   * @param {KeyIDStringUnder800Characters} keyID - The key ID associated with the linkage information to reveal.
   * @param {DescriptionString5to50Characters} [privilegedReason] - Optional. Reason provided for privileged access, required if this is a privileged operation.
   * @param {BooleanDefaultFalse} [privileged] - Optional. Whether this is a privileged request.
 */
export interface RevealSpecificKeyLinkageArgs {
  counterparty: WalletCounterparty
  verifier: PubKeyHex
  protocolID: WalletProtocol
  keyID: KeyIDStringUnder800Characters
  privilegedReason?: DescriptionString5to50Characters
  privileged?: BooleanDefaultFalse
}

/**
 */
export interface KeyLinkageResult {
  encryptedLinkage: Byte[]
  encryptedLinkageProof: Byte[]
  prover: PubKeyHex
  verifier: PubKeyHex
  counterparty: PubKeyHex
}

/**
 */
export interface RevealCounterpartyKeyLinkageResult extends KeyLinkageResult {
  revelationTime: ISOTimestampString
}

/**
 */
export interface RevealSpecificKeyLinkageResult extends KeyLinkageResult {
  protocolID: WalletProtocol
  keyID: KeyIDStringUnder800Characters
  proofType: Byte
}

/**
   * @param {Byte[]} plaintext - Array of bytes constituting the plaintext data to be encrypted.
 */
export interface WalletEncryptArgs extends WalletEncryptionArgs {
  plaintext: Byte[]
}

export interface WalletEncryptResult {
  ciphertext: Byte[]
}

/**
   * @param {Byte[]} ciphertext - Encrypted bytes, including the initialization vector, for decryption.
 */
export interface WalletDecryptArgs extends WalletEncryptionArgs {
  ciphertext: Byte[]
}

export interface WalletDecryptResult {
  plaintext: Byte[]
}

/**
   * @param {Byte[]} data - Input data (in bytes) for which the HMAC needs to be created.
 */
export interface CreateHmacArgs extends WalletEncryptionArgs {
  data: Byte[]
}

export interface CreateHmacResult {
  hmac: Byte[]
}

/**
   * @param {Byte[]} data - The input data whose HMAC is to be verified.
   * @param {Byte[]} hmac - Byte array representing the HMAC value to be verified.
 */
export interface VerifyHmacArgs extends WalletEncryptionArgs {
  data: Byte[]
  hmac: Byte[]
}

export interface VerifyHmacResult {
  valid: true
}

/**
   * @param {Byte[]} [data] - Data to be signed using the derived private key with ECDSA. Required unless directly signing a hash.
   * @param {Byte[]} [hashToDirectlySign] - Sign a pre-hashed value in situations where data can't or shouldn't be revealed, whether due to its size or for privacy.
 */
export interface CreateSignatureArgs extends WalletEncryptionArgs {
  data?: Byte[]
  hashToDirectlySign?: Byte[]
}

export interface CreateSignatureResult {
  signature: Byte[]
}

/**
   * @param {Byte[]} [args.data] - The data originally signed, which is required for verification unless directly verifying a hash.
   * @param {Byte[]} [args.hashToDirectlyVerify] - Optional field to verify the signature against a precomputed hash instead of data.
   * @param {Byte[]} args.signature - The DER-encoded ECDSA signature to validate.
   * @param {BooleanDefaultFalse} [args.forSelf] - Whether the signature to be verified was created by this user rather than the counterparty.
 */
export interface VerifySignatureArgs extends WalletEncryptionArgs {
  data?: Byte[]
  hashToDirectlyVerify?: Byte[]
  signature: Byte[]
  forSelf?: BooleanDefaultFalse
}

export interface VerifySignatureResult {
  valid: true
}

/**
   * @param {Base64String} type - Type identifier for the certificate.
   * @param {PubKeyHex} certifier - The public identity key of the certifier.
   * @param {AcquisitionProtocol} acquisitionProtocol - Specifies the acquisition process, set to either 'issuance' or 'direct'.
   * @param {Record<CertificateFieldNameUnder50Characters, string>} fields - The fields included within the certificate.
   * @param {Base64String} [serialNumber] - Serial number of the certificate to acquire (required when the acquisition protocol is direct).
   * @param {string} [revocationOutpoint] - Reference for an outpoint comprising a Bitcoin token that, if ever spent, marks the certificate as invalid (required when the acquisition protocol is direct).
   * @param {HexString} [signature] - Signature over the certificate (required when the acquisition protocol is direct).
   * @param {string} [certifierUrl] - URL of the certifier where certificate acquisition requests will be sent (required when the acquisition protocol is issuance).
   * @param {KeyringRevealer} [keyringRevealer] - The public identity key of the entity revealing the keyring to the user, if different from the certifier (required when the acquisition protocol is direct).
   * @param {Record<CertificateFieldNameUnder50Characters, Base64String>} [keyringForSubject] - Keyring revealing all certificate fields to the subject (required when the acquisition protocol is direct).
   * @param {BooleanDefaultFalse} [privileged] - Whether this is a privileged request.
   * @param {DescriptionString5to50Characters} [privilegedReason] - Reason provided for privileged access, required if this is a privileged operation.
 */
export interface AcquireCertificateArgs {
  type: Base64String
  certifier: PubKeyHex
  acquisitionProtocol: AcquisitionProtocol
  fields: Record<CertificateFieldNameUnder50Characters, string>
  serialNumber?: Base64String
  revocationOutpoint?: OutpointString
  signature?: HexString
  certifierUrl?: string
  keyringRevealer?: KeyringRevealer
  keyringForSubject?: Record<CertificateFieldNameUnder50Characters, Base64String>
  privileged?: BooleanDefaultFalse
  privilegedReason?: DescriptionString5to50Characters
}

export interface WalletCertificate {
  type: Base64String
  subject: PubKeyHex
  serialNumber: Base64String
  certifier: PubKeyHex
  revocationOutpoint: OutpointString
  signature: HexString
  fields: Record<CertificateFieldNameUnder50Characters, string>
}

export interface IdentityCertifier {
  name: EntityNameStringMax100Characters
  iconUrl: EntityIconURLStringMax500Characters
  description: DescriptionString5to50Characters
  trust: PositiveIntegerMax10
}

export interface IdentityCertificate extends WalletCertificate {
  certifierInfo: IdentityCertifier
  publiclyRevealedKeyring: Record<CertificateFieldNameUnder50Characters, Base64String>
  decryptedFields: Record<CertificateFieldNameUnder50Characters, string>
}

export interface AcquireCertificateResult extends WalletCertificate {
}

/**
   * @param {PubKeyHex[]} certifiers - An array of public keys for specific certifiers (filters by these certifiers).
   * @param {Base64String[]} types - An array of certificate types issued by any of the specified certifiers, which should be returned.
   * @param {PositiveIntegerDefault10Max10000} [limit] - Maximum number of certificates to return.
   * @param {PositiveIntegerOrZero} [offset] - Number of records to skip before starting to return results.
   * @param {BooleanDefaultFalse} [privileged] - Whether this is a privileged request.
   * @param {DescriptionString5to50Characters} [privilegedReason] - Reason provided for privileged access, required if this is a privileged operation.
 */
export interface ListCertificatesArgs {
  certifiers: PubKeyHex[]
  types: Base64String[]
  limit?: PositiveIntegerDefault10Max10000
  offset?: PositiveIntegerOrZero
  privileged?: BooleanDefaultFalse
  privilegedReason?: DescriptionString5to50Characters
}

export interface ListCertificatesResult {
  totalCertificates: PositiveIntegerOrZero
  certificates: Array<WalletCertificate>
}

/**
   * @param {WalletCertificate} certificate - The specific identity certificate being proven.
   * @param {CertificateFieldNameUnder50Characters[]} fieldsToReveal - Array of field names that need to be revealed to the verifier.
   * @param {PubKeyHex} verifier - Public key of the verifier, to whom the key revelations will be made.
   * @param {BooleanDefaultFalse} [privileged] - Whether this is a privileged request.
   * @param {DescriptionString5to50Characters} [privilegedReason] - Reason provided for privileged access, required if this is a privileged operation.
 */
export interface ProveCertificateArgs {
  certificate: WalletCertificate
  fieldsToReveal: CertificateFieldNameUnder50Characters[]
  verifier: PubKeyHex
  privileged?: BooleanDefaultFalse
  privilegedReason?: DescriptionString5to50Characters
}

export interface ProveCertificateResult {
  keyringForVerifier: Record<CertificateFieldNameUnder50Characters, Base64String>
}

/**
   * @param {Base64String} type - Type identifier for the certificate.
   * @param {PubKeyHex} certifier - The public identity key of the certifier.
   * @param {Base64String} serialNumber - Serial number of the certificate to relinquish.
 */
export interface RelinquishCertificateArgs {
  type: Base64String
  serialNumber: Base64String
  certifier: PubKeyHex
}

export interface RelinquishCertificateResult {
  relinquished: boolean
}

export interface AuthenticatedResult {
  authenticated: boolean
}

export interface GetHeightResult {
  height: PositiveInteger
}

/**
 * @param {PositiveInteger} height - Specifies the height at which the block header needs to be retrieved.
 */
export interface GetHeaderArgs {
  height: PositiveInteger
}

export interface GetHeaderResult {
  header: HexString
}

export interface GetNetworkResult {
  network: WalletNetwork
}

export interface GetVersionResult {
  version: VersionString7To30Characters
}

/**
   * @param {PubKeyHex} identityKey - Identity key used to filter and discover certificates.
   * @param {PositiveIntegerDefault10Max10000} [limit] - Maximum number of certificates to return in the response.
   * @param {PositiveIntegerOrZero} [offset] - Skip this number of records before starting to provide results.
   * @param {BooleanDefaultTrue} [seekPermission] — Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export interface DiscoverByIdentityKeyArgs {
  identityKey: PubKeyHex
  limit?: PositiveIntegerDefault10Max10000
  offset?: PositiveIntegerOrZero
  seekPermission?: BooleanDefaultTrue
}

/**
 */
export interface DiscoverCertificatesResult {
  totalCertificates: PositiveIntegerOrZero
  certificates: Array<IdentityCertificate>
}

/**
   * @param {Record<CertificateFieldNameUnder50Characters, string>} attributes - The attributes used to discover the certificates.
   * @param {PositiveIntegerDefault10Max10000} [limit] - Optional limit on the number of results returned.
   * @param {PositiveIntegerOrZero} [offset] - Starts retrieval of results after the specified number of records.
   * @param {BooleanDefaultTrue} [seekPermission] — Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export interface DiscoverByAttributesArgs {
  attributes: Record<CertificateFieldNameUnder50Characters, string>
  limit?: PositiveIntegerDefault10Max10000
  offset?: PositiveIntegerOrZero
  seekPermission?: BooleanDefaultTrue
}

/**
 * Every method of the `Wallet` interface has a return value of the form `Promise<object>`.
 * When errors occur, an exception object may be thrown which must conform to the `WalletError` interface.
 * Serialization layers can rely on the `isError` property being unique to error objects.
 * Deserialization should rethrow `WalletError` conforming objects.
 */
export interface WalletErrorApi extends Error {
  isError: true
}

/**
 * The WalletCryptoApi interface defines a wallet cryptographic capabilities including:
 * key derivation, encryption, decryption, hmac creation and verification, signature generation and verification
 *
 * Error Handling
 * 
 * Every method of the `Wallet` interface has a return value of the form `Promise<object>`.
 * When an error occurs, an exception object may be thrown which must conform to the `WalletError` interface.
 * Serialization layers can rely on the `isError` property being unique to error objects to
 * deserialize and rethrow `WalletError` conforming objects.
 */
export interface WalletCryptoApi {
  /**
   * Retrieves a derived or identity public key based on the requested protocol, key ID, counterparty, and other factors.
   *
   * @param {GetPublicKeyArgs} args - Arguments to specify which public key to retrieve.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} Resolves to an object containing the public key, or an error response.
   */
  getPublicKey: (
    args: GetPublicKeyArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<{ publicKey: PubKeyHex }>

  /**
   * Reveals the key linkage between ourselves and a counterparty, to a particular verifier, across all interactions with the counterparty.
   *
   * @param {RevealCounterpartyKeyLinkageArgs} args - Contains information about counterparty, verifier, and whether the operation is privileged.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} Resolves to the key linkage, or an error response.
   */
  revealCounterpartyKeyLinkage: (
    args: RevealCounterpartyKeyLinkageArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<RevealCounterpartyKeyLinkageResult>

  /**
   * Reveals the key linkage between ourselves and a counterparty, to a particular verifier, with respect to a specific interaction.
   *
   * @param {RevealSpecificKeyLinkageArgs} args - The object defining the counterparty, verifier, protocol, and keyID for which linkage should be revealed.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} The promise returns the requested linkage information, or an error object.
   */
  revealSpecificKeyLinkage: (
    args: RevealSpecificKeyLinkageArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<RevealSpecificKeyLinkageResult>

  /**
   * Encrypts the provided plaintext data using derived keys, based on the protocol ID, key ID, counterparty, and other factors.
   *
   * @param {WalletEncryptArgs} args - Information needed for encryption, including the plaintext, protocol ID, and key ID.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} Resolves to the encrypted ciphertext bytes or an error if encryption fails.
   */
  encrypt: (
    args: WalletEncryptArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<WalletEncryptResult>

  /**
   * Decrypts the provided ciphertext using derived keys, based on the protocol ID, key ID, counterparty, and other factors.
   *
   * @param {WalletDecryptArgs} args - Contains the ciphertext, protocol ID, and key ID required to decrypt the data.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} Resolves to the decryption result, containing the plaintext data or an error.
   */
  decrypt: (
    args: WalletDecryptArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<WalletDecryptResult>

  /**
   * Creates an HMAC (Hash-based Message Authentication Code) based on the provided data, protocol, key ID, counterparty, and other factors.
   *
   * @param {Object} args - Arguments containing the data, protocol ID, and key ID to generate the HMAC from.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} Resolves to an object containing the generated HMAC bytes, or an error if the creation fails.
   */
  createHmac: (
    args: CreateHmacArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<CreateHmacResult>

  /**
   * Verifies an HMAC (Hash-based Message Authentication Code) based on the provided data, protocol, key ID, counterparty, and other factors.
   *
   * @param {VerifyHmacArgs} args - Arguments containing the HMAC data, protocol ID, and key ID needed for verification.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} Resolves to an object confirming whether the HMAC was valid or an error.
   */
  verifyHmac: (
    args: VerifyHmacArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<{ valid: true }>

  /**
   * Creates a digital signature for the provided data or hash using a specific protocol, key, and optionally considering privilege and counterparty.
   *
   * @param {CreateSignatureArgs} args - Arguments to specify data, protocol, key ID, and privilege for creating the signature.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} The promise will resolve to an object containing the DER-encoded ECDSA signature, or an error on failure.
   */
  createSignature: (
    args: CreateSignatureArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<CreateSignatureResult>

  /**
   * Verifies a digital signature for the provided data or hash using a specific protocol, key, and optionally considering privilege and counterparty.
   *
   * @param {VerifySignatureArgs} args - Arguments specifying the data, signature, protocol, and key ID.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} The promise resolves to a boolean object indicating whether the signature was valid or an error message.
   */
  verifySignature: (
    args: VerifySignatureArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<VerifySignatureResult>

}

/**
 * The Wallet interface defines a wallet capable of various tasks including transaction creation and signing,
 * encryption, decryption, identity certificate management, identity verification, and communication
 * with applications as per the BRC standards. This interface allows applications to interact with
 * the wallet for a range of functionalities aligned with the Babbage architectural principles.
 * 
 * Error Handling
 * 
 * Every method of the `Wallet` interface has a return value of the form `Promise<object>`.
 * When an error occurs, an exception object may be thrown which must conform to the `WalletError` interface.
 * Serialization layers can rely on the `isError` property being unique to error objects to
 * deserialize and rethrow `WalletError` conforming objects.
 */
export interface WalletApi extends WalletCryptoApi {
  /**
   * Creates a new Bitcoin transaction based on the provided inputs, outputs, labels, locks, and other options.
   *
   * @param {CreateActionArgs} args - The arguments required to create the transaction.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<CreateActionResult>} The promise returns different structures based on the outcome: error response, response with TXID, response with transaction, or info about signable transaction (partial BEEF and reference number).
   */
  createAction: (
    args: CreateActionArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<CreateActionResult>

  /**
   * Signs a transaction previously created using `createAction`.
   *
   * @param {SignActionArgs} args - Arguments to sign the transaction.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<SignActionResult>} The promise returns an error response or a response with either the completed transaction or TXID.
   */
  signAction: (
    args: SignActionArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<SignActionResult>

  /**
   * Aborts a transaction that is in progress and has not yet been finalized or sent to the network.
   *
   * @param {AbortActionArgs} args - Arguments to identify the transaction that needs to be aborted.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<AbortActionResult>} The promise resolves to an object indicating the abortion result (either success or error).
   */
  abortAction: (
    args: AbortActionArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<AbortActionResult>

  /**
   * Lists all transactions matching the specified labels.
   *
   * @param {Object} args - Arguments to specify how to filter or retrieve transactions.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<ListActionsResult>} The promise resolves to an object containing actions, their metadata, inputs, and outputs if applicable, or an error object.
   */
  listActions: (
    args: ListActionsArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<ListActionsResult>

  /**
   * Submits a transaction to be internalized and optionally labeled, outputs paid to the wallet balance, inserted into baskets, and/or tagged.
   *
   * @param {InternalizeActionArgs} args - Arguments required to internalize the transaction.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<InternalizeActionResult>} The promise resolves to an object indicating the success of the operation or an error object.
   */
  internalizeAction: (
    args: InternalizeActionArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<InternalizeActionResult>

  /**
   * Lists the spendable outputs kept within a specific basket, optionally tagged with specific labels.
   *
   * @param {ListOutputsArgs} args - Arguments detailing the query for listing spendable outputs.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} The promise returns an output listing or an error object.
   */
  listOutputs: (
    args: ListOutputsArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<ListOutputsResult>

  /**
   * Relinquish an output out of a basket, removing it from tracking without spending it.
   *
   * @param {Object} args - Arguments identifying the output in the basket.
   * @param {BasketStringUnder300Characters} args.basket - The associated basket name where the output should be removed.
   * @param {OutpointString} args.outpoint - The output that should be removed from the basket.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} The promise returns an indication of successful removal or an error object.
   */
  relinquishOutput: (
    args: RelinquishOutputArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<RelinquishOutputResult>

  /**
   * Acquires an identity certificate, whether by acquiring one from the certifier or by directly receiving it.
   *
   * @param {AcquireCertificateArgs} args - Contains the type of certificate, certifier information, and fields of the certificate to be provided, among other details.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<AcquireCertificateResult>} The promise resolves to an object containing the acquired certificate, or an error object.
   */
  acquireCertificate: (
    args: AcquireCertificateArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<AcquireCertificateResult>

  /**
   * Lists identity certificates belonging to the user, filtered by certifier(s) and type(s).
   *
   * @param {ListCertificatesArgs} args - Arguments used to filter or limit the list of certificates returned by the request.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<ListCertificatesResult>} The promise resolves to an object containing certificates or an error response.
   */
  listCertificates: (
    args: ListCertificatesArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<ListCertificatesResult>

  /**
   * Proves select fields of an identity certificate, as specified, when requested by a verifier.
   *
   * @param {ProveCertificateArgs} args - Arguments including the certificate, fields to reveal, and verifier's public key.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<ProveCertificateResult>} Resolves to a keyring for the verifier or an error object.
   */
  proveCertificate: (
    args: ProveCertificateArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<ProveCertificateResult>

  /**
   * Relinquishes an identity certificate, removing it from the wallet regardless of whether the revocation outpoint has become spent.
   *
   * @param {RelinquishCertificateArgs} args - Contains the type of certificate, certifier, and serial number for relinquishment.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} The promise resolves to an indication of successful relinquishment or an error object.
   */
  relinquishCertificate: (
    args: RelinquishCertificateArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<RelinquishCertificateResult>

  /**
   * Discovers identity certificates, issued to a given identity key by a trusted entity.
   *
   * @param {DiscoverByIdentityKeyArgs} args - Arguments for requesting the discovery based on the identity key.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} The promise resolves to the list of certificates discovered or an error object.
   */
  discoverByIdentityKey: (
    args: DiscoverByIdentityKeyArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<DiscoverCertificatesResult>

  /**
   * Discovers identity certificates belonging to other users, where the documents contain specific attributes, issued by a trusted entity.
   *
   * @param {DiscoverByAttributesArgs} args - Attributes and optional parameters used to discover certificates.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<DiscoverByAttributesResult>} The promise resolves to a list of matching certificates or an error object.
   */
  discoverByAttributes: (
    args: DiscoverByAttributesArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<DiscoverCertificatesResult>

  /**
   * Checks the authentication status of the user.
   *
   * @param {Object} args - Empty object, as no parameters are needed.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<AuthenticatedResult>} The promise resolves to an object indicating whether the user is authenticated or an error response.
   */
  isAuthenticated: (
    args: {},
    originator?: OriginatorDomainNameString
  ) => Promise<AuthenticatedResult>

  /**
   * Continuously waits until the user is authenticated, returning the result once confirmed.
   *
   * @param {Object} args - Not used, pass an empty object.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<AuthenticatedResult>} The final result indicating that the user is authenticated or an error object.
   */
  waitForAuthentication: (
    args: {},
    originator?: OriginatorDomainNameString
  ) => Promise<AuthenticatedResult>

  /**
   * Retrieves the current height of the blockchain.
   *
   * @param {Object} args - Empty object as no other parameters are necessary.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<Object>} Resolves to an object indicating the current height or an error on failure.
   */
  getHeight: (
    args: {},
    originator?: OriginatorDomainNameString
  ) => Promise<GetHeightResult>

  /**
   * Retrieves the block header of a block at a specified height.
   *
   * @param {GetHeaderArgs} args - Contains the height parameter needed to retrieve the block header.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<GetHeaderResult>} The promise resolves to an 80-byte block header or an error if it cannot be retrieved.
   */
  getHeaderForHeight: (
    args: GetHeaderArgs,
    originator?: OriginatorDomainNameString
  ) => Promise<GetHeaderResult>

  /**
   * Retrieves the Bitcoin network the client is using (mainnet or testnet).
   *
   * @param {Object} args - No arguments required, pass an empty object.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<GetNetworkResult>} The promise resolves to an object indicating whether the client is using the mainnet or testnet.
   */
  getNetwork: (
    args: {},
    originator?: OriginatorDomainNameString
  ) => Promise<GetNetworkResult>

  /**
   * Retrieves the current version string of the wallet.
   *
   * @param {Object} args - Empty argument object.
   * @param {OriginatorDomainNameString} [originator] - Fully-qualified domain name (FQDN) of the application that originated the request.
   * @returns {Promise<GetVersionResult>} Resolves to an object containing the version string of the wallet, or an error.
   */
  getVersion: (
    args: {},
    originator?: OriginatorDomainNameString
  ) => Promise<GetVersionResult>
}