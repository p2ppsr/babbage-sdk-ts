/**
 * As defined in https://github.com/bitcoin-sv-specs/brfc-merchantapi/blob/master/README.md
 */
export interface TscMerkleProofApi {
  /**
     * The most efficient way of confirming a proof should also be the most common,
     * when the containing block's height is known.
     */
  height?: number
  /**
     * Index of transaction in its block. First transaction is index zero.
     */
  index: number
  /**
     * Full transaction (length > 32 bytes) or just its double SHA256 hash (length === 32 bytes).
     * If string, encoding is hex.
     */
  txOrId: string | Buffer
  /**
     * Merkle root (length === 32) or serialized block header containing it (length === 80).
     * If string, encoding is hex.
     */
  target: string | Buffer
  /**
     * Merkle tree sibling hash values required to compute root from txid.
     * Duplicates (sibling hash === computed hash) are indicated by "*" or type byte === 1.
     * type byte === 2...
     * Strings are encoded as hex.
     */
  nodes: string[] | Buffer
  targetType?: 'hash' | 'header' | 'merkleRoot' | 'height'
  proofType?: 'branch' | 'tree'
  composite?: boolean
}

export interface MapiResponseApi {
  /**
     * Contents of the envelope.
     * Validate using signature and publicKey.
     * encoding and mimetype may assist with decoding validated payload.
     */
  payload: string
  /**
     * signature producted by correpsonding private key on payload data
     */
  signature: string
  /**
     * public key to use to verify signature of payload data
     */
  publicKey: string
  /**
     * encoding of the payload data
     */
  encoding?: string // "UTF-8", "base64"
  /**
     * mime type of the payload data
     */
  mimetype?: string // "application/json", "image/jpeg"
}

/**
 * Simplest case of an envelope is a `rawTx` and merkle `proof` that ties the transaction to a known block header.
 * This will be the case for any sufficiently old transaction.
 *
 * If the transaction has been mined but for some reason the block headers may not be known, an array of `headers` linking
 * known headers to the one needed by the `proof` may be provided. They must be in height order and need to overlap
 * a known header.
 *
 * If the transaction has not been minded yet but it has been submitted to one or more miners then the mapi responses
 * received, proving that specific miners have received the transaction for processing, are included in the
 * mapiResponses array.
 * Note that the miner reputations must be checked to give weight to these responses.
 *
 * Additionally, when the transaction hasn't been mined or a `proof` is unavailable and mapi responses proving miner
 * acceptance are unavailable, then all the transactions providing inputs can be submitted in an inputs object.
 *
 * The keys of the inputs object are the transaction hashes (txids) of each of the input transactions.
 * The value of each inputs object property is another envelope object.
 *
 * References:
 * Section 2 of https://projectbabbage.com/assets/simplified-payments.pdf
 * https://gist.github.com/ty-everett/44b6a0e7f3d6c48439f9ff26068f8d8b
 */
export interface EnvelopeApi extends EnvelopeEvidenceApi {
  /**
     * For root nodes only.
     * Array of 80 byte block headers encoded as 160 character hex strings
     * Include headers the envelope creator is aware of but which the resipient may not have.
     */
  headers?: string[]
  /**
     * Arbitrary reference string associated with the envelope, typically root node only.
     */
  reference?: string
}

/**
 * Either inputs or proof are required.
 */
export interface EnvelopeEvidenceApi {
  /**
     * A valid bitcoin transaction encoded as a hex string.
     */
  rawTx: string
  /**
     * Either proof, or inputs, must have a value.
     * Leaf nodes have proofs.
     *
     * If value is a Buffer, content is binary encoded serialized proof
     * see: chaintracks-spv.utils.serializeTscMerkleProof
     */
  proof?: TscMerkleProofApi | Buffer
  /**
     * Only one of proof or inputs must be valid.
     * Branching nodes have inputs with a sub envelope (values) for every input transaction txid (keys)
     */
  inputs?: Record<string, EnvelopeEvidenceApi>
  /**
     * double SHA256 hash of serialized rawTx. Optional.
     */
  txid?: string
  /**
     * Array of mapi transaction status update responses
     * Only the payload, signature, and publicKey properties are relevant.
     *
     * Branching inputs nodes only.
     * Array of mapi transaction status update responses confirming
     * unproven transctions have at least been submitted for processing.
     */
  mapiResponses?: MapiResponseApi[]
  /**
     * count of maximum number of chained unproven transactions before a proven leaf node
     * proof nodes have depth zero.
     */
  depth?: number
}

