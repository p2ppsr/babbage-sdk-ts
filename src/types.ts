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
  status: string
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
     * Zero based output index within its transaction to spend.
     */
  index: number
  /**
     * Hex scriptcode that unlocks the satoshis.
     *
     * Note that you should create any signatures with `SIGHASH_NONE | ANYONECANPAY` or similar
     * so that the additional Dojo outputs can be added afterward without invalidating your signature.
     */
  unlockingScript: string
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
}

export interface CreateActionResult {
  rawTx: string,
  inputs: Record<string, EnvelopeEvidenceApi>
  mapiResponses: MapiResponseApi[],
  txid: string
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
