# @babbage/sdk

Build Babbage apps in JavaScript

**[NPM Package](https://www.npmjs.com/package/@babbage/sdk)**

**[GitHub Repository](https://github.com/p2ppsr/babbage-sdk)**

## Installation

    npm i @babbage/sdk

## By Example

There are a few example projects you can check out which implement the Babbage SDK:

*   **[🎵Tempo](https://github.com/p2ppsr/tempo)**: A platform for creating and sharing music, and empowering artists with micropayments
*   **[✅Simple ToDo List](https://github.com/p2ppsr/todo-react)**: An app that demonstrates the basics of Bitcoin tokenization and identity

## Documentation

> 📒 The JavaScript API is documented below the examples, in the **API** section

The **[📚Babbage Learn website](https://projectbabbage.com/docs/babbage-sdk)** hosts the concepts, guides and reference materials that show you how the SDK works.

## Example Usage

### Encryption

```js
const { encrypt, decrypt } = require('@babbage/sdk')

// Encrypt and decrypt data using the Babbage SDK
const encryptedData = await encrypt({
  plaintext: Buffer.from('some data'),
  protocolID: [0, 'Hello World'],
  keyID: '1'
})

// The same protocol and key ID is needed for decryption
const decryptedData = await decrypt({
  ciphertext: encryptedData,
  protocolID: [0, 'Hello World'],
  keyID: '1',
  returnType: 'string'
})
```

### Creating and Redeeming Bitcoin tokens

> This example also uses [PushDrop](https://github.com/p2ppsr/pushdrop)

```js
const { createAction } = require('@babbage/sdk')
const { create, redeem } = require('pushdrop')

const bitcoinOutputScript = await create({
  fields: [ // The "fields" are the data payload to attach to the token.
    Buffer.from('My First Token'),
    Buffer.from('My name is Ty') // Tokens can represent anything!
  ],
  // The "first token" protocol and key ID can be used to sign and 
  // lock this new Bitcoin PushDrop token.
  protocolID: 'first token',
  keyID: '1'
})

const newToken = await createAction({
  // The Bitcoin transaction ("Action" with a capital A) has an output, 
  // because it has led to the creation of a new Bitcoin token.
  outputs: [{
    // The output amount is how much Bitcoin (measured in "satoshis") 
    // this token is worth. Let's use 1000 satoshis.
    satoshis: 1000,
    // The output script for this token was created by the PushDrop library, 
    // which you can see above.
    script: bitcoinOutputScript
  }],
  // Finally, we'll describe the Action for the user
  description: 'Create my first token'
})

// Here, we're using the PushDrop library to unlcok / redeem the PushDrop 
// token that was previously created. By providing this information, 
// PushDrop can "unlock" and spend the token. When the token gets spent, 
// the user gets their 1000 satoshis back.
const unlockingScript = await pushdrop.redeem({
  // To unlock the token, we need to use the same "first token" protocol 
  // and key ID as when we created the token before. Otherwise, the 
  // key won't fit the lock and the Bitcoins won't come out.
  protocolID: 'first token',
  keyID: '1',
  // We're telling PushDrop which previous transaction and output we want to
  // unlock, so that the correct unlocking puzzle can be prepared.
  prevTxId: newToken.txid,
  outputIndex: 0, // The first output from the transaction
  // We also give PushDrop a copy of the locking puzzle ("script") that 
  // we want to open, which is helpful in preparing to unlock it.
  lockingScript: bitcoinOutputScript,
  // Finally, the number of satoshis we are expecting to unlock when the 
  // puzzle gets solved.
  outputAmount: 1000
})

// Now, we're going to use the unlocking puzle that PushDrop has prepared for us,
// so that the user can get their Bitcoins back. This is another "Action", which
// is just a Bitcoin transaction.
// The amount the user gets back will be slightly less, because of transaction fees.
await createAction({
  inputs: { // These are inputs, which unlock Bitcoin tokens.
    // The input comes from the token which we're completing
    [newToken.txid]: {
      ...newToken,
      // The output we want to redeem is specified here, and we also give 
      // the unlocking puzzle ("script") from PushDrop.
      outputsToRedeem: [{
        index: 0, // The first output of the transaction
        unlockingScript
      }]
    }
  },
  // Let the user know why they're getting some Bitcoins back
  description: 'Redeem my first token'
})
```

> 🏆 After reading the above two examples, could you implement a token with encrypted data? 🏆

## API

<!--#region ts2md-api-merged-here-->

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

### Interfaces

| | |
| --- | --- |
| [CertificateApi](#interface-certificateapi) | [ListActionsResult](#interface-listactionsresult) |
| [CounterpartyKeyLinkageResult](#interface-counterpartykeylinkageresult) | [ListActionsTransaction](#interface-listactionstransaction) |
| [CreateActionInput](#interface-createactioninput) | [MapiResponseApi](#interface-mapiresponseapi) |
| [CreateActionOutput](#interface-createactionoutput) | [ProveCertificateResult](#interface-provecertificateresult) |
| [CreateActionOutputToRedeem](#interface-createactionoutputtoredeem) | [SpecificKeyLinkageResult](#interface-specifickeylinkageresult) |
| [CreateActionResult](#interface-createactionresult) | [SubmitDirectTransaction](#interface-submitdirecttransaction) |
| [CreateCertificateResult](#interface-createcertificateresult) | [SubmitDirectTransactionOutput](#interface-submitdirecttransactionoutput) |
| [EnvelopeApi](#interface-envelopeapi) | [SubmitDirectTransactionResult](#interface-submitdirecttransactionresult) |
| [EnvelopeEvidenceApi](#interface-envelopeevidenceapi) | [TscMerkleProofApi](#interface-tscmerkleproofapi) |
| [GetTransactionOutputResult](#interface-gettransactionoutputresult) |  |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

#### Interface: TscMerkleProofApi

As defined in https://github.com/bitcoin-sv-specs/brfc-merchantapi/blob/master/README.md

```ts
export interface TscMerkleProofApi {
    height?: number;
    index: number;
    txOrId: string | Buffer;
    target: string | Buffer;
    nodes: string[] | Buffer;
    targetType?: "hash" | "header" | "merkleRoot" | "height";
    proofType?: "branch" | "tree";
    composite?: boolean;
}
```

<details>

<summary>Interface TscMerkleProofApi Details</summary>

##### Property height

The most efficient way of confirming a proof should also be the most common,
when the containing block's height is known.

```ts
height?: number
```

##### Property index

Index of transaction in its block. First transaction is index zero.

```ts
index: number
```

##### Property nodes

Merkle tree sibling hash values required to compute root from txid.
Duplicates (sibling hash === computed hash) are indicated by "*" or type byte === 1.
type byte === 2...
Strings are encoded as hex.

```ts
nodes: string[] | Buffer
```

##### Property target

Merkle root (length === 32) or serialized block header containing it (length === 80).
If string, encoding is hex.

```ts
target: string | Buffer
```

##### Property txOrId

Full transaction (length > 32 bytes) or just its double SHA256 hash (length === 32 bytes).
If string, encoding is hex.

```ts
txOrId: string | Buffer
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: MapiResponseApi

```ts
export interface MapiResponseApi {
    payload: string;
    signature: string;
    publicKey: string;
    encoding?: string;
    mimetype?: string;
}
```

<details>

<summary>Interface MapiResponseApi Details</summary>

##### Property encoding

encoding of the payload data

```ts
encoding?: string
```

##### Property mimetype

mime type of the payload data

```ts
mimetype?: string
```

##### Property payload

Contents of the envelope.
Validate using signature and publicKey.
encoding and mimetype may assist with decoding validated payload.

```ts
payload: string
```

##### Property publicKey

public key to use to verify signature of payload data

```ts
publicKey: string
```

##### Property signature

signature producted by correpsonding private key on payload data

```ts
signature: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: EnvelopeApi

```ts
export interface EnvelopeApi extends EnvelopeEvidenceApi {
    headers?: string[];
    reference?: string;
}
```

<details>

<summary>Interface EnvelopeApi Details</summary>

##### Property headers

For root nodes only.
Array of 80 byte block headers encoded as 160 character hex strings
Include headers the envelope creator is aware of but which the resipient may not have.

```ts
headers?: string[]
```

##### Property reference

Arbitrary reference string associated with the envelope, typically root node only.

```ts
reference?: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: EnvelopeEvidenceApi

Either inputs or proof are required.

```ts
export interface EnvelopeEvidenceApi {
    rawTx: string;
    proof?: TscMerkleProofApi | Buffer;
    inputs?: Record<string, EnvelopeEvidenceApi>;
    txid?: string;
    mapiResponses?: MapiResponseApi[];
    depth?: number;
}
```

<details>

<summary>Interface EnvelopeEvidenceApi Details</summary>

##### Property depth

count of maximum number of chained unproven transactions before a proven leaf node
proof nodes have depth zero.

```ts
depth?: number
```

##### Property inputs

Only one of proof or inputs must be valid.
Branching nodes have inputs with a sub envelope (values) for every input transaction txid (keys)

```ts
inputs?: Record<string, EnvelopeEvidenceApi>
```

##### Property mapiResponses

Array of mapi transaction status update responses
Only the payload, signature, and publicKey properties are relevant.

Branching inputs nodes only.
Array of mapi transaction status update responses confirming
unproven transctions have at least been submitted for processing.

```ts
mapiResponses?: MapiResponseApi[]
```

##### Property proof

Either proof, or inputs, must have a value.
Leaf nodes have proofs.

If value is a Buffer, content is binary encoded serialized proof
see: chaintracks-spv.utils.serializeTscMerkleProof

```ts
proof?: TscMerkleProofApi | Buffer
```

##### Property rawTx

A valid bitcoin transaction encoded as a hex string.

```ts
rawTx: string
```

##### Property txid

double SHA256 hash of serialized rawTx. Optional.

```ts
txid?: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CertificateApi

```ts
export interface CertificateApi {
    type: string;
    subject: string;
    validationKey: string;
    serialNumber: string;
    certifier: string;
    revocationOutpoint: string;
    signature: string;
    fields?: Record<string, string>;
}
```

<details>

<summary>Interface CertificateApi Details</summary>

##### Property certifier

max length of 255

```ts
certifier: string
```

##### Property fields

Certificate fields object where keys are field names and values are field value.

```ts
fields?: Record<string, string>
```

##### Property revocationOutpoint

max length of 255

```ts
revocationOutpoint: string
```

##### Property serialNumber

max length of 255

```ts
serialNumber: string
```

##### Property signature

max length of 255

```ts
signature: string
```

##### Property subject

max length of 255

```ts
subject: string
```

##### Property type

max length of 255

```ts
type: string
```

##### Property validationKey

max length of 255

```ts
validationKey: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateCertificateResult

```ts
export interface CreateCertificateResult extends CertificateApi {
    type: string;
    subject: string;
    validationKey: string;
    serialNumber: string;
    certifier: string;
    revocationOutpoint: string;
    signature: string;
    fields?: Record<string, string>;
    masterKeyring?: Record<string, string>;
}
```

<details>

<summary>Interface CreateCertificateResult Details</summary>

##### Property certifier

max length of 255

```ts
certifier: string
```

##### Property fields

Certificate fields object where keys are field names and values are field value.

```ts
fields?: Record<string, string>
```

##### Property masterKeyring

Certificate masterKeyring object where keys are field names and values are field masterKey value.

```ts
masterKeyring?: Record<string, string>
```

##### Property revocationOutpoint

max length of 255

```ts
revocationOutpoint: string
```

##### Property serialNumber

max length of 255

```ts
serialNumber: string
```

##### Property signature

max length of 255

```ts
signature: string
```

##### Property subject

max length of 255

```ts
subject: string
```

##### Property type

max length of 255

```ts
type: string
```

##### Property validationKey

max length of 255

```ts
validationKey: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ProveCertificateResult

```ts
export interface ProveCertificateResult extends CertificateApi {
    type: string;
    subject: string;
    validationKey: string;
    serialNumber: string;
    certifier: string;
    revocationOutpoint: string;
    signature: string;
    fields?: Record<string, string>;
    keyring: Record<string, string>;
}
```

<details>

<summary>Interface ProveCertificateResult Details</summary>

##### Property certifier

max length of 255

```ts
certifier: string
```

##### Property fields

Plaintext field names and values of only those fields requested in `fieldsToReveal`

```ts
fields?: Record<string, string>
```

##### Property keyring

field revelation keyring for the given verifier

```ts
keyring: Record<string, string>
```

##### Property revocationOutpoint

max length of 255

```ts
revocationOutpoint: string
```

##### Property serialNumber

max length of 255

```ts
serialNumber: string
```

##### Property signature

max length of 255

```ts
signature: string
```

##### Property subject

max length of 255

```ts
subject: string
```

##### Property type

max length of 255

```ts
type: string
```

##### Property validationKey

max length of 255

```ts
validationKey: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListActionsTransaction

```ts
export interface ListActionsTransaction {
    txid: string;
    amount: number;
    status: string;
    senderPaymail: string;
    recipientPaymail: string;
    isOutgoing: boolean;
    note: string;
    created_at: string;
    referenceNumber: string;
}
```

<details>

<summary>Interface ListActionsTransaction Details</summary>

##### Property amount

The number of satoshis added or removed from Dojo by this transaction

```ts
amount: number
```

##### Property created_at

The time the transaction was registered with the Dojo

```ts
created_at: string
```

##### Property isOutgoing

Whether or not the transaction was created with `createTransaction`

```ts
isOutgoing: boolean
```

##### Property note

The human-readable tag for the transaction, provided by the person who initiated it

```ts
note: string
```

##### Property recipientPaymail

The Paymail handle of the person who received the transaction

```ts
recipientPaymail: string
```

##### Property referenceNumber

The Dojo reference number for the transaction

```ts
referenceNumber: string
```

##### Property senderPaymail

The Paymail handle of the person who sent the transaction

```ts
senderPaymail: string
```

##### Property status

The current state of the transaction. Common statuses are `completed` and `unproven`.

```ts
status: string
```

##### Property txid

The transaction ID

```ts
txid: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListActionsResult

```ts
export interface ListActionsResult {
    totalTransactions: number;
    transactions: ListActionsTransaction[];
}
```

<details>

<summary>Interface ListActionsResult Details</summary>

##### Property totalTransactions

The number of transactions in the complete set

```ts
totalTransactions: number
```

##### Property transactions

The specific transactions from the set that were requested, based on `limit` and `offset`

```ts
transactions: ListActionsTransaction[]
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CounterpartyKeyLinkageResult

```ts
export interface CounterpartyKeyLinkageResult {
    type: "counterparty-revelation";
    prover: string;
    verifier: string;
    counterparty: string;
    revelationTime: string;
    encryptedLinkage: string;
}
```

<details>

<summary>Interface CounterpartyKeyLinkageResult Details</summary>

##### Property revelationTime

ISO date string

```ts
revelationTime: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SpecificKeyLinkageResult

```ts
export interface SpecificKeyLinkageResult {
    type: "specific-revelation";
    prover: string;
    verifier: string;
    counterparty: string;
    protocolID: ProtocolID;
    encryptedLinkage: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionOutputToRedeem

```ts
export interface CreateActionOutputToRedeem {
    index: number;
    unlockingScript: string;
    spendingDescription?: string;
    sequenceNumber?: number;
}
```

<details>

<summary>Interface CreateActionOutputToRedeem Details</summary>

##### Property index

Zero based output index within its transaction to spend.

```ts
index: number
```

##### Property sequenceNumber

Sequence number to use when spending

```ts
sequenceNumber?: number
```

##### Property unlockingScript

Hex scriptcode that unlocks the satoshis.

Note that you should create any signatures with `SIGHASH_NONE | ANYONECANPAY` or similar
so that the additional Dojo outputs can be added afterward without invalidating your signature.

```ts
unlockingScript: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionInput

```ts
export interface CreateActionInput extends EnvelopeEvidenceApi {
    outputsToRedeem: CreateActionOutputToRedeem[];
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionOutput

A specific output to be created as part of a new transactions.
These outputs can contain custom scripts as specified by recipients.

```ts
export interface CreateActionOutput {
    script: string;
    satoshis: number;
    description?: string;
    basket?: string;
    customInstructions?: string;
    tags?: string[];
}
```

<details>

<summary>Interface CreateActionOutput Details</summary>

##### Property basket

Destination output basket name for the new UTXO

```ts
basket?: string
```

##### Property customInstructions

Custom spending instructions (metadata, string, optional)

```ts
customInstructions?: string
```

##### Property description

Human-readable output line-item description

```ts
description?: string
```

##### Property satoshis

The amount of the output in satoshis

```ts
satoshis: number
```

##### Property script

The output script that will be included, hex encoded

```ts
script: string
```

##### Property tags

Optional array of output tags to assign to this output.

```ts
tags?: string[]
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionResult

```ts
export interface CreateActionResult {
    rawTx: string;
    inputs: Record<string, EnvelopeEvidenceApi>;
    mapiResponses: MapiResponseApi[];
    txid: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: GetTransactionOutputResult

```ts
export interface GetTransactionOutputResult {
    txid: string;
    vout: number;
    amount: number;
    outputScript: string;
    type: string;
    spendable: boolean;
    envelope?: EnvelopeApi;
    customInstructions?: string;
    basket?: string;
    tags?: string[];
}
```

<details>

<summary>Interface GetTransactionOutputResult Details</summary>

##### Property amount

Number of satoshis in the output

```ts
amount: number
```

##### Property basket

If `includeBasket` option is true, name of basket to which this output belongs.

```ts
basket?: string
```

##### Property customInstructions

When envelope requested, any custom instructions associated with this output.

```ts
customInstructions?: string
```

##### Property envelope

When requested and available, output validity support envelope.

```ts
envelope?: EnvelopeApi
```

##### Property outputScript

Hex representation of output locking script

```ts
outputScript: string
```

##### Property spendable

Whether this output is free to be spent

```ts
spendable: boolean
```

##### Property tags

If `includeTags` option is true, tags assigned to this output.

```ts
tags?: string[]
```

##### Property txid

Transaction ID of transaction that created the output

```ts
txid: string
```

##### Property type

The type of output, for example "P2PKH" or "P2RPH"

```ts
type: string
```

##### Property vout

Index in the transaction of the output

```ts
vout: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SubmitDirectTransactionOutput

```ts
export interface SubmitDirectTransactionOutput {
    vout: number;
    satoshis: number;
    basket?: string;
    derivationPrefix?: string;
    derivationSuffix?: string;
    customInstructions?: string;
    senderIdentityKey?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SubmitDirectTransaction

```ts
export interface SubmitDirectTransaction {
    rawTx: string;
    txid?: string;
    inputs?: Record<string, EnvelopeEvidenceApi>;
    mapiResponses?: MapiResponseApi[];
    proof?: TscMerkleProofApi;
    outputs: SubmitDirectTransactionOutput[];
    referenceNumber?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SubmitDirectTransactionResult

```ts
export interface SubmitDirectTransactionResult {
    transactionId: number;
    referenceNumber: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Classes

#### Class: Communicator

```ts
export class Communicator {
    static setCached(substrate: string, version: string): Communicator 
    static getCached(): Communicator | undefined 
    async dispatch<P extends object>(args: {
        name: string;
        params: P;
        isGet?: boolean;
        bodyParamKey?: string;
        bodyJsonParams?: boolean;
        contentType?: string;
        nameHttp?: string;
        isNinja?: boolean;
    }): Promise<unknown> 
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Functions

| |
| --- |
| [connectToSubstrate](#function-connecttosubstrate) |
| [getRandomID](#function-getrandomid) |
| [makeHttpRequest](#function-makehttprequest) |
| [promiseWithTimeout](#function-promisewithtimeout) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

#### Function: makeHttpRequest

```ts
export default async function makeHttpRequest<R>(routeURL: string, requestInput: RequestInit = {}): Promise<R> 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: promiseWithTimeout

Provides a timedout promise.

```ts
export default async function promiseWithTimeout<T>(obj: {
    timeout: number;
    promise: Promise<T>;
    error?: Error;
}): Promise<T> 
```

<details>

<summary>Function promiseWithTimeout Details</summary>

Argument Details

+ **obj**
  + All parameters for this function are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getRandomID

```ts
export default function getRandomID(): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: connectToSubstrate

```ts
export default async function connectToSubstrate(): Promise<Communicator> 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Types

#### Type: ProtocolID

```ts
export type ProtocolID = string | [
    0 | 1 | 2,
    string
]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Variables

#### Variable: BabbageSDK

```ts
BabbageSDK = {
    createAction,
    createHmac,
    createCertificate,
    createSignature,
    decrypt,
    decryptAsArray,
    decryptAsString,
    encrypt,
    encryptAsArray,
    encryptAsString,
    getCertificates,
    getNetwork,
    getPublicKey,
    getTransactionOutputs,
    getVersion,
    isAuthenticated,
    listActions,
    proveCertificate,
    requestGroupPermission,
    revealKeyLinkage,
    revealKeyLinkageCounterparty,
    revealKeyLinkageSpecific,
    submitDirectTransaction,
    unbasketOutput,
    verifyHmac,
    verifySignature,
    waitForAuthentication,
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

<!--#endregion ts2md-api-merged-here-->

## SDK Connection Substrates

The Babbage SDK connects to a running *Computing with Integrity* (CWI) kernel instance, allowing applications to plug into user-owned identities. There are currently three *substrates* (connection modes) that the SDK can use to link an application to a MetaNet identity provider:

1.  **Window API**: In a web browser, the SDK will first try to use a `window.CWI` interface for communicating with the kernel.
2.  **Babbage XDM**: In a browser or iframe window, the SDK will next try to use XDM (cross-document messaging) to communicate with a running kernel instance.
3.  **Cicada API**: Lastly, the SDK will attempt to communicate over `localhost:3301` to a running HTTP MetaNet service. This *Port 3301 Substrate* is named Cicada, in honor of [Cicada 3301](https://en.wikipedia.org/wiki/Cicada_3301).

## License

The license for this library, which is a wrapper for the proprietary Babbage API, is the Open BSV License. It can only be used on the BSV blockchain. The Babbage API itself, including the rights to create and host Babbage software or any other related infrastructure, is not covered by the Open BSV License and remains proprietary and restricted. The Open BSV License only extends to the code in this repository, and you are not permitted to host Babbage software, servers or create copies or alternative implementations of the proprietary Babbage API without other permission.