export type ProtocolID = string | [ 0 | 1 | 2, string]

export interface CertificateApi {
   /**
      * max length of 255
      */
   type: string
   /**
      * max length of 255
      */
   subject: string
   /**
      * max length of 255
      */
   validationKey: string
   /**
      * max length of 255
      */
   serialNumber: string
   /**
      * max length of 255
      */
   certifier: string
   /**
      * max length of 255
      */
   revocationOutpoint: string
   /**
      * max length of 255
      */
   signature: string
   /**
      * Certificate fields object where keys are field names and values are field value.
      */
   fields?: Record<string, string>
}

export interface CreateCertificateResult extends CertificateApi {
   /**
      * max length of 255
      */
   type: string
   /**
      * max length of 255
      */
   subject: string
   /**
      * max length of 255
      */
   validationKey: string
   /**
      * max length of 255
      */
   serialNumber: string
   /**
      * max length of 255
      */
   certifier: string
   /**
      * max length of 255
      */
   revocationOutpoint: string
   /**
      * max length of 255
      */
   signature: string
   /**
      * Certificate fields object where keys are field names and values are field value.
      */
   fields?: Record<string, string>
   /**
      * Certificate masterKeyring object where keys are field names and values are field masterKey value.
      */
   masterKeyring?: Record<string, string>
}

export interface ProveCertificateResult extends CertificateApi {
   /**
      * max length of 255
      */
   type: string
   /**
      * max length of 255
      */
   subject: string
   /**
      * max length of 255
      */
   validationKey: string
   /**
      * max length of 255
      */
   serialNumber: string
   /**
      * max length of 255
      */
   certifier: string
   /**
      * max length of 255
      */
   revocationOutpoint: string
   /**
      * max length of 255
      */
   signature: string
  /**
   * Plaintext field names and values of only those fields requested in `fieldsToReveal`
   */
  fields?: Record<string, string>,
  /**
   * field revelation keyring for the given verifier
   */
  keyring: Record<string, string>
}

export type TransactionStatusApi = 'completed' | 'failed' | 'unprocessed' | 'sending' | 'unproven' | 'unsigned'

export interface ListActionsTransaction {
  /**
     * The transaction ID
     */
  txid: string
  /**
     * The number of satoshis added or removed from Dojo by this transaction
     */
  amount: number
  /**
     * The current state of the transaction. Common statuses are `completed` and `unproven`.
     */
  status: TransactionStatusApi
  /**
     * The Paymail handle of the person who sent the transaction
     */
  senderPaymail: string
  /**
     * The Paymail handle of the person who received the transaction
     */
  recipientPaymail: string
  /**
     * Whether or not the transaction was created with `createTransaction`
     */
  isOutgoing: boolean
  /**
     * The human-readable tag for the transaction, provided by the person who initiated it
     */
  note: string
  /**
     * The time the transaction was registered with the Dojo
     */
  created_at: string
  /**
     * The Dojo reference number for the transaction
     */
  referenceNumber: string
  /**
     * A set of all the labels affixed to the transaction
     */
  labels: string[],
  inputs?: ListActionsTransactionInput[],
  outputs?: ListActionsTransactionOutput[],
}
export interface ListActionsTransactionInput {
   /**
    * Transaction ID of transaction that created the output
    */
   txid: string
   /**
    * Index in the transaction of the output
    */
   vout: number
   /**
    * Number of satoshis in the output
    */
   amount: number
   /**
    * Hex representation of output locking script
    */
   outputScript: string
   /**
    * The type of output, for example "P2PKH" or "P2RPH"
    */
   type: string
   /**
    * Whether this output is free to be spent
    */
   spendable: boolean,
   /**
    * Spending description for this transaction input
    */
   spendingDescription?: string
   /**
    * Optionally included basket assignment.
    */
   basket?: string
   /**
    * Optionally included tag assignments.
    */
   tags?: string[]
}

/**
 *
 */
export interface ListActionsTransactionOutput {
   /**
    * Transaction ID of transaction that created the output
    */
   txid: string
   /**
    * Index in the transaction of the output
    */
   vout: number
   /**
    * Number of satoshis in the output
    */
   amount: number
   /**
    * Hex representation of output locking script
    */
   outputScript: string
   /**
    * The type of output, for example "P2PKH" or "P2RPH"
    */
   type: string
   /**
    * Whether this output is free to be spent
    */
   spendable: boolean,
   /**
    * Output description
    */
   description?: string
   /**
    * Optionally included basket assignment.
    */
   basket?: string
   /**
    * Optionally included tag assignments.
    */
   tags?: string[]
}


/**
 *
 */
export interface ListActionsResult {
  /**
     * The number of transactions in the complete set
     */
  totalTransactions: number
  /**
     * The specific transactions from the set that were requested, based on `limit` and `offset`
     */
  transactions: ListActionsTransaction[]
}

export interface CounterpartyKeyLinkageResult {
  type: 'counterparty-revelation'
  prover: string
  verifier: string
  counterparty: string
  /**
   * ISO date string
   */
  revelationTime: string
  encryptedLinkage: string
}

export interface SpecificKeyLinkageResult {
  type: 'specific-revelation'
  prover: string
  verifier: string
  counterparty: string
  protocolID: ProtocolID
  encryptedLinkage: string
}

export interface CreateActionOutputToRedeem {
  /**
     * Zero based output index within its transaction to spend, vout.
     */
  index: number
  /**
     * Hex scriptcode that unlocks the satoshis or the maximum script length (in bytes) if using `signAction`.
     *
     * Note that you should create any signatures with `SIGHASH_NONE | ANYONECANPAY` or similar
     * so that the additional Dojo outputs can be added afterward without invalidating your signature.
     */
  unlockingScript: string | number
  spendingDescription?: string
   /**
     * Sequence number to use when spending
     */
  sequenceNumber?: number
}

export interface CreateActionInput extends EnvelopeEvidenceApi {
  outputsToRedeem: CreateActionOutputToRedeem[]
}

/**
 * A specific output to be created as part of a new transactions.
 * These outputs can contain custom scripts as specified by recipients.
 */
export interface CreateActionOutput {
   /**
      * The output script that will be included, hex encoded
      */
   script: string
   /**
      * The amount of the output in satoshis
      */
   satoshis: number
   /**
      * Human-readable output line-item description
      */
   description?: string
   /**
      * Destination output basket name for the new UTXO
      */
   basket?: string
   /**
      * Custom spending instructions (metadata, string, optional)
      */
   customInstructions?: string
   
   /**
    * Optional array of output tags to assign to this output.
    */
   tags?: string[]

   /**
    * If true, envelope evidence is not desired for this new output.
    * If all new outputs are flagged `forSelf` then the results
    * `inputs` object will be empty.
    */
   forSelf?: boolean
}

export interface SignActionResult {
  rawTx: string,
  inputs: Record<string, EnvelopeEvidenceApi>
  mapiResponses: MapiResponseApi[],
  txid: string,
  log?: string
}

export interface AbortActionResult {
  referenceNumber: string,
  log?: string
}

export type DojoProvidedByApi = 'you' | 'dojo' | 'you-and-dojo'

export interface DojoOutputToRedeemApi {
   /**
      * Zero based output index within its transaction to spend.
      */
   index: number
   /**
      * byte length of unlocking script
      *
      * Note: To protect client keys and utxo control, unlocking scripts are never shared with Dojo.
      */
   unlockingScriptLength: number
   spendingDescription?: string
}

export interface DojoCreatingTxInstructionsApi {
   type: string
   derivationPrefix?: string
   derivationSuffix?: string
   senderIdentityKey?: string
   paymailHandle?: string
}

export interface DojoCreatingTxInputsApi extends EnvelopeEvidenceApi {
   outputsToRedeem: DojoOutputToRedeemApi[]
   providedBy: DojoProvidedByApi
   instructions: Record<number, DojoCreatingTxInstructionsApi>
}

/**
 * A specific output to be created as part of a new transactions.
 * These outputs can contain custom scripts as specified by recipients.
 */
export interface DojoCreateTxOutputApi {
   /**
      * The output script that will be included, hex encoded
      */
   script: string
   /**
      * The amount of the output in satoshis
      */
   satoshis: number
   /**
      * Human-readable output line-item description
      */
   description?: string
   /**
      * Destination output basket name for the new UTXO
      */
   basket?: string
   /**
      * Custom spending instructions (metadata, string, optional)
      */
   customInstructions?: string
   
   /**
    * Optional array of output tags to assign to this output.
    */
   tags?: string[]
}

export interface DojoCreatingTxOutputApi extends DojoCreateTxOutputApi {
   providedBy: DojoProvidedByApi
   purpose?: string
   destinationBasket?: string
   derivationSuffix?: string
   keyOffset?: string
}

export interface DojoCreateTransactionResultApi {
   inputs: Record<string, DojoCreatingTxInputsApi>
   outputs: DojoCreatingTxOutputApi[]
   derivationPrefix: string
   version: number
   lockTime: number
   referenceNumber: string
   paymailHandle: string
   note?: string
   log?: string
}

export interface CreateActionParams {
  /**
   * If an input is self-provided (known to user's Dojo),
   * `TrustSelfInput` can ommit envelope evidence supporting
   * the input.
   */
  inputs?: Record<string, CreateActionInput | TrustSelfInput>,
  outputs?: CreateActionOutput[],
  lockTime?: number,
  version?: number,
  description: string,
  labels?: string[],
  acceptDelayedBroadcast?: boolean, // = true
  /**
   * If true, the new transaction is not going to an external party.
   * Result properties normally used only to prove the validity
   * of new outputs are ommitted.
   * The result will not include the new `rawTx`, as it can be
   * obtained using the result txid from the user's Dojo at any time.
   */
  forSelf?: boolean
  log?: string
}

export interface CreateActionResult {
  signActionRequired?: boolean
  createResult?: DojoCreateTransactionResultApi
  rawTx?: string
  /**
   * Envelope evidence for the new transaction.
   * If all of the new transaction's outputs are flagged `forSelf`,
   * or if params `forSelf` is true, 
   * then this object is empty.
   */
  inputs: Record<string, EnvelopeEvidenceApi>
  mapiResponses?: MapiResponseApi[]
  txid?: string,
  log?: string
}

/**
 * Alternative to CreateActionInput which is suitable
 * if the input transaction is already known to the user's Dojo,
 * and the user is opting to trust themselves and their Dojo.
 * Performance is improved by ommitting envelope information,
 * which may not be needed if all outputs are returning to the user.
 */
export interface TrustSelfInput {
  outputsToRedeem: CreateActionOutputToRedeem[]
}

export interface GetTransactionOutputResult {
   /**
    * Transaction ID of transaction that created the output
    */
   txid: string
   /**
    * Index in the transaction of the output
    */
   vout: number
   /**
    * Number of satoshis in the output
    */
   amount: number
   /**
    * Hex representation of output locking script
    */
   outputScript: string
   /**
    * The type of output, for example "P2PKH" or "P2RPH"
    */
   type: string
   /**
    * Whether this output is free to be spent
    */
   spendable: boolean,
   /**
    * When requested and available, output validity support envelope.
    */
   envelope?: EnvelopeApi,
   /**
    * When envelope requested, any custom instructions associated with this output.
    */
   customInstructions?: string
   /**
    * If `includeBasket` option is true, name of basket to which this output belongs.
    */
   basket?: string
   /**
    * If `includeTags` option is true, tags assigned to this output.
    */
   tags?: string[]
}

export interface SubmitDirectTransactionOutput {
  vout: number
  satoshis: number
  basket?: string
  derivationPrefix?: string
  derivationSuffix?: string
  customInstructions?: string
  senderIdentityKey?: string
  tags?: string[]
}

export interface SubmitDirectTransaction {
  rawTx: string
  txid?: string
  inputs?: Record<string, EnvelopeEvidenceApi>
  mapiResponses?: MapiResponseApi[]
  proof?: TscMerkleProofApi
  outputs: SubmitDirectTransactionOutput[]
  referenceNumber?: string
}

export interface SubmitDirectTransactionResult {
  transactionId: number
  referenceNumber: string
}
