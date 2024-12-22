# @babbage/sdk-ts

Build Babbage apps in TypeScript

**[NPM Package](https://www.npmjs.com/package/@babbage/sdk-ts)**

**[GitHub Repository](https://github.com/p2ppsr/babbage-sdk-ts)**

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
import { encrypt, decrypt } from '@babbage/sdk-ts'

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
import { createAction } from '@babbage/sdk-ts'
import { create, redeem } from 'pushdrop'

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

| | | |
| --- | --- | --- |
| [AbortActionArgs](#interface-abortactionargs) | [GetNetworkResult](#interface-getnetworkresult) | [SignableTransaction](#interface-signabletransaction) |
| [AbortActionResult](#interface-abortactionresult) | [GetPublicKeyArgs](#interface-getpublickeyargs) | [SpecificKeyLinkageResult](#interface-specifickeylinkageresult) |
| [AbortActionResult](#interface-abortactionresult) | [GetPublicKeyResult](#interface-getpublickeyresult) | [SubmitDirectTransaction](#interface-submitdirecttransaction) |
| [AcquireCertificateArgs](#interface-acquirecertificateargs) | [GetTransactionOutputResult](#interface-gettransactionoutputresult) | [SubmitDirectTransactionOutput](#interface-submitdirecttransactionoutput) |
| [AcquireCertificateResult](#interface-acquirecertificateresult) | [GetVersionResult](#interface-getversionresult) | [SubmitDirectTransactionResult](#interface-submitdirecttransactionresult) |
| [AuthenticatedResult](#interface-authenticatedresult) | [IdentityCertificate](#interface-identitycertificate) | [TscMerkleProofApi](#interface-tscmerkleproofapi) |
| [BasketInsertion](#interface-basketinsertion) | [IdentityCertifier](#interface-identitycertifier) | [ValidAbortActionArgs](#interface-validabortactionargs) |
| [CertificateApi](#interface-certificateapi) | [InternalizeActionArgs](#interface-internalizeactionargs) | [ValidAcquireCertificateArgs](#interface-validacquirecertificateargs) |
| [CounterpartyKeyLinkageResult](#interface-counterpartykeylinkageresult) | [InternalizeActionResult](#interface-internalizeactionresult) | [ValidBasketInsertion](#interface-validbasketinsertion) |
| [CreateActionArgs](#interface-createactionargs) | [InternalizeOutput](#interface-internalizeoutput) | [ValidCreateActionArgs](#interface-validcreateactionargs) |
| [CreateActionInput](#interface-createactioninput) | [KeyDeriverApi](#interface-keyderiverapi) | [ValidCreateActionInput](#interface-validcreateactioninput) |
| [CreateActionInput](#interface-createactioninput) | [KeyLinkageResult](#interface-keylinkageresult) | [ValidCreateActionOptions](#interface-validcreateactionoptions) |
| [CreateActionOptions](#interface-createactionoptions) | [ListActionsArgs](#interface-listactionsargs) | [ValidCreateActionOutput](#interface-validcreateactionoutput) |
| [CreateActionOptions](#interface-createactionoptions) | [ListActionsResult](#interface-listactionsresult) | [ValidInternalizeActionArgs](#interface-validinternalizeactionargs) |
| [CreateActionOutput](#interface-createactionoutput) | [ListActionsResult](#interface-listactionsresult) | [ValidInternalizeOutput](#interface-validinternalizeoutput) |
| [CreateActionOutput](#interface-createactionoutput) | [ListActionsTransaction](#interface-listactionstransaction) | [ValidListActionsArgs](#interface-validlistactionsargs) |
| [CreateActionOutputToRedeem](#interface-createactionoutputtoredeem) | [ListActionsTransactionInput](#interface-listactionstransactioninput) | [ValidListCertificatesArgs](#interface-validlistcertificatesargs) |
| [CreateActionParams](#interface-createactionparams) | [ListActionsTransactionOutput](#interface-listactionstransactionoutput) | [ValidListOutputsArgs](#interface-validlistoutputsargs) |
| [CreateActionResult](#interface-createactionresult) | [ListCertificatesArgs](#interface-listcertificatesargs) | [ValidProcessActionArgs](#interface-validprocessactionargs) |
| [CreateActionResult](#interface-createactionresult) | [ListCertificatesResult](#interface-listcertificatesresult) | [ValidProcessActionOptions](#interface-validprocessactionoptions) |
| [CreateCertificateResult](#interface-createcertificateresult) | [ListOutputsArgs](#interface-listoutputsargs) | [ValidRelinquishOutputArgs](#interface-validrelinquishoutputargs) |
| [CreateHmacArgs](#interface-createhmacargs) | [ListOutputsResult](#interface-listoutputsresult) | [ValidSignActionArgs](#interface-validsignactionargs) |
| [CreateHmacResult](#interface-createhmacresult) | [MapiResponseApi](#interface-mapiresponseapi) | [ValidSignActionOptions](#interface-validsignactionoptions) |
| [CreateSignatureArgs](#interface-createsignatureargs) | [OptionalEnvelopeEvidenceApi](#interface-optionalenvelopeevidenceapi) | [ValidWalletPayment](#interface-validwalletpayment) |
| [CreateSignatureResult](#interface-createsignatureresult) | [OutPoint](#interface-outpoint) | [VerifyHmacArgs](#interface-verifyhmacargs) |
| [DiscoverByAttributesArgs](#interface-discoverbyattributesargs) | [ProveCertificateArgs](#interface-provecertificateargs) | [VerifyHmacResult](#interface-verifyhmacresult) |
| [DiscoverByIdentityKeyArgs](#interface-discoverbyidentitykeyargs) | [ProveCertificateResult](#interface-provecertificateresult) | [VerifySignatureArgs](#interface-verifysignatureargs) |
| [DiscoverCertificatesResult](#interface-discovercertificatesresult) | [ProveCertificateResult](#interface-provecertificateresult) | [VerifySignatureResult](#interface-verifysignatureresult) |
| [DojoCreateTransactionResultApi](#interface-dojocreatetransactionresultapi) | [RelinquishCertificateArgs](#interface-relinquishcertificateargs) | [Wallet](#interface-wallet) |
| [DojoCreateTxOutputApi](#interface-dojocreatetxoutputapi) | [RelinquishCertificateResult](#interface-relinquishcertificateresult) | [WalletAction](#interface-walletaction) |
| [DojoCreateTxResultInstructionsApi](#interface-dojocreatetxresultinstructionsapi) | [RelinquishOutputArgs](#interface-relinquishoutputargs) | [WalletActionInput](#interface-walletactioninput) |
| [DojoCreateTxResultOutputApi](#interface-dojocreatetxresultoutputapi) | [RelinquishOutputResult](#interface-relinquishoutputresult) | [WalletActionOutput](#interface-walletactionoutput) |
| [DojoCreatingTxInputsApi](#interface-dojocreatingtxinputsapi) | [RevealCounterpartyKeyLinkageArgs](#interface-revealcounterpartykeylinkageargs) | [WalletCertificate](#interface-walletcertificate) |
| [DojoOutputToRedeemApi](#interface-dojooutputtoredeemapi) | [RevealCounterpartyKeyLinkageResult](#interface-revealcounterpartykeylinkageresult) | [WalletCryptoObject](#interface-walletcryptoobject) |
| [DojoSendWithResultsApi](#interface-dojosendwithresultsapi) | [RevealSpecificKeyLinkageArgs](#interface-revealspecifickeylinkageargs) | [WalletDecryptArgs](#interface-walletdecryptargs) |
| [EnvelopeApi](#interface-envelopeapi) | [RevealSpecificKeyLinkageResult](#interface-revealspecifickeylinkageresult) | [WalletDecryptResult](#interface-walletdecryptresult) |
| [EnvelopeEvidenceApi](#interface-envelopeevidenceapi) | [SendWithResult](#interface-sendwithresult) | [WalletEncryptArgs](#interface-walletencryptargs) |
| [GetHeaderArgs](#interface-getheaderargs) | [SignActionArgs](#interface-signactionargs) | [WalletEncryptResult](#interface-walletencryptresult) |
| [GetHeaderResult](#interface-getheaderresult) | [SignActionOptions](#interface-signactionoptions) | [WalletEncryptionArgs](#interface-walletencryptionargs) |
| [GetHeightResult](#interface-getheightresult) | [SignActionResult](#interface-signactionresult) | [WalletErrorObject](#interface-walleterrorobject) |
| [GetInfoParams](#interface-getinfoparams) | [SignActionResult](#interface-signactionresult) | [WalletOutput](#interface-walletoutput) |
| [GetInfoResult](#interface-getinforesult) | [SignActionSpend](#interface-signactionspend) | [WalletPayment](#interface-walletpayment) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

#### Interface: AbortActionArgs

```ts
export interface AbortActionArgs {
    reference: Base64String;
}
```

See also: [Base64String](#type-base64string)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: AbortActionResult

```ts
export interface AbortActionResult {
    referenceNumber: string;
    log?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: AbortActionResult

```ts
export interface AbortActionResult {
    aborted: boolean;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: AcquireCertificateArgs

```ts
export interface AcquireCertificateArgs {
    type: Base64String;
    certifier: PubKeyHex;
    acquisitionProtocol: AcquisitionProtocol;
    fields: Record<CertificateFieldNameUnder50Bytes, string>;
    serialNumber?: Base64String;
    revocationOutpoint?: OutpointString;
    signature?: HexString;
    certifierUrl?: string;
    keyringRevealer?: KeyringRevealer;
    keyringForSubject?: Record<CertificateFieldNameUnder50Bytes, Base64String>;
    privileged?: BooleanDefaultFalse;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [AcquisitionProtocol](#type-acquisitionprotocol), [Base64String](#type-base64string), [BooleanDefaultFalse](#type-booleandefaultfalse), [CertificateFieldNameUnder50Bytes](#type-certificatefieldnameunder50bytes), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [HexString](#type-hexstring), [KeyringRevealer](#type-keyringrevealer), [OutpointString](#type-outpointstring), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: AcquireCertificateResult

```ts
export interface AcquireCertificateResult extends WalletCertificate {
}
```

See also: [WalletCertificate](#interface-walletcertificate)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: AuthenticatedResult

```ts
export interface AuthenticatedResult {
    authenticated: boolean;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: BasketInsertion

```ts
export interface BasketInsertion {
    basket: BasketStringUnder300Bytes;
    customInstructions?: string;
    tags?: OutputTagStringUnder300Bytes[];
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes)

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
#### Interface: CreateActionArgs

```ts
export interface CreateActionArgs {
    description: DescriptionString5to50Bytes;
    inputBEEF?: BEEF;
    inputs?: CreateActionInput[];
    outputs?: CreateActionOutput[];
    lockTime?: PositiveIntegerOrZero;
    version?: PositiveIntegerOrZero;
    labels?: LabelStringUnder300Bytes[];
    options?: CreateActionOptions;
}
```

See also: [BEEF](#type-beef), [CreateActionInput](#interface-createactioninput), [CreateActionOptions](#interface-createactionoptions), [CreateActionOutput](#interface-createactionoutput), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [LabelStringUnder300Bytes](#type-labelstringunder300bytes), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionInput

```ts
export interface CreateActionInput extends OptionalEnvelopeEvidenceApi {
    outputsToRedeem: CreateActionOutputToRedeem[];
}
```

See also: [CreateActionOutputToRedeem](#interface-createactionoutputtoredeem), [OptionalEnvelopeEvidenceApi](#interface-optionalenvelopeevidenceapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionInput

```ts
export interface CreateActionInput {
    outpoint: OutpointString;
    inputDescription: DescriptionString5to50Bytes;
    unlockingScript?: HexString;
    unlockingScriptLength?: PositiveInteger;
    sequenceNumber?: PositiveIntegerOrZero;
}
```

See also: [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [HexString](#type-hexstring), [OutpointString](#type-outpointstring), [PositiveInteger](#type-positiveinteger), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionOptions

```ts
export interface CreateActionOptions {
    acceptDelayedBroadcast?: boolean;
    trustSelf?: TrustSelf;
    knownTxids?: string[];
    resultFormat?: "beef" | "none";
    noSend?: boolean;
    noSendChange?: OutPoint[];
    sendWith?: string[];
    randomizeOutputs?: boolean;
}
```

See also: [OutPoint](#interface-outpoint), [TrustSelf](#type-trustself)

<details>

<summary>Interface CreateActionOptions Details</summary>

##### Property acceptDelayedBroadcast

true if local validation and self-signed mapi response is sufficient.
Upon return, transaction will have `sending` status. Watchman will proceed to send the transaction asynchronously.

false if a valid mapi response from the bitcoin transaction processing network is required.
Upon return, transaction will have `unproven` status. Watchman will proceed to prove transaction.

default true

```ts
acceptDelayedBroadcast?: boolean
```

##### Property knownTxids

If the caller already has envelopes or BUMPS for certain txids, pass them in this
array and they will be assumed to be valid and not returned again in the results.

```ts
knownTxids?: string[]
```

##### Property noSend

If true, successfully created transactions remain in the `nosend` state.
A proof will be sought but it will not be considered an error if the txid remains unknown.

Supports testing, user control over broadcasting of transactions, and batching.

```ts
noSend?: boolean
```

##### Property noSendChange

Available transaction fee payment output(s) belonging to the user.

Only change outputs previously created by a noSend transaction.

Supports chained noSend transactions by minimizing the consumption
and non-replenishment of change outputs.

```ts
noSendChange?: OutPoint[]
```
See also: [OutPoint](#interface-outpoint)

##### Property randomizeOutputs

optional. When set to false, the wallet will avoid randomizing the order of outputs within the transaction.

```ts
randomizeOutputs?: boolean
```

##### Property resultFormat

If 'beef', the results will format new transaction and supporting input proofs in BEEF format.
If 'none', the results will include only the txid of the new transaction.
Otherwise, the results will use `EnvelopeEvidenceApi` format.

```ts
resultFormat?: "beef" | "none"
```

##### Property sendWith

Setting `sendWith` to an array of `txid` values for previously created `noSend` transactions
causes all of them to be sent to the bitcoin network as a single batch of transactions.

When using `sendWith`, `createAction` can be called without inputs or outputs,
in which case previously created `noSend` transactions will be sent
without creating a new transaction.

```ts
sendWith?: string[]
```

##### Property trustSelf

If undefined, normal case, all inputs must be provably valid by chain of rawTx and merkle proof values,
and results will include new rawTx and proof chains for new outputs.

If 'known', any input txid corresponding to a previously processed transaction may ommit its rawTx and proofs,
and results will exclude new rawTx and proof chains for new outputs.

```ts
trustSelf?: TrustSelf
```
See also: [TrustSelf](#type-trustself)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionOptions

```ts
export interface CreateActionOptions {
    signAndProcess?: BooleanDefaultTrue;
    acceptDelayedBroadcast?: BooleanDefaultTrue;
    trustSelf?: TrustSelf;
    knownTxids?: TXIDHexString[];
    returnTXIDOnly?: BooleanDefaultFalse;
    noSend?: BooleanDefaultFalse;
    noSendChange?: OutpointString[];
    sendWith?: TXIDHexString[];
    randomizeOutputs?: BooleanDefaultTrue;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [BooleanDefaultTrue](#type-booleandefaulttrue), [OutpointString](#type-outpointstring), [TXIDHexString](#type-txidhexstring), [TrustSelf](#type-trustself)

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
#### Interface: CreateActionOutput

```ts
export interface CreateActionOutput {
    lockingScript: HexString;
    satoshis: SatoshiValue;
    outputDescription: DescriptionString5to50Bytes;
    basket?: BasketStringUnder300Bytes;
    customInstructions?: string;
    tags?: OutputTagStringUnder300Bytes[];
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [HexString](#type-hexstring), [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes), [SatoshiValue](#type-satoshivalue)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionOutputToRedeem

```ts
export interface CreateActionOutputToRedeem {
    index: number;
    unlockingScript: string | number;
    spendingDescription?: string;
    sequenceNumber?: number;
}
```

<details>

<summary>Interface CreateActionOutputToRedeem Details</summary>

##### Property index

Zero based output index within its transaction to spend, vout.

```ts
index: number
```

##### Property sequenceNumber

Sequence number to use when spending

```ts
sequenceNumber?: number
```

##### Property unlockingScript

Hex scriptcode that unlocks the satoshis or the maximum script length (in bytes) if using `signAction`.

Note that you should create any signatures with `SIGHASH_NONE | ANYONECANPAY` or similar
so that the additional Dojo outputs can be added afterward without invalidating your signature.

```ts
unlockingScript: string | number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionParams

```ts
export interface CreateActionParams {
    description: string;
    inputs?: Record<string, CreateActionInput>;
    beef?: Beef | number[];
    outputs?: CreateActionOutput[];
    lockTime?: number;
    version?: number;
    labels?: string[];
    originator?: string;
    options?: CreateActionOptions;
    acceptDelayedBroadcast?: boolean;
    log?: string;
}
```

See also: [CreateActionInput](#interface-createactioninput), [CreateActionOptions](#interface-createactionoptions), [CreateActionOutput](#interface-createactionoutput)

<details>

<summary>Interface CreateActionParams Details</summary>

##### Property acceptDelayedBroadcast

true if local validation and self-signed mapi response is sufficient.
Upon return, transaction will have `sending` status. Watchman will proceed to send the transaction asynchronously.

false if a valid mapi response from the bitcoin transaction processing network is required.
Upon return, transaction will have `unproven` status. Watchman will proceed to prove transaction.

default true

DEPRECATED: Use options.acceptDelayedBroadcast instead.

```ts
acceptDelayedBroadcast?: boolean
```

##### Property beef

Optional. Alternate source of validity proof data for `inputs`.
If `number[]` it must be serialized `Beef`.

```ts
beef?: Beef | number[]
```

##### Property description

Human readable string giving the purpose of this transaction.
Value will be encrypted prior to leaving this device.
Encrypted length limit is 500 characters.

```ts
description: string
```

##### Property inputs

If an input is self-provided (known to user's Dojo), or if beef is used,
envelope evidence can be ommitted, reducing data
size and processing time.

each input's outputsToRedeem:
  - satoshis must be greater than zero, must match output's value.
  - spendingDescription length limit is 50, values are encrypted before leaving this device
  - unlockingScript is max byte length for `signActionRequired` mode, otherwise hex string.

```ts
inputs?: Record<string, CreateActionInput>
```
See also: [CreateActionInput](#interface-createactioninput)

##### Property labels

transaction labels to apply to this transaction
default []

```ts
labels?: string[]
```

##### Property lockTime

Optional. Default is zero.
When the transaction can be processed into a block:
>= 500,000,000 values are interpreted as minimum required unix time stamps in seconds
< 500,000,000 values are interpreted as minimum required block height

```ts
lockTime?: number
```

##### Property options

Processing options.

```ts
options?: CreateActionOptions
```
See also: [CreateActionOptions](#interface-createactionoptions)

##### Property originator

Reserved Admin originators
  'projectbabbage.com'
  'staging-satoshiframe.babbage.systems'
  'satoshiframe.babbage.systems'

```ts
originator?: string
```

##### Property outputs

each output:
  - description length limit is 50, values are encrypted before leaving this device

```ts
outputs?: CreateActionOutput[]
```
See also: [CreateActionOutput](#interface-createactionoutput)

##### Property version

Optional. Transaction version number, default is current standard transaction version value.

```ts
version?: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionResult

```ts
export interface CreateActionResult {
    signActionRequired?: boolean;
    createResult?: DojoCreateTransactionResultApi;
    txid?: string;
    rawTx?: string;
    inputs?: Record<string, OptionalEnvelopeEvidenceApi>;
    beef?: number[];
    noSendChange?: OutPoint[];
    mapiResponses?: MapiResponseApi[];
    sendWithResults?: DojoSendWithResultsApi[];
    options?: CreateActionOptions;
    log?: string;
}
```

See also: [CreateActionOptions](#interface-createactionoptions), [DojoCreateTransactionResultApi](#interface-dojocreatetransactionresultapi), [DojoSendWithResultsApi](#interface-dojosendwithresultsapi), [MapiResponseApi](#interface-mapiresponseapi), [OptionalEnvelopeEvidenceApi](#interface-optionalenvelopeevidenceapi), [OutPoint](#interface-outpoint)

<details>

<summary>Interface CreateActionResult Details</summary>

##### Property beef

Valid for options.resultFormat 'beef',
in which case `rawTx` and `inputs` will be undefined.

Change output(s) that may be forwarded to chained noSend transactions.

```ts
beef?: number[]
```

##### Property createResult

if signActionRequired, the dojo createTransaction results to be forwarded to signAction

```ts
createResult?: DojoCreateTransactionResultApi
```
See also: [DojoCreateTransactionResultApi](#interface-dojocreatetransactionresultapi)

##### Property inputs

This is the fully-formed `inputs` field of this transaction, as per the SPV Envelope specification.

```ts
inputs?: Record<string, OptionalEnvelopeEvidenceApi>
```
See also: [OptionalEnvelopeEvidenceApi](#interface-optionalenvelopeevidenceapi)

##### Property log

operational and performance logging if enabled.

```ts
log?: string
```

##### Property mapiResponses

If not `signActionRequired`, at least one valid mapi response.
may be a self-signed response if `acceptDelayedBroadcast` is true.

If `signActionRequired`, empty array.

```ts
mapiResponses?: MapiResponseApi[]
```
See also: [MapiResponseApi](#interface-mapiresponseapi)

##### Property noSendChange

Valid for options.noSend true.

Change output(s) that may be forwarded to chained noSend transactions.

```ts
noSendChange?: OutPoint[]
```
See also: [OutPoint](#interface-outpoint)

##### Property options

Processing options.

```ts
options?: CreateActionOptions
```
See also: [CreateActionOptions](#interface-createactionoptions)

##### Property rawTx

if not signActionRequired, fully signed transaction as LE hex string

if signActionRequired:
  - All length specified unlocking scripts are zero bytes
  - All SABPPP template unlocking scripts have zero byte signatures
  - All custom provided unlocking scripts fully copied.

```ts
rawTx?: string
```

##### Property signActionRequired

true if at least one input's outputsToRedeem uses numeric max script byte length for unlockingScript

If true, in-process transaction will have status `unsigned`. An `unsigned` transaction must be completed
by signing all remaining unsigned inputs and calling `signAction`. Failure to complete the process in
a timely manner will cause the transaction to transition to `failed`.

If false or undefined, completed transaction will have status of `sending`, `nosend` or `unproven`,
depending on `acceptDelayedBroadcast` and `noSend`.

```ts
signActionRequired?: boolean
```

##### Property txid

if not signActionRequired, signed transaction hash (double SHA256 BE hex string)

```ts
txid?: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateActionResult

```ts
export interface CreateActionResult {
    txid?: TXIDHexString;
    tx?: AtomicBEEF;
    noSendChange?: OutpointString[];
    sendWithResults?: SendWithResult[];
    signableTransaction?: SignableTransaction;
}
```

See also: [AtomicBEEF](#type-atomicbeef), [OutpointString](#type-outpointstring), [SendWithResult](#interface-sendwithresult), [SignableTransaction](#interface-signabletransaction), [TXIDHexString](#type-txidhexstring)

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

See also: [CertificateApi](#interface-certificateapi)

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
#### Interface: CreateHmacArgs

```ts
export interface CreateHmacArgs extends WalletEncryptionArgs {
    data: Byte[];
}
```

See also: [Byte](#type-byte), [WalletEncryptionArgs](#interface-walletencryptionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateHmacResult

```ts
export interface CreateHmacResult {
    hmac: Byte[];
}
```

See also: [Byte](#type-byte)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateSignatureArgs

```ts
export interface CreateSignatureArgs extends WalletEncryptionArgs {
    data?: Byte[];
    hashToDirectlySign?: Byte[];
}
```

See also: [Byte](#type-byte), [WalletEncryptionArgs](#interface-walletencryptionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: CreateSignatureResult

```ts
export interface CreateSignatureResult {
    signature: Byte[];
}
```

See also: [Byte](#type-byte)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DiscoverByAttributesArgs

```ts
export interface DiscoverByAttributesArgs {
    attributes: Record<CertificateFieldNameUnder50Bytes, string>;
    limit?: PositiveIntegerDefault10Max10000;
    offset?: PositiveIntegerOrZero;
    seekPermission?: BooleanDefaultTrue;
}
```

See also: [BooleanDefaultTrue](#type-booleandefaulttrue), [CertificateFieldNameUnder50Bytes](#type-certificatefieldnameunder50bytes), [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DiscoverByIdentityKeyArgs

```ts
export interface DiscoverByIdentityKeyArgs {
    identityKey: PubKeyHex;
    limit?: PositiveIntegerDefault10Max10000;
    offset?: PositiveIntegerOrZero;
    seekPermission?: BooleanDefaultTrue;
}
```

See also: [BooleanDefaultTrue](#type-booleandefaulttrue), [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000), [PositiveIntegerOrZero](#type-positiveintegerorzero), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DiscoverCertificatesResult

```ts
export interface DiscoverCertificatesResult {
    totalCertificates: PositiveIntegerOrZero;
    certificates: IdentityCertificate[];
}
```

See also: [IdentityCertificate](#interface-identitycertificate), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DojoCreateTransactionResultApi

```ts
export interface DojoCreateTransactionResultApi {
    inputs: Record<string, DojoCreatingTxInputsApi>;
    outputs: DojoCreateTxResultOutputApi[];
    derivationPrefix: string;
    version: number;
    lockTime: number;
    referenceNumber: string;
    paymailHandle: string;
    note?: string;
    log?: string;
}
```

See also: [DojoCreateTxResultOutputApi](#interface-dojocreatetxresultoutputapi), [DojoCreatingTxInputsApi](#interface-dojocreatingtxinputsapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DojoCreateTxOutputApi

A specific output to be created as part of a new transactions.
These outputs can contain custom scripts as specified by recipients.

```ts
export interface DojoCreateTxOutputApi {
    script: string;
    satoshis: number;
    description?: string;
    basket?: string;
    customInstructions?: string;
    tags?: string[];
}
```

<details>

<summary>Interface DojoCreateTxOutputApi Details</summary>

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
#### Interface: DojoCreateTxResultInstructionsApi

```ts
export interface DojoCreateTxResultInstructionsApi {
    type: string;
    derivationPrefix?: string;
    derivationSuffix?: string;
    senderIdentityKey?: string;
    paymailHandle?: string;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DojoCreateTxResultOutputApi

```ts
export interface DojoCreateTxResultOutputApi extends DojoCreateTxOutputApi {
    providedBy: DojoProvidedByApi;
    purpose?: string;
    destinationBasket?: string;
    derivationSuffix?: string;
    keyOffset?: string;
}
```

See also: [DojoCreateTxOutputApi](#interface-dojocreatetxoutputapi), [DojoProvidedByApi](#type-dojoprovidedbyapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DojoCreatingTxInputsApi

```ts
export interface DojoCreatingTxInputsApi extends EnvelopeEvidenceApi {
    outputsToRedeem: DojoOutputToRedeemApi[];
    providedBy: DojoProvidedByApi;
    instructions: Record<number, DojoCreateTxResultInstructionsApi>;
}
```

See also: [DojoCreateTxResultInstructionsApi](#interface-dojocreatetxresultinstructionsapi), [DojoOutputToRedeemApi](#interface-dojooutputtoredeemapi), [DojoProvidedByApi](#type-dojoprovidedbyapi), [EnvelopeEvidenceApi](#interface-envelopeevidenceapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DojoOutputToRedeemApi

```ts
export interface DojoOutputToRedeemApi {
    index: number;
    unlockingScriptLength: number;
    spendingDescription?: string;
}
```

<details>

<summary>Interface DojoOutputToRedeemApi Details</summary>

##### Property index

Zero based output index within its transaction to spend.

```ts
index: number
```

##### Property unlockingScriptLength

byte length of unlocking script

Note: To protect client keys and utxo control, unlocking scripts are never shared with Dojo.

```ts
unlockingScriptLength: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: DojoSendWithResultsApi

```ts
export interface DojoSendWithResultsApi {
    txid: string;
    transactionId: number;
    reference: string;
    status: "unproven" | "failed" | "sending";
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: EnvelopeApi

Simplest case of an envelope is a `rawTx` and merkle `proof` that ties the transaction to a known block header.
This will be the case for any sufficiently old transaction.

If the transaction has been mined but for some reason the block headers may not be known, an array of `headers` linking
known headers to the one needed by the `proof` may be provided. They must be in height order and need to overlap
a known header.

If the transaction has not been minded yet but it has been submitted to one or more miners then the mapi responses
received, proving that specific miners have received the transaction for processing, are included in the
mapiResponses array.
Note that the miner reputations must be checked to give weight to these responses.

Additionally, when the transaction hasn't been mined or a `proof` is unavailable and mapi responses proving miner
acceptance are unavailable, then all the transactions providing inputs can be submitted in an inputs object.

The keys of the inputs object are the transaction hashes (txids) of each of the input transactions.
The value of each inputs object property is another envelope object.

References:
Section 2 of https://projectbabbage.com/assets/simplified-payments.pdf
https://gist.github.com/ty-everett/44b6a0e7f3d6c48439f9ff26068f8d8b

```ts
export interface EnvelopeApi extends EnvelopeEvidenceApi {
    headers?: string[];
    reference?: string;
}
```

See also: [EnvelopeEvidenceApi](#interface-envelopeevidenceapi)

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

See also: [MapiResponseApi](#interface-mapiresponseapi), [TscMerkleProofApi](#interface-tscmerkleproofapi)

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
See also: [EnvelopeEvidenceApi](#interface-envelopeevidenceapi)

##### Property mapiResponses

Array of mapi transaction status update responses
Only the payload, signature, and publicKey properties are relevant.

Branching inputs nodes only.
Array of mapi transaction status update responses confirming
unproven transctions have at least been submitted for processing.

```ts
mapiResponses?: MapiResponseApi[]
```
See also: [MapiResponseApi](#interface-mapiresponseapi)

##### Property proof

Either proof, or inputs, must have a value.
Leaf nodes have proofs.

If value is a Buffer, content is binary encoded serialized proof
see: chaintracks-spv.utils.serializeTscMerkleProof

```ts
proof?: TscMerkleProofApi | Buffer
```
See also: [TscMerkleProofApi](#interface-tscmerkleproofapi)

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
#### Interface: GetHeaderArgs

```ts
export interface GetHeaderArgs {
    height: PositiveInteger;
}
```

See also: [PositiveInteger](#type-positiveinteger)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: GetHeaderResult

```ts
export interface GetHeaderResult {
    header: HexString;
}
```

See also: [HexString](#type-hexstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: GetHeightResult

```ts
export interface GetHeightResult {
    height: PositiveInteger;
}
```

See also: [PositiveInteger](#type-positiveinteger)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: GetInfoParams

```ts
export interface GetInfoParams {
    description?: string;
}
```

<details>

<summary>Interface GetInfoParams Details</summary>

##### Property description

Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.

```ts
description?: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: GetInfoResult

```ts
export interface GetInfoResult {
    metanetClientVersion: string;
    chain: Chain;
    height: number;
    userId: number;
    userIdentityKey: string;
    dojoIdentityKey: string;
    dojoIdentityName?: string;
    perferredCurrency: string;
}
```

See also: [Chain](#type-chain)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: GetNetworkResult

```ts
export interface GetNetworkResult {
    network: WalletNetwork;
}
```

See also: [WalletNetwork](#type-walletnetwork)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: GetPublicKeyArgs

When `identityKey` is true, `WalletEncryptionArgs` are not used.

When `identityKey` is undefined, `WalletEncryptionArgs` are required.

```ts
export interface GetPublicKeyArgs extends Partial<WalletEncryptionArgs> {
    identityKey?: true;
    forSelf?: BooleanDefaultFalse;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [WalletEncryptionArgs](#interface-walletencryptionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: GetPublicKeyResult

```ts
export interface GetPublicKeyResult {
    publicKey: PubKeyHex;
}
```

See also: [PubKeyHex](#type-pubkeyhex)

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

See also: [EnvelopeApi](#interface-envelopeapi)

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
See also: [EnvelopeApi](#interface-envelopeapi)

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
#### Interface: GetVersionResult

```ts
export interface GetVersionResult {
    version: VersionString7To30Bytes;
}
```

See also: [VersionString7To30Bytes](#type-versionstring7to30bytes)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: IdentityCertificate

```ts
export interface IdentityCertificate extends WalletCertificate {
    certifierInfo: IdentityCertifier;
    publiclyRevealedKeyring: Record<CertificateFieldNameUnder50Bytes, Base64String>;
    decryptedFields: Record<CertificateFieldNameUnder50Bytes, string>;
}
```

See also: [Base64String](#type-base64string), [CertificateFieldNameUnder50Bytes](#type-certificatefieldnameunder50bytes), [IdentityCertifier](#interface-identitycertifier), [WalletCertificate](#interface-walletcertificate)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: IdentityCertifier

```ts
export interface IdentityCertifier {
    name: EntityNameStringMax100Bytes;
    iconUrl: EntityIconURLStringMax500Bytes;
    description: DescriptionString5to50Bytes;
    trust: PositiveIntegerMax10;
}
```

See also: [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [EntityIconURLStringMax500Bytes](#type-entityiconurlstringmax500bytes), [EntityNameStringMax100Bytes](#type-entitynamestringmax100bytes), [PositiveIntegerMax10](#type-positiveintegermax10)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: InternalizeActionArgs

```ts
export interface InternalizeActionArgs {
    tx: AtomicBEEF;
    outputs: InternalizeOutput[];
    description: DescriptionString5to50Bytes;
    labels?: LabelStringUnder300Bytes[];
    seekPermission?: BooleanDefaultTrue;
}
```

See also: [AtomicBEEF](#type-atomicbeef), [BooleanDefaultTrue](#type-booleandefaulttrue), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [InternalizeOutput](#interface-internalizeoutput), [LabelStringUnder300Bytes](#type-labelstringunder300bytes)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: InternalizeActionResult

```ts
export interface InternalizeActionResult {
    accepted: true;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: InternalizeOutput

```ts
export interface InternalizeOutput {
    outputIndex: PositiveIntegerOrZero;
    protocol: "wallet payment" | "basket insertion";
    paymentRemittance?: WalletPayment;
    insertionRemittance?: BasketInsertion;
}
```

See also: [BasketInsertion](#interface-basketinsertion), [PositiveIntegerOrZero](#type-positiveintegerorzero), [WalletPayment](#interface-walletpayment)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: KeyDeriverApi

```ts
export interface KeyDeriverApi {
    rootKey: PrivateKey;
    identityKey: string;
    derivePublicKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty, forSelf?: boolean): PublicKey;
    derivePrivateKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): PrivateKey;
    deriveSymmetricKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): SymmetricKey;
    revealCounterpartySecret(counterparty: Counterparty): number[];
    revealSpecificSecret(counterparty: Counterparty, protocolID: WalletProtocol, keyID: string): number[];
}
```

See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

<details>

<summary>Interface KeyDeriverApi Details</summary>

##### Property identityKey

The identity of this key deriver which is normally the public key associated with the `rootKey`

```ts
identityKey: string
```

##### Property rootKey

The root key from which all other keys are derived.

```ts
rootKey: PrivateKey
```

##### Method derivePrivateKey

Derives a private key based on protocol ID, key ID, and counterparty.

```ts
derivePrivateKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): PrivateKey
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived private key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

##### Method derivePublicKey

Derives a public key based on protocol ID, key ID, and counterparty.

```ts
derivePublicKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty, forSelf?: boolean): PublicKey
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived public key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').
+ **forSelf**
  + Optional. false if undefined. Whether deriving for self.

##### Method deriveSymmetricKey

Derives a symmetric key based on protocol ID, key ID, and counterparty.
Note: Symmetric keys should not be derivable by everyone due to security risks.

```ts
deriveSymmetricKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): SymmetricKey
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived symmetric key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

Throws

- Throws an error if attempting to derive a symmetric key for 'anyone'.

##### Method revealCounterpartySecret

Reveals the shared secret between the root key and the counterparty.
Note: This should not be used for 'self'.

```ts
revealCounterpartySecret(counterparty: Counterparty): number[]
```
See also: [Counterparty](#type-counterparty)

Returns

- The shared secret as a number array.

Argument Details

+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

Throws

- Throws an error if attempting to reveal a shared secret for 'self'.

##### Method revealSpecificSecret

Reveals the specific key association for a given protocol ID, key ID, and counterparty.

```ts
revealSpecificSecret(counterparty: Counterparty, protocolID: WalletProtocol, keyID: string): number[]
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The specific key association as a number array.

Argument Details

+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').
+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: KeyLinkageResult

```ts
export interface KeyLinkageResult {
    encryptedLinkage: Byte[];
    encryptedLinkageProof: Byte[];
    prover: PubKeyHex;
    verifier: PubKeyHex;
    counterparty: PubKeyHex;
}
```

See also: [Byte](#type-byte), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListActionsArgs

```ts
export interface ListActionsArgs {
    labels: LabelStringUnder300Bytes[];
    labelQueryMode?: "any" | "all";
    includeLabels?: BooleanDefaultFalse;
    includeInputs?: BooleanDefaultFalse;
    includeInputSourceLockingScripts?: BooleanDefaultFalse;
    includeInputUnlockingScripts?: BooleanDefaultFalse;
    includeOutputs?: BooleanDefaultFalse;
    includeOutputLockingScripts?: BooleanDefaultFalse;
    limit?: PositiveIntegerDefault10Max10000;
    offset?: PositiveIntegerOrZero;
    seekPermission?: BooleanDefaultTrue;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [BooleanDefaultTrue](#type-booleandefaulttrue), [LabelStringUnder300Bytes](#type-labelstringunder300bytes), [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListActionsResult

```ts
export interface ListActionsResult {
    totalTransactions: number;
    transactions: ListActionsTransaction[];
}
```

See also: [ListActionsTransaction](#interface-listactionstransaction)

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
See also: [ListActionsTransaction](#interface-listactionstransaction)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListActionsResult

```ts
export interface ListActionsResult {
    totalActions: PositiveIntegerOrZero;
    actions: WalletAction[];
}
```

See also: [PositiveIntegerOrZero](#type-positiveintegerorzero), [WalletAction](#interface-walletaction)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListActionsTransaction

```ts
export interface ListActionsTransaction {
    txid: string;
    amount: number;
    status: TransactionStatusApi;
    senderPaymail: string;
    recipientPaymail: string;
    isOutgoing: boolean;
    note: string;
    created_at: string;
    referenceNumber: string;
    labels: string[];
    inputs?: ListActionsTransactionInput[];
    outputs?: ListActionsTransactionOutput[];
}
```

See also: [ListActionsTransactionInput](#interface-listactionstransactioninput), [ListActionsTransactionOutput](#interface-listactionstransactionoutput), [TransactionStatusApi](#type-transactionstatusapi)

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

##### Property labels

A set of all the labels affixed to the transaction

```ts
labels: string[]
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
status: TransactionStatusApi
```
See also: [TransactionStatusApi](#type-transactionstatusapi)

##### Property txid

The transaction ID

```ts
txid: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListActionsTransactionInput

```ts
export interface ListActionsTransactionInput {
    txid: string;
    vout: number;
    amount: number;
    outputScript: string;
    type: string;
    spendable: boolean;
    spendingDescription?: string;
    basket?: string;
    tags?: string[];
}
```

<details>

<summary>Interface ListActionsTransactionInput Details</summary>

##### Property amount

Number of satoshis in the output

```ts
amount: number
```

##### Property basket

Optionally included basket assignment.

```ts
basket?: string
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

##### Property spendingDescription

Spending description for this transaction input

```ts
spendingDescription?: string
```

##### Property tags

Optionally included tag assignments.

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
#### Interface: ListActionsTransactionOutput

```ts
export interface ListActionsTransactionOutput {
    txid: string;
    vout: number;
    amount: number;
    outputScript: string;
    type: string;
    spendable: boolean;
    description?: string;
    basket?: string;
    tags?: string[];
}
```

<details>

<summary>Interface ListActionsTransactionOutput Details</summary>

##### Property amount

Number of satoshis in the output

```ts
amount: number
```

##### Property basket

Optionally included basket assignment.

```ts
basket?: string
```

##### Property description

Output description

```ts
description?: string
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

Optionally included tag assignments.

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
#### Interface: ListCertificatesArgs

```ts
export interface ListCertificatesArgs {
    certifiers: PubKeyHex[];
    types: Base64String[];
    limit?: PositiveIntegerDefault10Max10000;
    offset?: PositiveIntegerOrZero;
    privileged?: BooleanDefaultFalse;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [Base64String](#type-base64string), [BooleanDefaultFalse](#type-booleandefaultfalse), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000), [PositiveIntegerOrZero](#type-positiveintegerorzero), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListCertificatesResult

```ts
export interface ListCertificatesResult {
    totalCertificates: PositiveIntegerOrZero;
    certificates: WalletCertificate[];
}
```

See also: [PositiveIntegerOrZero](#type-positiveintegerorzero), [WalletCertificate](#interface-walletcertificate)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListOutputsArgs

```ts
export interface ListOutputsArgs {
    basket: BasketStringUnder300Bytes;
    tags?: OutputTagStringUnder300Bytes[];
    tagQueryMode?: "all" | "any";
    include?: "locking scripts" | "entire transactions";
    includeCustomInstructions?: BooleanDefaultFalse;
    includeTags?: BooleanDefaultFalse;
    includeLabels?: BooleanDefaultFalse;
    limit?: PositiveIntegerDefault10Max10000;
    offset?: PositiveIntegerOrZero;
    seekPermission?: BooleanDefaultTrue;
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [BooleanDefaultFalse](#type-booleandefaultfalse), [BooleanDefaultTrue](#type-booleandefaulttrue), [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes), [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ListOutputsResult

```ts
export interface ListOutputsResult {
    totalOutputs: PositiveIntegerOrZero;
    BEEF?: BEEF;
    outputs: WalletOutput[];
}
```

See also: [BEEF](#type-beef), [PositiveIntegerOrZero](#type-positiveintegerorzero), [WalletOutput](#interface-walletoutput)

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
#### Interface: OptionalEnvelopeEvidenceApi

Either rawTx or txid are required. If txid, then it must be a known transaction.

If not a known trxid, either inputs or proof are required.

```ts
export interface OptionalEnvelopeEvidenceApi {
    rawTx?: string;
    proof?: TscMerkleProofApi | Buffer;
    inputs?: Record<string, OptionalEnvelopeEvidenceApi>;
    txid?: string;
    mapiResponses?: MapiResponseApi[];
    depth?: number;
}
```

See also: [MapiResponseApi](#interface-mapiresponseapi), [TscMerkleProofApi](#interface-tscmerkleproofapi)

<details>

<summary>Interface OptionalEnvelopeEvidenceApi Details</summary>

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
inputs?: Record<string, OptionalEnvelopeEvidenceApi>
```
See also: [OptionalEnvelopeEvidenceApi](#interface-optionalenvelopeevidenceapi)

##### Property mapiResponses

Array of mapi transaction status update responses
Only the payload, signature, and publicKey properties are relevant.

Branching inputs nodes only.
Array of mapi transaction status update responses confirming
unproven transctions have at least been submitted for processing.

```ts
mapiResponses?: MapiResponseApi[]
```
See also: [MapiResponseApi](#interface-mapiresponseapi)

##### Property proof

Either proof, or inputs, must have a value.
Leaf nodes have proofs.

If value is a Buffer, content is binary encoded serialized proof
see: chaintracks-spv.utils.serializeTscMerkleProof

```ts
proof?: TscMerkleProofApi | Buffer
```
See also: [TscMerkleProofApi](#interface-tscmerkleproofapi)

##### Property rawTx

A valid bitcoin transaction encoded as a hex string.

```ts
rawTx?: string
```

##### Property txid

double SHA256 hash of serialized rawTx. Optional.

```ts
txid?: string
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: OutPoint

Identifies a unique transaction output by its `txid` and index `vout`

```ts
export interface OutPoint {
    txid: string;
    vout: number;
}
```

<details>

<summary>Interface OutPoint Details</summary>

##### Property txid

Transaction double sha256 hash as big endian hex string

```ts
txid: string
```

##### Property vout

zero based output index within the transaction

```ts
vout: number
```

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ProveCertificateArgs

```ts
export interface ProveCertificateArgs {
    certificate: WalletCertificate;
    fieldsToReveal: CertificateFieldNameUnder50Bytes[];
    verifier: PubKeyHex;
    privileged?: BooleanDefaultFalse;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [CertificateFieldNameUnder50Bytes](#type-certificatefieldnameunder50bytes), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [PubKeyHex](#type-pubkeyhex), [WalletCertificate](#interface-walletcertificate)

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

See also: [CertificateApi](#interface-certificateapi)

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
#### Interface: ProveCertificateResult

```ts
export interface ProveCertificateResult {
    keyringForVerifier: Record<CertificateFieldNameUnder50Bytes, Base64String>;
}
```

See also: [Base64String](#type-base64string), [CertificateFieldNameUnder50Bytes](#type-certificatefieldnameunder50bytes)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: RelinquishCertificateArgs

```ts
export interface RelinquishCertificateArgs {
    type: Base64String;
    serialNumber: Base64String;
    certifier: PubKeyHex;
}
```

See also: [Base64String](#type-base64string), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: RelinquishCertificateResult

```ts
export interface RelinquishCertificateResult {
    relinquished: boolean;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: RelinquishOutputArgs

```ts
export interface RelinquishOutputArgs {
    basket: BasketStringUnder300Bytes;
    output: OutpointString;
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [OutpointString](#type-outpointstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: RelinquishOutputResult

```ts
export interface RelinquishOutputResult {
    relinquished: true;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: RevealCounterpartyKeyLinkageArgs

```ts
export interface RevealCounterpartyKeyLinkageArgs {
    counterparty: PubKeyHex;
    verifier: PubKeyHex;
    privileged?: BooleanDefaultFalse;
    privilegedReason?: DescriptionString5to50Bytes;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: RevealCounterpartyKeyLinkageResult

```ts
export interface RevealCounterpartyKeyLinkageResult extends KeyLinkageResult {
    revelationTime: ISOTimestampString;
}
```

See also: [ISOTimestampString](#type-isotimestampstring), [KeyLinkageResult](#interface-keylinkageresult)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: RevealSpecificKeyLinkageArgs

```ts
export interface RevealSpecificKeyLinkageArgs {
    counterparty: WalletCounterparty;
    verifier: PubKeyHex;
    protocolID: WalletProtocol;
    keyID: KeyIDStringUnder800Bytes;
    privilegedReason?: DescriptionString5to50Bytes;
    privileged?: BooleanDefaultFalse;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [KeyIDStringUnder800Bytes](#type-keyidstringunder800bytes), [PubKeyHex](#type-pubkeyhex), [WalletCounterparty](#type-walletcounterparty), [WalletProtocol](#type-walletprotocol)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: RevealSpecificKeyLinkageResult

```ts
export interface RevealSpecificKeyLinkageResult extends KeyLinkageResult {
    protocolID: WalletProtocol;
    keyID: KeyIDStringUnder800Bytes;
    proofType: Byte;
}
```

See also: [Byte](#type-byte), [KeyIDStringUnder800Bytes](#type-keyidstringunder800bytes), [KeyLinkageResult](#interface-keylinkageresult), [WalletProtocol](#type-walletprotocol)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SendWithResult

```ts
export interface SendWithResult {
    txid: TXIDHexString;
    status: SendWithResultStatus;
}
```

See also: [SendWithResultStatus](#type-sendwithresultstatus), [TXIDHexString](#type-txidhexstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SignActionArgs

```ts
export interface SignActionArgs {
    spends: Record<PositiveIntegerOrZero, SignActionSpend>;
    reference: Base64String;
    options?: SignActionOptions;
}
```

See also: [Base64String](#type-base64string), [PositiveIntegerOrZero](#type-positiveintegerorzero), [SignActionOptions](#interface-signactionoptions), [SignActionSpend](#interface-signactionspend)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SignActionOptions

```ts
export interface SignActionOptions {
    acceptDelayedBroadcast?: BooleanDefaultTrue;
    returnTXIDOnly?: BooleanDefaultFalse;
    noSend?: BooleanDefaultFalse;
    sendWith?: TXIDHexString[];
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [BooleanDefaultTrue](#type-booleandefaulttrue), [TXIDHexString](#type-txidhexstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SignActionResult

```ts
export interface SignActionResult {
    rawTx: string;
    inputs: Record<string, EnvelopeEvidenceApi>;
    mapiResponses: MapiResponseApi[];
    txid: string;
    log?: string;
}
```

See also: [EnvelopeEvidenceApi](#interface-envelopeevidenceapi), [MapiResponseApi](#interface-mapiresponseapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SignActionResult

```ts
export interface SignActionResult {
    txid?: TXIDHexString;
    tx?: AtomicBEEF;
    sendWithResults?: SendWithResult[];
}
```

See also: [AtomicBEEF](#type-atomicbeef), [SendWithResult](#interface-sendwithresult), [TXIDHexString](#type-txidhexstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SignActionSpend

```ts
export interface SignActionSpend {
    unlockingScript: HexString;
    sequenceNumber?: PositiveIntegerOrZero;
}
```

See also: [HexString](#type-hexstring), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SignableTransaction

```ts
export interface SignableTransaction {
    tx: AtomicBEEF;
    reference: Base64String;
}
```

See also: [AtomicBEEF](#type-atomicbeef), [Base64String](#type-base64string)

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

See also: [ProtocolID](#type-protocolid)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: SubmitDirectTransaction

```ts
export interface SubmitDirectTransaction {
    rawTx: string;
    txid?: string;
    inputs?: Record<string, OptionalEnvelopeEvidenceApi>;
    mapiResponses?: MapiResponseApi[];
    proof?: TscMerkleProofApi;
    outputs: SubmitDirectTransactionOutput[];
    referenceNumber?: string;
}
```

See also: [MapiResponseApi](#interface-mapiresponseapi), [OptionalEnvelopeEvidenceApi](#interface-optionalenvelopeevidenceapi), [SubmitDirectTransactionOutput](#interface-submitdirecttransactionoutput), [TscMerkleProofApi](#interface-tscmerkleproofapi)

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
    tags?: string[];
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
#### Interface: ValidAbortActionArgs

```ts
export interface ValidAbortActionArgs {
    reference: sdk.Base64String;
    log?: string;
}
```

See also: [Base64String](#type-base64string)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidAcquireCertificateArgs

```ts
export interface ValidAcquireCertificateArgs {
    type: sdk.Base64String;
    certifier: sdk.PubKeyHex;
    acquisitionProtocol: sdk.AcquisitionProtocol;
    fields: Record<sdk.CertificateFieldNameUnder50Bytes, string>;
    serialNumber?: sdk.Base64String;
    revocationOutpoint?: sdk.OutpointString;
    signature?: sdk.HexString;
    certifierUrl?: string;
    keyringRevealer?: sdk.KeyringRevealer;
    keyringForSubject?: Record<sdk.CertificateFieldNameUnder50Bytes, sdk.Base64String>;
    privileged?: sdk.BooleanDefaultFalse;
    privilegedReason?: sdk.DescriptionString5to50Bytes;
    log?: string;
}
```

See also: [AcquisitionProtocol](#type-acquisitionprotocol), [Base64String](#type-base64string), [BooleanDefaultFalse](#type-booleandefaultfalse), [CertificateFieldNameUnder50Bytes](#type-certificatefieldnameunder50bytes), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [HexString](#type-hexstring), [KeyringRevealer](#type-keyringrevealer), [OutpointString](#type-outpointstring), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidBasketInsertion

```ts
export interface ValidBasketInsertion {
    basket: sdk.BasketStringUnder300Bytes;
    customInstructions?: string;
    tags: sdk.OutputTagStringUnder300Bytes[];
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidCreateActionArgs

```ts
export interface ValidCreateActionArgs extends ValidProcessActionArgs {
    description: sdk.DescriptionString5to50Bytes;
    inputBEEF?: sdk.BEEF;
    inputs: sdk.ValidCreateActionInput[];
    outputs: sdk.ValidCreateActionOutput[];
    lockTime: number;
    version: number;
    labels: string[];
    options: ValidCreateActionOptions;
    isSignAction: boolean;
}
```

See also: [BEEF](#type-beef), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [ValidCreateActionInput](#interface-validcreateactioninput), [ValidCreateActionOptions](#interface-validcreateactionoptions), [ValidCreateActionOutput](#interface-validcreateactionoutput), [ValidProcessActionArgs](#interface-validprocessactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidCreateActionInput

```ts
export interface ValidCreateActionInput {
    outpoint: OutPoint;
    inputDescription: sdk.DescriptionString5to50Bytes;
    sequenceNumber: sdk.PositiveIntegerOrZero;
    unlockingScript?: sdk.HexString;
    unlockingScriptLength: sdk.PositiveInteger;
}
```

See also: [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [HexString](#type-hexstring), [OutPoint](#interface-outpoint), [PositiveInteger](#type-positiveinteger), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidCreateActionOptions

```ts
export interface ValidCreateActionOptions extends ValidProcessActionOptions {
    signAndProcess: boolean;
    trustSelf?: TrustSelf;
    knownTxids: sdk.TXIDHexString[];
    noSendChange: OutPoint[];
    randomizeOutputs: boolean;
}
```

See also: [OutPoint](#interface-outpoint), [TXIDHexString](#type-txidhexstring), [TrustSelf](#type-trustself), [ValidProcessActionOptions](#interface-validprocessactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidCreateActionOutput

```ts
export interface ValidCreateActionOutput {
    lockingScript: sdk.HexString;
    satoshis: sdk.SatoshiValue;
    outputDescription: sdk.DescriptionString5to50Bytes;
    basket?: sdk.BasketStringUnder300Bytes;
    customInstructions?: string;
    tags: sdk.OutputTagStringUnder300Bytes[];
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [HexString](#type-hexstring), [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes), [SatoshiValue](#type-satoshivalue)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidInternalizeActionArgs

```ts
export interface ValidInternalizeActionArgs {
    tx: sdk.AtomicBEEF;
    outputs: sdk.InternalizeOutput[];
    description: sdk.DescriptionString5to50Bytes;
    labels: sdk.LabelStringUnder300Bytes[];
    seekPermission: sdk.BooleanDefaultTrue;
    log?: string;
}
```

See also: [AtomicBEEF](#type-atomicbeef), [BooleanDefaultTrue](#type-booleandefaulttrue), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [InternalizeOutput](#interface-internalizeoutput), [LabelStringUnder300Bytes](#type-labelstringunder300bytes)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidInternalizeOutput

```ts
export interface ValidInternalizeOutput {
    outputIndex: sdk.PositiveIntegerOrZero;
    protocol: "wallet payment" | "basket insertion";
    paymentRemittance?: ValidWalletPayment;
    insertionRemittance?: ValidBasketInsertion;
}
```

See also: [PositiveIntegerOrZero](#type-positiveintegerorzero), [ValidBasketInsertion](#interface-validbasketinsertion), [ValidWalletPayment](#interface-validwalletpayment)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidListActionsArgs

```ts
export interface ValidListActionsArgs {
    labels: sdk.LabelStringUnder300Bytes[];
    labelQueryMode: "any" | "all";
    includeLabels: sdk.BooleanDefaultFalse;
    includeInputs: sdk.BooleanDefaultFalse;
    includeInputSourceLockingScripts: sdk.BooleanDefaultFalse;
    includeInputUnlockingScripts: sdk.BooleanDefaultFalse;
    includeOutputs: sdk.BooleanDefaultFalse;
    includeOutputLockingScripts: sdk.BooleanDefaultFalse;
    limit: sdk.PositiveIntegerDefault10Max10000;
    offset: sdk.PositiveIntegerOrZero;
    seekPermission: sdk.BooleanDefaultTrue;
    log?: string;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [BooleanDefaultTrue](#type-booleandefaulttrue), [LabelStringUnder300Bytes](#type-labelstringunder300bytes), [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidListCertificatesArgs

```ts
export interface ValidListCertificatesArgs {
    certifiers: sdk.PubKeyHex[];
    types: sdk.Base64String[];
    limit: sdk.PositiveIntegerDefault10Max10000;
    offset: sdk.PositiveIntegerOrZero;
    privileged: sdk.BooleanDefaultFalse;
    privilegedReason?: sdk.DescriptionString5to50Bytes;
    log?: string;
}
```

See also: [Base64String](#type-base64string), [BooleanDefaultFalse](#type-booleandefaultfalse), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000), [PositiveIntegerOrZero](#type-positiveintegerorzero), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidListOutputsArgs

```ts
export interface ValidListOutputsArgs {
    basket: sdk.BasketStringUnder300Bytes;
    tags: sdk.OutputTagStringUnder300Bytes[];
    tagQueryMode: "all" | "any";
    includeLockingScripts: boolean;
    includeTransactions: boolean;
    includeCustomInstructions: sdk.BooleanDefaultFalse;
    includeTags: sdk.BooleanDefaultFalse;
    includeLabels: sdk.BooleanDefaultFalse;
    limit: sdk.PositiveIntegerDefault10Max10000;
    offset: sdk.PositiveIntegerOrZero;
    seekPermission: sdk.BooleanDefaultTrue;
    knownTxids: string[];
    log?: string;
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [BooleanDefaultFalse](#type-booleandefaultfalse), [BooleanDefaultTrue](#type-booleandefaulttrue), [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes), [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000), [PositiveIntegerOrZero](#type-positiveintegerorzero)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidProcessActionArgs

```ts
export interface ValidProcessActionArgs {
    options: sdk.ValidProcessActionOptions;
    isSendWith: boolean;
    isNewTx: boolean;
    isNoSend: boolean;
    isDelayed: boolean;
    log?: string;
}
```

See also: [ValidProcessActionOptions](#interface-validprocessactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidProcessActionOptions

```ts
export interface ValidProcessActionOptions {
    acceptDelayedBroadcast: sdk.BooleanDefaultTrue;
    returnTXIDOnly: sdk.BooleanDefaultFalse;
    noSend: sdk.BooleanDefaultFalse;
    sendWith: sdk.TXIDHexString[];
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [BooleanDefaultTrue](#type-booleandefaulttrue), [TXIDHexString](#type-txidhexstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidRelinquishOutputArgs

```ts
export interface ValidRelinquishOutputArgs {
    basket: sdk.BasketStringUnder300Bytes;
    output: sdk.OutpointString;
    log?: string;
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [OutpointString](#type-outpointstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidSignActionArgs

```ts
export interface ValidSignActionArgs extends ValidProcessActionArgs {
    spends: Record<sdk.PositiveIntegerOrZero, sdk.SignActionSpend>;
    reference: sdk.Base64String;
    options: sdk.ValidSignActionOptions;
}
```

See also: [Base64String](#type-base64string), [PositiveIntegerOrZero](#type-positiveintegerorzero), [SignActionSpend](#interface-signactionspend), [ValidProcessActionArgs](#interface-validprocessactionargs), [ValidSignActionOptions](#interface-validsignactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidSignActionOptions

```ts
export interface ValidSignActionOptions extends ValidProcessActionOptions {
    acceptDelayedBroadcast: boolean;
    returnTXIDOnly: boolean;
    noSend: boolean;
    sendWith: sdk.TXIDHexString[];
}
```

See also: [TXIDHexString](#type-txidhexstring), [ValidProcessActionOptions](#interface-validprocessactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: ValidWalletPayment

```ts
export interface ValidWalletPayment {
    derivationPrefix: sdk.Base64String;
    derivationSuffix: sdk.Base64String;
    senderIdentityKey: sdk.PubKeyHex;
}
```

See also: [Base64String](#type-base64string), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: VerifyHmacArgs

```ts
export interface VerifyHmacArgs extends WalletEncryptionArgs {
    data: Byte[];
    hmac: Byte[];
}
```

See also: [Byte](#type-byte), [WalletEncryptionArgs](#interface-walletencryptionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: VerifyHmacResult

```ts
export interface VerifyHmacResult {
    valid: boolean;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: VerifySignatureArgs

```ts
export interface VerifySignatureArgs extends WalletEncryptionArgs {
    data?: Byte[];
    hashToDirectlyVerify?: Byte[];
    signature: Byte[];
    forSelf?: BooleanDefaultFalse;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [Byte](#type-byte), [WalletEncryptionArgs](#interface-walletencryptionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: VerifySignatureResult

```ts
export interface VerifySignatureResult {
    valid: true;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: Wallet

The Wallet interface defines a wallet capable of various tasks including transaction creation and signing,
encryption, decryption, identity certificate management, identity verification, and communication
with applications as per the BRC standards. This interface allows applications to interact with
the wallet for a range of functionalities aligned with the Babbage architectural principles.

Error Handling

Every method of the `Wallet` interface has a return value of the form `Promise<object>`.
When an error occurs, an exception object may be thrown which must conform to the `WalletErrorObject` interface.
Serialization layers can rely on the `isError` property being unique to error objects to
deserialize and rethrow `WalletErrorObject` conforming objects.

```ts
export interface Wallet extends WalletCryptoObject {
    createAction: (args: CreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<CreateActionResult>;
    signAction: (args: SignActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<SignActionResult>;
    abortAction: (args: AbortActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<AbortActionResult>;
    listActions: (args: ListActionsArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<ListActionsResult>;
    internalizeAction: (args: InternalizeActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<InternalizeActionResult>;
    listOutputs: (args: ListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<ListOutputsResult>;
    relinquishOutput: (args: RelinquishOutputArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<RelinquishOutputResult>;
    acquireCertificate: (args: AcquireCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<AcquireCertificateResult>;
    listCertificates: (args: ListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<ListCertificatesResult>;
    proveCertificate: (args: ProveCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<ProveCertificateResult>;
    relinquishCertificate: (args: RelinquishCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<RelinquishCertificateResult>;
    discoverByIdentityKey: (args: DiscoverByIdentityKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<DiscoverCertificatesResult>;
    discoverByAttributes: (args: DiscoverByAttributesArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<DiscoverCertificatesResult>;
    isAuthenticated: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<AuthenticatedResult>;
    waitForAuthentication: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<AuthenticatedResult>;
    getHeight: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetHeightResult>;
    getHeaderForHeight: (args: GetHeaderArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetHeaderResult>;
    getNetwork: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetNetworkResult>;
    getVersion: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetVersionResult>;
}
```

See also: [AbortActionArgs](#interface-abortactionargs), [AbortActionResult](#interface-abortactionresult), [AcquireCertificateArgs](#interface-acquirecertificateargs), [AcquireCertificateResult](#interface-acquirecertificateresult), [AuthenticatedResult](#interface-authenticatedresult), [CreateActionArgs](#interface-createactionargs), [CreateActionResult](#interface-createactionresult), [DiscoverByAttributesArgs](#interface-discoverbyattributesargs), [DiscoverByIdentityKeyArgs](#interface-discoverbyidentitykeyargs), [DiscoverCertificatesResult](#interface-discovercertificatesresult), [GetHeaderArgs](#interface-getheaderargs), [GetHeaderResult](#interface-getheaderresult), [GetHeightResult](#interface-getheightresult), [GetNetworkResult](#interface-getnetworkresult), [GetVersionResult](#interface-getversionresult), [InternalizeActionArgs](#interface-internalizeactionargs), [InternalizeActionResult](#interface-internalizeactionresult), [ListActionsArgs](#interface-listactionsargs), [ListActionsResult](#interface-listactionsresult), [ListCertificatesArgs](#interface-listcertificatesargs), [ListCertificatesResult](#interface-listcertificatesresult), [ListOutputsArgs](#interface-listoutputsargs), [ListOutputsResult](#interface-listoutputsresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [ProveCertificateArgs](#interface-provecertificateargs), [ProveCertificateResult](#interface-provecertificateresult), [RelinquishCertificateArgs](#interface-relinquishcertificateargs), [RelinquishCertificateResult](#interface-relinquishcertificateresult), [RelinquishOutputArgs](#interface-relinquishoutputargs), [RelinquishOutputResult](#interface-relinquishoutputresult), [SignActionArgs](#interface-signactionargs), [SignActionResult](#interface-signactionresult), [WalletCryptoObject](#interface-walletcryptoobject), [abortAction](#function-abortaction), [createAction](#function-createaction), [discoverByAttributes](#function-discoverbyattributes), [discoverByIdentityKey](#function-discoverbyidentitykey), [getHeight](#function-getheight), [getNetwork](#function-getnetwork), [getVersion](#function-getversion), [isAuthenticated](#function-isauthenticated), [listActions](#function-listactions), [proveCertificate](#function-provecertificate), [signAction](#function-signaction), [waitForAuthentication](#function-waitforauthentication)

<details>

<summary>Interface Wallet Details</summary>

##### Property abortAction

Aborts a transaction that is in progress and has not yet been finalized or sent to the network.

```ts
abortAction: (args: AbortActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<AbortActionResult>
```
See also: [AbortActionArgs](#interface-abortactionargs), [AbortActionResult](#interface-abortactionresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property acquireCertificate

Acquires an identity certificate, whether by acquiring one from the certifier or by directly receiving it.

```ts
acquireCertificate: (args: AcquireCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<AcquireCertificateResult>
```
See also: [AcquireCertificateArgs](#interface-acquirecertificateargs), [AcquireCertificateResult](#interface-acquirecertificateresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property createAction

Creates a new Bitcoin transaction based on the provided inputs, outputs, labels, locks, and other options.

```ts
createAction: (args: CreateActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<CreateActionResult>
```
See also: [CreateActionArgs](#interface-createactionargs), [CreateActionResult](#interface-createactionresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property discoverByAttributes

Discovers identity certificates belonging to other users, where the documents contain specific attributes, issued by a trusted entity.

```ts
discoverByAttributes: (args: DiscoverByAttributesArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<DiscoverCertificatesResult>
```
See also: [DiscoverByAttributesArgs](#interface-discoverbyattributesargs), [DiscoverCertificatesResult](#interface-discovercertificatesresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property discoverByIdentityKey

Discovers identity certificates, issued to a given identity key by a trusted entity.

```ts
discoverByIdentityKey: (args: DiscoverByIdentityKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<DiscoverCertificatesResult>
```
See also: [DiscoverByIdentityKeyArgs](#interface-discoverbyidentitykeyargs), [DiscoverCertificatesResult](#interface-discovercertificatesresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property getHeaderForHeight

Retrieves the block header of a block at a specified height.

```ts
getHeaderForHeight: (args: GetHeaderArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetHeaderResult>
```
See also: [GetHeaderArgs](#interface-getheaderargs), [GetHeaderResult](#interface-getheaderresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property getHeight

Retrieves the current height of the blockchain.

```ts
getHeight: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetHeightResult>
```
See also: [GetHeightResult](#interface-getheightresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property getNetwork

Retrieves the Bitcoin network the client is using (mainnet or testnet).

```ts
getNetwork: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetNetworkResult>
```
See also: [GetNetworkResult](#interface-getnetworkresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property getVersion

Retrieves the current version string of the wallet.

```ts
getVersion: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetVersionResult>
```
See also: [GetVersionResult](#interface-getversionresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property internalizeAction

Submits a transaction to be internalized and optionally labeled, outputs paid to the wallet balance, inserted into baskets, and/or tagged.

```ts
internalizeAction: (args: InternalizeActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<InternalizeActionResult>
```
See also: [InternalizeActionArgs](#interface-internalizeactionargs), [InternalizeActionResult](#interface-internalizeactionresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property isAuthenticated

Checks the authentication status of the user.

```ts
isAuthenticated: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<AuthenticatedResult>
```
See also: [AuthenticatedResult](#interface-authenticatedresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property listActions

Lists all transactions matching the specified labels.

```ts
listActions: (args: ListActionsArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<ListActionsResult>
```
See also: [ListActionsArgs](#interface-listactionsargs), [ListActionsResult](#interface-listactionsresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property listCertificates

Lists identity certificates belonging to the user, filtered by certifier(s) and type(s).

```ts
listCertificates: (args: ListCertificatesArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<ListCertificatesResult>
```
See also: [ListCertificatesArgs](#interface-listcertificatesargs), [ListCertificatesResult](#interface-listcertificatesresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property listOutputs

Lists the spendable outputs kept within a specific basket, optionally tagged with specific labels.

```ts
listOutputs: (args: ListOutputsArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<ListOutputsResult>
```
See also: [ListOutputsArgs](#interface-listoutputsargs), [ListOutputsResult](#interface-listoutputsresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property proveCertificate

Proves select fields of an identity certificate, as specified, when requested by a verifier.

```ts
proveCertificate: (args: ProveCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<ProveCertificateResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [ProveCertificateArgs](#interface-provecertificateargs), [ProveCertificateResult](#interface-provecertificateresult)

##### Property relinquishCertificate

Relinquishes an identity certificate, removing it from the wallet regardless of whether the revocation outpoint has become spent.

```ts
relinquishCertificate: (args: RelinquishCertificateArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<RelinquishCertificateResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [RelinquishCertificateArgs](#interface-relinquishcertificateargs), [RelinquishCertificateResult](#interface-relinquishcertificateresult)

##### Property relinquishOutput

Relinquish an output out of a basket, removing it from tracking without spending it.

```ts
relinquishOutput: (args: RelinquishOutputArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<RelinquishOutputResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [RelinquishOutputArgs](#interface-relinquishoutputargs), [RelinquishOutputResult](#interface-relinquishoutputresult)

##### Property signAction

Signs a transaction previously created using `createAction`.

```ts
signAction: (args: SignActionArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<SignActionResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [SignActionArgs](#interface-signactionargs), [SignActionResult](#interface-signactionresult)

##### Property waitForAuthentication

Continuously waits until the user is authenticated, returning the result once confirmed.

```ts
waitForAuthentication: (args: {}, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<AuthenticatedResult>
```
See also: [AuthenticatedResult](#interface-authenticatedresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletAction

```ts
export interface WalletAction {
    txid: TXIDHexString;
    satoshis: SatoshiValue;
    status: ActionStatus;
    isOutgoing: boolean;
    description: DescriptionString5to50Bytes;
    labels?: LabelStringUnder300Bytes[];
    version: PositiveIntegerOrZero;
    lockTime: PositiveIntegerOrZero;
    inputs?: WalletActionInput[];
    outputs?: WalletActionOutput[];
}
```

See also: [ActionStatus](#type-actionstatus), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [LabelStringUnder300Bytes](#type-labelstringunder300bytes), [PositiveIntegerOrZero](#type-positiveintegerorzero), [SatoshiValue](#type-satoshivalue), [TXIDHexString](#type-txidhexstring), [WalletActionInput](#interface-walletactioninput), [WalletActionOutput](#interface-walletactionoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletActionInput

```ts
export interface WalletActionInput {
    sourceOutpoint: OutpointString;
    sourceSatoshis: SatoshiValue;
    sourceLockingScript?: HexString;
    unlockingScript?: HexString;
    inputDescription: DescriptionString5to50Bytes;
    sequenceNumber: PositiveIntegerOrZero;
}
```

See also: [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [HexString](#type-hexstring), [OutpointString](#type-outpointstring), [PositiveIntegerOrZero](#type-positiveintegerorzero), [SatoshiValue](#type-satoshivalue)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletActionOutput

```ts
export interface WalletActionOutput {
    satoshis: SatoshiValue;
    lockingScript?: HexString;
    spendable: boolean;
    customInstructions?: string;
    tags: OutputTagStringUnder300Bytes[];
    outputIndex: PositiveIntegerOrZero;
    outputDescription: DescriptionString5to50Bytes;
    basket: BasketStringUnder300Bytes;
}
```

See also: [BasketStringUnder300Bytes](#type-basketstringunder300bytes), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [HexString](#type-hexstring), [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes), [PositiveIntegerOrZero](#type-positiveintegerorzero), [SatoshiValue](#type-satoshivalue)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletCertificate

```ts
export interface WalletCertificate {
    type: Base64String;
    subject: PubKeyHex;
    serialNumber: Base64String;
    certifier: PubKeyHex;
    revocationOutpoint: OutpointString;
    signature: HexString;
    fields: Record<CertificateFieldNameUnder50Bytes, string>;
}
```

See also: [Base64String](#type-base64string), [CertificateFieldNameUnder50Bytes](#type-certificatefieldnameunder50bytes), [HexString](#type-hexstring), [OutpointString](#type-outpointstring), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletCryptoObject

The WalletCryptoObject interface defines a wallet cryptographic capabilities including:
key derivation, encryption, decryption, hmac creation and verification, signature generation and verification

Error Handling

Every method of the `Wallet` interface has a return value of the form `Promise<object>`.
When an error occurs, an exception object may be thrown which must conform to the `WalletErrorObject` interface.
Serialization layers can rely on the `isError` property being unique to error objects to
deserialize and rethrow `WalletErrorObject` conforming objects.

```ts
export interface WalletCryptoObject {
    getPublicKey: (args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetPublicKeyResult>;
    revealCounterpartyKeyLinkage: (args: RevealCounterpartyKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<RevealCounterpartyKeyLinkageResult>;
    revealSpecificKeyLinkage: (args: RevealSpecificKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<RevealSpecificKeyLinkageResult>;
    encrypt: (args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<WalletEncryptResult>;
    decrypt: (args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<WalletDecryptResult>;
    createHmac: (args: CreateHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<CreateHmacResult>;
    verifyHmac: (args: VerifyHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<VerifyHmacResult>;
    createSignature: (args: CreateSignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<CreateSignatureResult>;
    verifySignature: (args: VerifySignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<VerifySignatureResult>;
}
```

See also: [CreateHmacArgs](#interface-createhmacargs), [CreateHmacResult](#interface-createhmacresult), [CreateSignatureArgs](#interface-createsignatureargs), [CreateSignatureResult](#interface-createsignatureresult), [GetPublicKeyArgs](#interface-getpublickeyargs), [GetPublicKeyResult](#interface-getpublickeyresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [RevealCounterpartyKeyLinkageArgs](#interface-revealcounterpartykeylinkageargs), [RevealCounterpartyKeyLinkageResult](#interface-revealcounterpartykeylinkageresult), [RevealSpecificKeyLinkageArgs](#interface-revealspecifickeylinkageargs), [RevealSpecificKeyLinkageResult](#interface-revealspecifickeylinkageresult), [VerifyHmacArgs](#interface-verifyhmacargs), [VerifyHmacResult](#interface-verifyhmacresult), [VerifySignatureArgs](#interface-verifysignatureargs), [VerifySignatureResult](#interface-verifysignatureresult), [WalletDecryptArgs](#interface-walletdecryptargs), [WalletDecryptResult](#interface-walletdecryptresult), [WalletEncryptArgs](#interface-walletencryptargs), [WalletEncryptResult](#interface-walletencryptresult), [createHmac](#function-createhmac), [createSignature](#function-createsignature), [decrypt](#function-decrypt), [encrypt](#function-encrypt), [getPublicKey](#function-getpublickey), [verifyHmac](#function-verifyhmac), [verifySignature](#function-verifysignature)

<details>

<summary>Interface WalletCryptoObject Details</summary>

##### Property createHmac

Creates an HMAC (Hash-based Message Authentication Code) based on the provided data, protocol, key ID, counterparty, and other factors.

```ts
createHmac: (args: CreateHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<CreateHmacResult>
```
See also: [CreateHmacArgs](#interface-createhmacargs), [CreateHmacResult](#interface-createhmacresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property createSignature

Creates a digital signature for the provided data or hash using a specific protocol, key, and optionally considering privilege and counterparty.

```ts
createSignature: (args: CreateSignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<CreateSignatureResult>
```
See also: [CreateSignatureArgs](#interface-createsignatureargs), [CreateSignatureResult](#interface-createsignatureresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property decrypt

Decrypts the provided ciphertext using derived keys, based on the protocol ID, key ID, counterparty, and other factors.

```ts
decrypt: (args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<WalletDecryptResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [WalletDecryptArgs](#interface-walletdecryptargs), [WalletDecryptResult](#interface-walletdecryptresult)

##### Property encrypt

Encrypts the provided plaintext data using derived keys, based on the protocol ID, key ID, counterparty, and other factors.

```ts
encrypt: (args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<WalletEncryptResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [WalletEncryptArgs](#interface-walletencryptargs), [WalletEncryptResult](#interface-walletencryptresult)

##### Property getPublicKey

Retrieves a derived or identity public key based on the requested protocol, key ID, counterparty, and other factors.

```ts
getPublicKey: (args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<GetPublicKeyResult>
```
See also: [GetPublicKeyArgs](#interface-getpublickeyargs), [GetPublicKeyResult](#interface-getpublickeyresult), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes)

##### Property revealCounterpartyKeyLinkage

Reveals the key linkage between ourselves and a counterparty, to a particular verifier, across all interactions with the counterparty.

```ts
revealCounterpartyKeyLinkage: (args: RevealCounterpartyKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<RevealCounterpartyKeyLinkageResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [RevealCounterpartyKeyLinkageArgs](#interface-revealcounterpartykeylinkageargs), [RevealCounterpartyKeyLinkageResult](#interface-revealcounterpartykeylinkageresult)

##### Property revealSpecificKeyLinkage

Reveals the key linkage between ourselves and a counterparty, to a particular verifier, with respect to a specific interaction.

```ts
revealSpecificKeyLinkage: (args: RevealSpecificKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<RevealSpecificKeyLinkageResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [RevealSpecificKeyLinkageArgs](#interface-revealspecifickeylinkageargs), [RevealSpecificKeyLinkageResult](#interface-revealspecifickeylinkageresult)

##### Property verifyHmac

Verifies an HMAC (Hash-based Message Authentication Code) based on the provided data, protocol, key ID, counterparty, and other factors.

```ts
verifyHmac: (args: VerifyHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<VerifyHmacResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [VerifyHmacArgs](#interface-verifyhmacargs), [VerifyHmacResult](#interface-verifyhmacresult)

##### Property verifySignature

Verifies a digital signature for the provided data or hash using a specific protocol, key, and optionally considering privilege and counterparty.

```ts
verifySignature: (args: VerifySignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes) => Promise<VerifySignatureResult>
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [VerifySignatureArgs](#interface-verifysignatureargs), [VerifySignatureResult](#interface-verifysignatureresult)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletDecryptArgs

```ts
export interface WalletDecryptArgs extends WalletEncryptionArgs {
    ciphertext: Byte[];
}
```

See also: [Byte](#type-byte), [WalletEncryptionArgs](#interface-walletencryptionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletDecryptResult

```ts
export interface WalletDecryptResult {
    plaintext: Byte[];
}
```

See also: [Byte](#type-byte)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletEncryptArgs

```ts
export interface WalletEncryptArgs extends WalletEncryptionArgs {
    plaintext: Byte[];
}
```

See also: [Byte](#type-byte), [WalletEncryptionArgs](#interface-walletencryptionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletEncryptResult

```ts
export interface WalletEncryptResult {
    ciphertext: Byte[];
}
```

See also: [Byte](#type-byte)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletEncryptionArgs

```ts
export interface WalletEncryptionArgs {
    protocolID: WalletProtocol;
    keyID: KeyIDStringUnder800Bytes;
    counterparty?: WalletCounterparty;
    privileged?: BooleanDefaultFalse;
    privilegedReason?: DescriptionString5to50Bytes;
    seekPermission?: BooleanDefaultTrue;
}
```

See also: [BooleanDefaultFalse](#type-booleandefaultfalse), [BooleanDefaultTrue](#type-booleandefaulttrue), [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes), [KeyIDStringUnder800Bytes](#type-keyidstringunder800bytes), [WalletCounterparty](#type-walletcounterparty), [WalletProtocol](#type-walletprotocol)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletErrorObject

Every method of the `Wallet` interface has a return value of the form `Promise<object>`.
When errors occur, an exception object may be thrown which must conform to the `WalletErrorObject` interface.
Serialization layers can rely on the `isError` property being unique to error objects.
Deserialization should rethrow `WalletErrorObject` conforming objects.

```ts
export interface WalletErrorObject extends Error {
    isError: true;
}
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletOutput

```ts
export interface WalletOutput {
    satoshis: SatoshiValue;
    lockingScript?: HexString;
    spendable: boolean;
    customInstructions?: string;
    tags?: OutputTagStringUnder300Bytes[];
    outpoint: OutpointString;
    labels?: LabelStringUnder300Bytes[];
}
```

See also: [HexString](#type-hexstring), [LabelStringUnder300Bytes](#type-labelstringunder300bytes), [OutpointString](#type-outpointstring), [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes), [SatoshiValue](#type-satoshivalue)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Interface: WalletPayment

```ts
export interface WalletPayment {
    derivationPrefix: Base64String;
    derivationSuffix: Base64String;
    senderIdentityKey: PubKeyHex;
}
```

See also: [Base64String](#type-base64string), [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Classes

| | |
| --- | --- |
| [CachedKeyDeriver](#class-cachedkeyderiver) | [WERR_INVALID_PUBLIC_KEY](#class-werr_invalid_public_key) |
| [Communicator](#class-communicator) | [WERR_MISSING_PARAMETER](#class-werr_missing_parameter) |
| [KeyDeriver](#class-keyderiver) | [WERR_NETWORK_CHAIN](#class-werr_network_chain) |
| [WERR_BAD_REQUEST](#class-werr_bad_request) | [WERR_NOT_IMPLEMENTED](#class-werr_not_implemented) |
| [WERR_INSUFFICIENT_FUNDS](#class-werr_insufficient_funds) | [WERR_UNAUTHORIZED](#class-werr_unauthorized) |
| [WERR_INTERNAL](#class-werr_internal) | [WalletCrypto](#class-walletcrypto) |
| [WERR_INVALID_PARAMETER](#class-werr_invalid_parameter) | [WalletError](#class-walleterror) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

#### Class: CachedKeyDeriver

A cached version of KeyDeriver that caches the results of key derivation methods.
This is useful for optimizing performance when the same keys are derived multiple times.
It supports configurable cache size with sane defaults and maintains cache entries using LRU (Least Recently Used) eviction policy.

```ts
export default class CachedKeyDeriver {
    constructor(rootKey: PrivateKey | "anyone", options?: {
        maxCacheSize?: number;
    }) 
    derivePublicKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty, forSelf: boolean = false): PublicKey 
    derivePrivateKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): PrivateKey 
    deriveSymmetricKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): SymmetricKey 
    revealCounterpartySecret(counterparty: Counterparty): number[] 
    revealSpecificSecret(counterparty: Counterparty, protocolID: WalletProtocol, keyID: string): number[] 
}
```

See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

<details>

<summary>Class CachedKeyDeriver Details</summary>

##### Constructor

Initializes the CachedKeyDeriver instance with a root private key and optional cache settings.

```ts
constructor(rootKey: PrivateKey | "anyone", options?: {
    maxCacheSize?: number;
}) 
```

Argument Details

+ **rootKey**
  + The root private key or the string 'anyone'.
+ **options**
  + Optional settings for the cache.

##### Method derivePrivateKey

Derives a private key based on protocol ID, key ID, and counterparty.
Caches the result for future calls with the same parameters.

```ts
derivePrivateKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): PrivateKey 
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived private key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

##### Method derivePublicKey

Derives a public key based on protocol ID, key ID, and counterparty.
Caches the result for future calls with the same parameters.

```ts
derivePublicKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty, forSelf: boolean = false): PublicKey 
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived public key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').
+ **forSelf**
  + Whether deriving for self.

##### Method deriveSymmetricKey

Derives a symmetric key based on protocol ID, key ID, and counterparty.
Caches the result for future calls with the same parameters.

```ts
deriveSymmetricKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): SymmetricKey 
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived symmetric key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

Throws

- Throws an error if attempting to derive a symmetric key for 'anyone'.

##### Method revealCounterpartySecret

Reveals the shared secret between the root key and the counterparty.
Caches the result for future calls with the same parameters.

```ts
revealCounterpartySecret(counterparty: Counterparty): number[] 
```
See also: [Counterparty](#type-counterparty)

Returns

- The shared secret as a number array.

Argument Details

+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

Throws

- Throws an error if attempting to reveal a shared secret for 'self'.

##### Method revealSpecificSecret

Reveals the specific key association for a given protocol ID, key ID, and counterparty.
Caches the result for future calls with the same parameters.

```ts
revealSpecificSecret(counterparty: Counterparty, protocolID: WalletProtocol, keyID: string): number[] 
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The specific key association as a number array.

Argument Details

+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').
+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
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
#### Class: KeyDeriver

Class responsible for deriving various types of keys using a root private key.
It supports deriving public and private keys, symmetric keys, and revealing key linkages.

```ts
export class KeyDeriver implements KeyDeriverApi {
    rootKey: PrivateKey;
    identityKey: string;
    constructor(rootKey: PrivateKey | "anyone") 
    derivePublicKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty, forSelf: boolean = false): PublicKey 
    derivePrivateKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): PrivateKey 
    deriveSymmetricKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): SymmetricKey 
    revealCounterpartySecret(counterparty: Counterparty): number[] 
    revealSpecificSecret(counterparty: Counterparty, protocolID: WalletProtocol, keyID: string): number[] 
}
```

See also: [Counterparty](#type-counterparty), [KeyDeriverApi](#interface-keyderiverapi), [WalletProtocol](#type-walletprotocol)

<details>

<summary>Class KeyDeriver Details</summary>

##### Constructor

Initializes the KeyDeriver instance with a root private key.

```ts
constructor(rootKey: PrivateKey | "anyone") 
```

Argument Details

+ **rootKey**
  + The root private key or the string 'anyone'.

##### Method derivePrivateKey

Derives a private key based on protocol ID, key ID, and counterparty.

```ts
derivePrivateKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): PrivateKey 
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived private key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

##### Method derivePublicKey

Derives a public key based on protocol ID, key ID, and counterparty.

```ts
derivePublicKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty, forSelf: boolean = false): PublicKey 
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived public key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').
+ **forSelf**
  + Whether deriving for self.

##### Method deriveSymmetricKey

Derives a symmetric key based on protocol ID, key ID, and counterparty.
Note: Symmetric keys should not be derivable by everyone due to security risks.

```ts
deriveSymmetricKey(protocolID: WalletProtocol, keyID: string, counterparty: Counterparty): SymmetricKey 
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The derived symmetric key.

Argument Details

+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.
+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

Throws

- Throws an error if attempting to derive a symmetric key for 'anyone'.

##### Method revealCounterpartySecret

Reveals the shared secret between the root key and the counterparty.
Note: This should not be used for 'self'.

```ts
revealCounterpartySecret(counterparty: Counterparty): number[] 
```
See also: [Counterparty](#type-counterparty)

Returns

- The shared secret as a number array.

Argument Details

+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').

Throws

- Throws an error if attempting to reveal a shared secret for 'self'.

##### Method revealSpecificSecret

Reveals the specific key association for a given protocol ID, key ID, and counterparty.

```ts
revealSpecificSecret(counterparty: Counterparty, protocolID: WalletProtocol, keyID: string): number[] 
```
See also: [Counterparty](#type-counterparty), [WalletProtocol](#type-walletprotocol)

Returns

- The specific key association as a number array.

Argument Details

+ **counterparty**
  + The counterparty's public key or a predefined value ('self' or 'anyone').
+ **protocolID**
  + The protocol ID including a security level and protocol name.
+ **keyID**
  + The key identifier.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_BAD_REQUEST

The request is invalid.

```ts
export class WERR_BAD_REQUEST extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_INSUFFICIENT_FUNDS

Insufficient funds in the available inputs to cover the cost of the required outputs
and the transaction fee (${moreSatoshisNeeded} more satoshis are needed,
for a total of ${totalSatoshisNeeded}), plus whatever would be required in order
to pay the fee to unlock and spend the outputs used to provide the additional satoshis.

```ts
export class WERR_INSUFFICIENT_FUNDS extends WalletError {
    constructor(public totalSatoshisNeeded: number, public moreSatoshisNeeded: number) 
}
```

See also: [WalletError](#class-walleterror)

<details>

<summary>Class WERR_INSUFFICIENT_FUNDS Details</summary>

##### Constructor

```ts
constructor(public totalSatoshisNeeded: number, public moreSatoshisNeeded: number) 
```

Argument Details

+ **totalSatoshisNeeded**
  + Total satoshis required to fund transactions after net of required inputs and outputs.
+ **moreSatoshisNeeded**
  + Shortfall on total satoshis required to fund transactions after net of required inputs and outputs.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_INTERNAL

An internal error has occurred.

This is an example of an error with an optional custom `message`.

```ts
export class WERR_INTERNAL extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_INVALID_PARAMETER

The ${parameter} parameter is invalid.

This is an example of an error object with a custom property `parameter` and templated `message`.

```ts
export class WERR_INVALID_PARAMETER extends WalletError {
    constructor(public parameter: string, mustBe?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_INVALID_PUBLIC_KEY

```ts
export class WERR_INVALID_PUBLIC_KEY extends WalletError {
    constructor(public key: string, network: WalletNetwork = "mainnet") 
}
```

See also: [WalletError](#class-walleterror), [WalletNetwork](#type-walletnetwork)

<details>

<summary>Class WERR_INVALID_PUBLIC_KEY Details</summary>

##### Constructor

```ts
constructor(public key: string, network: WalletNetwork = "mainnet") 
```
See also: [WalletNetwork](#type-walletnetwork)

Argument Details

+ **key**
  + The invalid public key that caused the error.
+ **environment**
  + Optional environment flag to control whether the key is included in the message.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_MISSING_PARAMETER

The required ${parameter} parameter is missing.

This is an example of an error object with a custom property `parameter`

```ts
export class WERR_MISSING_PARAMETER extends WalletError {
    constructor(public parameter: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_NETWORK_CHAIN

Configured network chain is invalid or does not match across services.

```ts
export class WERR_NETWORK_CHAIN extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_NOT_IMPLEMENTED

Not implemented.

```ts
export class WERR_NOT_IMPLEMENTED extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WERR_UNAUTHORIZED

Access is denied due to an authorization error.

```ts
export class WERR_UNAUTHORIZED extends WalletError {
    constructor(message?: string) 
}
```

See also: [WalletError](#class-walleterror)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WalletCrypto

WalletCrypto implements single-keyring wallet cryptography functions,
operating without context about whether its configured keyring is privileged.

```ts
export class WalletCrypto implements WalletCryptoObject {
    keyDeriver: KeyDeriverApi;
    constructor(keyDeriver: KeyDeriverApi) 
    async getIdentityKey(originator?: OriginatorDomainNameStringUnder250Bytes): Promise<{
        publicKey: PubKeyHex;
    }> 
    async getPublicKey(args: GetPublicKeyArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<{
        publicKey: PubKeyHex;
    }> 
    async revealCounterpartyKeyLinkage(args: RevealCounterpartyKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealCounterpartyKeyLinkageResult> 
    async revealSpecificKeyLinkage(args: RevealSpecificKeyLinkageArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<RevealSpecificKeyLinkageResult> 
    async encrypt(args: WalletEncryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletEncryptResult> 
    async decrypt(args: WalletDecryptArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<WalletDecryptResult> 
    async createHmac(args: CreateHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateHmacResult> 
    async verifyHmac(args: VerifyHmacArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifyHmacResult> 
    async createSignature(args: CreateSignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<CreateSignatureResult> 
    async verifySignature(args: VerifySignatureArgs, originator?: OriginatorDomainNameStringUnder250Bytes): Promise<VerifySignatureResult> 
}
```

See also: [CreateHmacArgs](#interface-createhmacargs), [CreateHmacResult](#interface-createhmacresult), [CreateSignatureArgs](#interface-createsignatureargs), [CreateSignatureResult](#interface-createsignatureresult), [GetPublicKeyArgs](#interface-getpublickeyargs), [KeyDeriverApi](#interface-keyderiverapi), [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [PubKeyHex](#type-pubkeyhex), [RevealCounterpartyKeyLinkageArgs](#interface-revealcounterpartykeylinkageargs), [RevealCounterpartyKeyLinkageResult](#interface-revealcounterpartykeylinkageresult), [RevealSpecificKeyLinkageArgs](#interface-revealspecifickeylinkageargs), [RevealSpecificKeyLinkageResult](#interface-revealspecifickeylinkageresult), [VerifyHmacArgs](#interface-verifyhmacargs), [VerifyHmacResult](#interface-verifyhmacresult), [VerifySignatureArgs](#interface-verifysignatureargs), [VerifySignatureResult](#interface-verifysignatureresult), [WalletCryptoObject](#interface-walletcryptoobject), [WalletDecryptArgs](#interface-walletdecryptargs), [WalletDecryptResult](#interface-walletdecryptresult), [WalletEncryptArgs](#interface-walletencryptargs), [WalletEncryptResult](#interface-walletencryptresult), [createHmac](#function-createhmac), [createSignature](#function-createsignature), [decrypt](#function-decrypt), [encrypt](#function-encrypt), [getPublicKey](#function-getpublickey), [verifyHmac](#function-verifyhmac), [verifySignature](#function-verifysignature)

<details>

<summary>Class WalletCrypto Details</summary>

##### Method getIdentityKey

Convenience method to obtain the identityKey.

```ts
async getIdentityKey(originator?: OriginatorDomainNameStringUnder250Bytes): Promise<{
    publicKey: PubKeyHex;
}> 
```
See also: [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes), [PubKeyHex](#type-pubkeyhex)

Returns

`await this.getPublicKey({ identityKey: true }, originator)`

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Class: WalletError

Derived class constructors should use the derived class name as the value for `name`,
and an internationalizable constant string for `message`.

If a derived class intends to wrap another WalletError, the public property should
be named `walletError` and will be recovered by `fromUnknown`.

Optionaly, the derived class `message` can include template parameters passed in
to the constructor. See WERR_MISSING_PARAMETER for an example.

To avoid derived class name colisions, packages should include a package specific
identifier after the 'WERR_' prefix. e.g. 'WERR_FOO_' as the prefix for Foo package error
classes.

```ts
export class WalletError extends Error implements WalletErrorObject {
    isError: true = true;
    constructor(name: string, message: string, stack?: string, public details?: Record<string, string>) 
    get code(): sdk.ErrorCodeString10To40Bytes 
    set code(v: sdk.ErrorCodeString10To40Bytes) 
    get description(): sdk.ErrorDescriptionString20To200Bytes 
    set description(v: sdk.ErrorDescriptionString20To200Bytes) 
    static fromUnknown(err: unknown): WalletError 
    asStatus(): {
        status: string;
        code: string;
        description: string;
    } 
}
```

See also: [ErrorCodeString10To40Bytes](#type-errorcodestring10to40bytes), [ErrorDescriptionString20To200Bytes](#type-errordescriptionstring20to200bytes), [WalletErrorObject](#interface-walleterrorobject)

<details>

<summary>Class WalletError Details</summary>

##### Method asStatus

```ts
asStatus(): {
    status: string;
    code: string;
    description: string;
} 
```

Returns

standard HTTP error status object with status property set to 'error'.

##### Method fromUnknown

Recovers all public fields from WalletError derived error classes and relevant Error derived errors.

Critical client data fields are preserved across HTTP DojoExpress / DojoExpressClient encoding.

```ts
static fromUnknown(err: unknown): WalletError 
```
See also: [WalletError](#class-walleterror)

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Functions

| | | |
| --- | --- | --- |
| [abortAction](#function-abortaction) | [getInfo](#function-getinfo) | [validateAcquireCertificateArgs](#function-validateacquirecertificateargs) |
| [asArray](#function-asarray) | [getMerkleRootForHeight](#function-getmerklerootforheight) | [validateBasketInsertion](#function-validatebasketinsertion) |
| [asBsvSdkScript](#function-asbsvsdkscript) | [getNetwork](#function-getnetwork) | [validateCreateActionArgs](#function-validatecreateactionargs) |
| [asBsvSdkTx](#function-asbsvsdktx) | [getPreferredCurrency](#function-getpreferredcurrency) | [validateCreateActionInput](#function-validatecreateactioninput) |
| [asBuffer](#function-asbuffer) | [getPublicKey](#function-getpublickey) | [validateCreateActionOptions](#function-validatecreateactionoptions) |
| [asString](#function-asstring) | [getRandomID](#function-getrandomid) | [validateCreateActionOptions](#function-validatecreateactionoptions) |
| [buildTransactionForSignActionUnlocking](#function-buildtransactionforsignactionunlocking) | [getTransactionOutputs](#function-gettransactionoutputs) | [validateCreateActionOutput](#function-validatecreateactionoutput) |
| [connectToSubstrate](#function-connecttosubstrate) | [getVersion](#function-getversion) | [validateInteger](#function-validateinteger) |
| [convertMerklePathToProof](#function-convertmerklepathtoproof) | [isAuthenticated](#function-isauthenticated) | [validateInternalizeActionArgs](#function-validateinternalizeactionargs) |
| [convertProofToMerklePath](#function-convertprooftomerklepath) | [listActions](#function-listactions) | [validateInternalizeOutput](#function-validateinternalizeoutput) |
| [convertProofToMerklePathWithLookup](#function-convertprooftomerklepathwithlookup) | [makeHttpRequest](#function-makehttprequest) | [validateListActionsArgs](#function-validatelistactionsargs) |
| [createAction](#function-createaction) | [parseWalletOutpoint](#function-parsewalletoutpoint) | [validateListCertificatesArgs](#function-validatelistcertificatesargs) |
| [createCertificate](#function-createcertificate) | [promiseWithTimeout](#function-promisewithtimeout) | [validateListOutputsArgs](#function-validatelistoutputsargs) |
| [createHmac](#function-createhmac) | [proveCertificate](#function-provecertificate) | [validateOptionalEnvelopeEvidence](#function-validateoptionalenvelopeevidence) |
| [createSignature](#function-createsignature) | [requestGroupPermission](#function-requestgrouppermission) | [validateOptionalInteger](#function-validateoptionalinteger) |
| [decrypt](#function-decrypt) | [resolveOptionalEnvelopeEvidence](#function-resolveoptionalenvelopeevidence) | [validateOptionalOutpointString](#function-validateoptionaloutpointstring) |
| [decryptAsArray](#function-decryptasarray) | [revealKeyLinkage](#function-revealkeylinkage) | [validateOutpointString](#function-validateoutpointstring) |
| [decryptAsString](#function-decryptasstring) | [revealKeyLinkageCounterparty](#function-revealkeylinkagecounterparty) | [validatePositiveIntegerOrZero](#function-validatepositiveintegerorzero) |
| [discoverByAttributes](#function-discoverbyattributes) | [revealKeyLinkageSpecific](#function-revealkeylinkagespecific) | [validateRelinquishOutputArgs](#function-validaterelinquishoutputargs) |
| [discoverByIdentityKey](#function-discoverbyidentitykey) | [sha256Hash](#function-sha256hash) | [validateSatoshis](#function-validatesatoshis) |
| [doubleSha256BE](#function-doublesha256be) | [signAction](#function-signaction) | [validateSignActionArgs](#function-validatesignactionargs) |
| [doubleSha256HashLE](#function-doublesha256hashle) | [stampLog](#function-stamplog) | [validateSignActionOptions](#function-validatesignactionoptions) |
| [encrypt](#function-encrypt) | [stampLogFormat](#function-stamplogformat) | [validateStringLength](#function-validatestringlength) |
| [encryptAsArray](#function-encryptasarray) | [submitDirectTransaction](#function-submitdirecttransaction) | [validateWalletPayment](#function-validatewalletpayment) |
| [encryptAsString](#function-encryptasstring) | [toBEEFfromEnvelope](#function-tobeeffromenvelope) | [verifyHmac](#function-verifyhmac) |
| [getCertificates](#function-getcertificates) | [toEnvelopeFromBEEF](#function-toenvelopefrombeef) | [verifySignature](#function-verifysignature) |
| [getEnvelopeForTransaction](#function-getenvelopefortransaction) | [unbasketOutput](#function-unbasketoutput) | [verifyTruthy](#function-verifytruthy) |
| [getHeight](#function-getheight) | [validateAbortActionArgs](#function-validateabortactionargs) | [waitForAuthentication](#function-waitforauthentication) |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

#### Function: abortAction

Aborts a previously created action which required custom input unlocking script signing.

```ts
export async function abortAction(args: {
    referenceNumber: string;
    log?: string;
}): Promise<AbortActionResult> 
```

See also: [AbortActionResult](#interface-abortactionresult)

<details>

<summary>Function abortAction Details</summary>

Returns

An Action object containing "txid", "rawTx" "mapiResponses" and "inputs".

Argument Details

+ **args**
  + All parameters for this function are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: asArray

```ts
export function asArray(val: Buffer | string | number[], encoding?: BufferEncoding): number[] 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: asBsvSdkScript

```ts
export function asBsvSdkScript(script: string | Buffer | Script): Script 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: asBsvSdkTx

```ts
export function asBsvSdkTx(tx: string | Buffer | Transaction): Transaction 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: asBuffer

```ts
export function asBuffer(val: Buffer | string | number[], encoding?: BufferEncoding): Buffer 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: asString

```ts
export function asString(val: Buffer | string, encoding?: BufferEncoding): string 
```

<details>

<summary>Function asString Details</summary>

Argument Details

+ **val**
  + Value to convert to encoded string if not already a string.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: buildTransactionForSignActionUnlocking

Constructs a

```ts
export async function buildTransactionForSignActionUnlocking(ninjaInputs: Record<string, CreateActionInput>, createResult: DojoCreateTransactionResultApi): Promise<Transaction> 
```

See also: [CreateActionInput](#interface-createactioninput), [DojoCreateTransactionResultApi](#interface-dojocreatetransactionresultapi)

<details>

<summary>Function buildTransactionForSignActionUnlocking Details</summary>

Argument Details

+ **ninjaInputs**
  + Ninja inputs as passed to createAction
+ **createResult**
  + Create transaction results returned by createAction when signActionRequires is true.
+ **changeKeys**
  + Dummy keys can be used to create a transaction with which to generate Ninja input lockingScripts.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: connectToSubstrate

```ts
export default async function connectToSubstrate(): Promise<Communicator> 
```

See also: [Communicator](#class-communicator)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: convertMerklePathToProof

Convert a MerklePath to a single BRC-10 proof

```ts
export function convertMerklePathToProof(txid: string, mp: MerklePath): TscMerkleProofApi 
```

See also: [TscMerkleProofApi](#interface-tscmerkleproofapi)

<details>

<summary>Function convertMerklePathToProof Details</summary>

Returns

transaction proof in BRC-10 string format.

Argument Details

+ **txid**
  + the txid in `mp` for which a BRC-10 proof is needed
+ **mp**
  + MerklePath

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: convertProofToMerklePath

Convert a single BRC-10 proof to a MerklePath

```ts
export function convertProofToMerklePath(txid: string, proof: TscMerkleProofApi): MerklePath 
```

See also: [TscMerkleProofApi](#interface-tscmerkleproofapi)

<details>

<summary>Function convertProofToMerklePath Details</summary>

Returns

corresponding MerklePath

Argument Details

+ **txid**
  + transaction hash as big endian hex string
+ **proof**
  + transaction proof in BRC-10 string format.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: convertProofToMerklePathWithLookup

```ts
export async function convertProofToMerklePathWithLookup(txid: string, proof: TscMerkleProofApi, lookupHeight: (targetType: "hash" | "header" | "merkleRoot" | "height", target: string | Buffer) => Promise<number>): Promise<MerklePath> 
```

See also: [TscMerkleProofApi](#interface-tscmerkleproofapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: createAction

Creates and broadcasts a BitCoin transaction with the provided inputs and outputs.

```ts
export async function createAction(args: CreateActionParams): Promise<CreateActionResult> 
```

See also: [CreateActionParams](#interface-createactionparams), [CreateActionResult](#interface-createactionresult)

<details>

<summary>Function createAction Details</summary>

Returns

An Action object containing "txid", "rawTx" "mapiResponses" and "inputs".

Argument Details

+ **args**
  + All parameters for this function are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: createCertificate

Creates a signed certificate

```ts
export async function createCertificate(args: {
    certificateType: string;
    fieldObject: Record<string, string>;
    certifierUrl: string;
    certifierPublicKey: string;
}): Promise<CreateCertificateResult> 
```

See also: [CreateCertificateResult](#interface-createcertificateresult)

<details>

<summary>Function createCertificate Details</summary>

Returns

A signed certificate

Argument Details

+ **args**
  + All parameters for this function are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: createHmac

Creates a SHA-256 HMAC with a key belonging to the user.

```ts
export async function createHmac(args: {
    data: Uint8Array | string;
    protocolID: ProtocolID;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
}): Promise<Uint8Array> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function createHmac Details</summary>

Returns

The SHA-256 HMAC of the data.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: createSignature

Creates a digital signature with a key belonging to the user. The SHA-256 hash of the data is used with ECDSA.

To allow other users to externally verify the signature, use getPublicKey with the same protocolID, keyID and privileged parameters. The signature should be valid under that public key.

```ts
export async function createSignature(args: {
    data: Uint8Array | string;
    protocolID: ProtocolID;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
}): Promise<Uint8Array> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function createSignature Details</summary>

Returns

The ECDSA message signature.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: decrypt

Decrypts data with a key belonging to the user.
The same protocolID, keyID, counterparty and privileged parameters that were used during encryption
must be used to successfully decrypt.

```ts
export async function decrypt(args: {
    ciphertext: string | Uint8Array;
    protocolID: ProtocolID;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
    returnType?: "Uint8Array" | "string";
}): Promise<string | Uint8Array> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function decrypt Details</summary>

Returns

The decrypted plaintext.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: decryptAsArray

Decrypts data with a key belonging to the user.
The same protocolID, keyID, counterparty and privileged parameters that were used during encryption
must be used to successfully decrypt.

```ts
export async function decryptAsArray(args: {
    ciphertext: string | Uint8Array;
    protocolID: ProtocolID;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
}): Promise<Uint8Array> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function decryptAsArray Details</summary>

Returns

The decrypted plaintext.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: decryptAsString

Decrypts data with a key belonging to the user.
The same protocolID, keyID, counterparty and privileged parameters that were used during encryption
must be used to successfully decrypt.

```ts
export async function decryptAsString(args: {
    ciphertext: string | Uint8Array;
    protocolID: ProtocolID;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
}): Promise<string> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function decryptAsString Details</summary>

Returns

The decrypted plaintext TextDecoder decoded to string.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: discoverByAttributes

Resolves identity information by attributes from the user's trusted certifiers.

```ts
export async function discoverByAttributes(args: {
    attributes: Record<string, string>;
    description: string;
}): Promise<object[]> 
```

<details>

<summary>Function discoverByAttributes Details</summary>

Argument Details

+ **obj**
  + All parameters are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: discoverByIdentityKey

Resolves identity information by identity key from the user's trusted certifiers.

```ts
export async function discoverByIdentityKey(args: {
    identityKey: string;
    description: string;
}): Promise<object[]> 
```

<details>

<summary>Function discoverByIdentityKey Details</summary>

Argument Details

+ **obj**
  + All parameters are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: doubleSha256BE

Calculate the SHA256 hash of the SHA256 hash of a Buffer.

```ts
export function doubleSha256BE(data: string | Buffer, encoding?: BufferEncoding): Buffer {
    return doubleSha256HashLE(data, encoding).reverse();
}
```

See also: [doubleSha256HashLE](#function-doublesha256hashle)

<details>

<summary>Function doubleSha256BE Details</summary>

Returns

reversed (big-endian) double sha256 hash of data, byte 31 of hash first.

Argument Details

+ **data**
  + is Buffer or hex encoded string

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: doubleSha256HashLE

Calculate the SHA256 hash of the SHA256 hash of a Buffer.

```ts
export function doubleSha256HashLE(data: string | Buffer, encoding?: BufferEncoding): Buffer {
    const msg = asArray(data, encoding);
    const first = new Hash.SHA256().update(msg).digest();
    const second = new Hash.SHA256().update(first).digest();
    return asBuffer(second);
}
```

See also: [asArray](#function-asarray), [asBuffer](#function-asbuffer)

<details>

<summary>Function doubleSha256HashLE Details</summary>

Returns

double sha256 hash of buffer contents, byte 0 of hash first.

Argument Details

+ **data**
  + is Buffer or hex encoded string

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: encrypt

Encrypts data with a key belonging to the user.
If a counterparty is provided, also allows the counterparty to decrypt the data.
The same protocolID, keyID, counterparty and privileged parameters must be used when decrypting.

```ts
export async function encrypt(args: {
    plaintext: string | Uint8Array;
    protocolID: ProtocolID;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
    returnType?: "Uint8Array" | "string";
}): Promise<string | Uint8Array> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function encrypt Details</summary>

Returns

The encrypted ciphertext.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: encryptAsArray

Encrypts data with a key belonging to the user.
If a counterparty is provided, also allows the counterparty to decrypt the data.
The same protocolID, keyID, counterparty and privileged parameters must be used when decrypting.

```ts
export async function encryptAsArray(args: {
    plaintext: string | Uint8Array;
    protocolID: string;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
}): Promise<Uint8Array> 
```

<details>

<summary>Function encryptAsArray Details</summary>

Returns

The encrypted ciphertext data.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: encryptAsString

Encrypts data with a key belonging to the user.
If a counterparty is provided, also allows the counterparty to decrypt the data.
The same protocolID, keyID, counterparty and privileged parameters must be used when decrypting.

```ts
export async function encryptAsString(args: {
    plaintext: string | Uint8Array;
    protocolID: string;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
}): Promise<string> 
```

<details>

<summary>Function encryptAsString Details</summary>

Returns

The encrypted ciphertext data as base64 encoded string.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getCertificates

Returns found certificates

```ts
export async function getCertificates(args: {
    certifiers: string[];
    types: Record<string, string[]>;
}): Promise<CreateCertificateResult[]> 
```

See also: [CreateCertificateResult](#interface-createcertificateresult)

<details>

<summary>Function getCertificates Details</summary>

Returns

An object containing the found certificates

Argument Details

+ **obj**
  + All parameters for this function are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getEnvelopeForTransaction

Returns an Everett Style envelope for the given txid.

A transaction envelope is a tree of inputs where all the leaves are proven transactions.
The trivial case is a single leaf: the envelope for a proven transaction is the rawTx and its proof.

Each branching level of the tree corresponds to an unmined transaction without a proof,
in which case the envelope is:
- rawTx
- mapiResponses from transaction processors (optional)
- inputs object where keys are this transaction's input txids and values are recursive envelope for those txids.

```ts
export async function getEnvelopeForTransaction(args: {
    txid: string;
}): Promise<EnvelopeApi | undefined> 
```

See also: [EnvelopeApi](#interface-envelopeapi)

<details>

<summary>Function getEnvelopeForTransaction Details</summary>

Returns

Undefined if the txid does not exist or an envelope can't be generated.

Argument Details

+ **args**
  + All parameters are given in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getHeight

Returns the current chain height of the network

```ts
export async function getHeight(): Promise<number> 
```

<details>

<summary>Function getHeight Details</summary>

Returns

The current chain height

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getInfo

```ts
export async function getInfo(args?: GetInfoParams): Promise<GetInfoResult> 
```

See also: [GetInfoParams](#interface-getinfoparams), [GetInfoResult](#interface-getinforesult)

<details>

<summary>Function getInfo Details</summary>

Returns

information about the metanet-client context (version, chain, height, user...).

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getMerkleRootForHeight

A method to verify the validity of a Merkle root for a given block height.

```ts
export async function getMerkleRootForHeight(height: number): Promise<string | undefined> 
```

<details>

<summary>Function getMerkleRootForHeight Details</summary>

Returns

Returns the merkle root for height or undefined, if height doesn't have a known merkle root or is invalid.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getNetwork

Returns which BSV network we are using (mainnet or testnet)

```ts
export async function getNetwork(format?: "default" | "nonet"): Promise<string> 
```

<details>

<summary>Function getNetwork Details</summary>

Returns

The current BSV network formatted as requested.

Argument Details

+ **format**
  + for the returned string. Either with (default) or without (nonet) a 'net' suffix.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getPreferredCurrency

Returns the user's preferred currency for displaying within apps

```ts
export async function getPreferredCurrency(args: {
    description?: string;
}): Promise<string> 
```

<details>

<summary>Function getPreferredCurrency Details</summary>

Returns

The user's preferred currency

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getPublicKey

Returns the public key. If identityKey is specified, returns the current user's identity key. If a counterparty is specified, derives a public key for the counterparty.

```ts
export async function getPublicKey(args: {
    protocolID?: ProtocolID;
    keyID?: string;
    privileged?: boolean;
    identityKey?: boolean;
    reason?: string;
    counterparty?: string;
    forSelf?: boolean;
}): Promise<string> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function getPublicKey Details</summary>

Returns

The user's public key

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getRandomID

```ts
export default function getRandomID(): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getTransactionOutputs

Returns a set of transaction outputs that Dojo has tracked

```ts
export async function getTransactionOutputs(args: {
    basket?: string;
    tracked?: boolean;
    spendable?: boolean;
    tags?: string[];
    type?: string;
    includeEnvelope?: boolean;
    includeBasket?: boolean;
    includeCustomInstructions?: boolean;
    includeTags?: boolean;
    tagQueryMode?: "all" | "any";
    limit?: number;
    offset?: number;
}): Promise<GetTransactionOutputResult[]> 
```

See also: [GetTransactionOutputResult](#interface-gettransactionoutputresult)

<details>

<summary>Function getTransactionOutputs Details</summary>

Returns

A set of outputs that match the criteria

Argument Details

+ **args**
  + All parameters are given in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: getVersion

Returns the current version of the kernel

```ts
export async function getVersion(): Promise<string> 
```

<details>

<summary>Function getVersion Details</summary>

Returns

The current kernel version (e.g. "0.3.49")

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: isAuthenticated

Checks if a user is currently authenticated.

```ts
export async function isAuthenticated(): Promise<boolean> 
```

<details>

<summary>Function isAuthenticated Details</summary>

Returns

Returns whether a user is currently authenticated.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: listActions

Returns a list of Actions with a given label

```ts
export async function listActions(args: {
    label: string;
    addInputsAndOutputs?: boolean;
    includeBasket?: boolean;
    includeTags?: boolean;
    noRawTx?: boolean;
    limit?: number;
    offset?: number;
}): Promise<ListActionsResult> 
```

See also: [ListActionsResult](#interface-listactionsresult)

<details>

<summary>Function listActions Details</summary>

Returns

A set of outputs that match the criteria

Argument Details

+ **args**
  + All parameters are given in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: makeHttpRequest

```ts
export default async function makeHttpRequest<R>(routeURL: string, requestInput: RequestInit = {}): Promise<R> 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: parseWalletOutpoint

```ts
export function parseWalletOutpoint(outpoint: string): {
    txid: string;
    vout: number;
} 
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
#### Function: proveCertificate

Creates certificate proof specifically for verifier

```ts
export async function proveCertificate(args: {
    certificate: CertificateApi;
    fieldsToReveal: string[];
    verifierPublicIdentityKey: string;
}): Promise<ProveCertificateResult> 
```

See also: [CertificateApi](#interface-certificateapi), [ProveCertificateResult](#interface-provecertificateresult)

<details>

<summary>Function proveCertificate Details</summary>

Returns

A certificate for presentation to the verifier for field examination

Argument Details

+ **args**
  + All parameters for this function are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: requestGroupPermission

Requests group permissions for an application.

```ts
export async function requestGroupPermission(): Promise<void> 
```

<details>

<summary>Function requestGroupPermission Details</summary>

Returns

Resolves after group permissions are completed by the user.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: resolveOptionalEnvelopeEvidence

Convert OptionalEnvelopeEvidenceApi to EnvelopeEvidenceApi.

Missing data (rawTx / proofs) can be looked up if lookupMissing is provided.

Any mising data will result in an Error throw.

```ts
export async function resolveOptionalEnvelopeEvidence(e: OptionalEnvelopeEvidenceApi, lookupMissing?: (txid: string) => Promise<{
    rawTx?: string;
    proof?: TscMerkleProofApi;
}>): Promise<EnvelopeEvidenceApi> 
```

See also: [EnvelopeEvidenceApi](#interface-envelopeevidenceapi), [OptionalEnvelopeEvidenceApi](#interface-optionalenvelopeevidenceapi), [TscMerkleProofApi](#interface-tscmerkleproofapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: revealKeyLinkage

Reveals the linkage between a key held by this user and a key held by another user.
In one mode, reveals all keys associated with a counterparty,
in the other mode reveals only the linkage of a specific interaction.

Encrypts the linkage value so that only the specified verifier can access it.
Refer to [BRC-72](https://brc.dev/72) for full details.

```ts
export async function revealKeyLinkage(args: {
    mode: "counterparty" | "specific";
    counterparty: string;
    verifier: string;
    protocolID: ProtocolID;
    keyID: string;
    description: string;
    privileged?: boolean;
}): Promise<CounterpartyKeyLinkageResult | SpecificKeyLinkageResult> 
```

See also: [CounterpartyKeyLinkageResult](#interface-counterpartykeylinkageresult), [ProtocolID](#type-protocolid), [SpecificKeyLinkageResult](#interface-specifickeylinkageresult)

<details>

<summary>Function revealKeyLinkage Details</summary>

Returns

The revealed linkage payload, as described in [BRC-72](https://brc.dev/72).

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: revealKeyLinkageCounterparty

Reveals the linkage between a key held by this user and a key held by another user.
Reveals all keys associated with a counterparty,

Encrypts the linkage value so that only the specified verifier can access it.
Refer to [BRC-72](https://brc.dev/72) for full details.

```ts
export async function revealKeyLinkageCounterparty(args: {
    counterparty: string;
    verifier: string;
    protocolID: ProtocolID;
    description: string;
    privileged?: boolean;
}): Promise<CounterpartyKeyLinkageResult> 
```

See also: [CounterpartyKeyLinkageResult](#interface-counterpartykeylinkageresult), [ProtocolID](#type-protocolid)

<details>

<summary>Function revealKeyLinkageCounterparty Details</summary>

Returns

The revealed linkage payload, as described in [BRC-72](https://brc.dev/72).

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: revealKeyLinkageSpecific

Reveals the linkage between a key held by this user and a key held by another user.
Reveals only the linkage of a specific interaction.

Encrypts the linkage value so that only the specified verifier can access it.
Refer to [BRC-72](https://brc.dev/72) for full details.

```ts
export async function revealKeyLinkageSpecific(args: {
    counterparty: string;
    verifier: string;
    protocolID: ProtocolID;
    keyID: string;
    description: string;
    privileged?: boolean;
}): Promise<SpecificKeyLinkageResult> 
```

See also: [ProtocolID](#type-protocolid), [SpecificKeyLinkageResult](#interface-specifickeylinkageresult)

<details>

<summary>Function revealKeyLinkageSpecific Details</summary>

Returns

The revealed linkage payload, as described in [BRC-72](https://brc.dev/72).

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: sha256Hash

Calculate the SHA256 hash of a Buffer.

```ts
export function sha256Hash(buffer: Buffer): Buffer {
    const msg = asArray(buffer);
    const first = new Hash.SHA256().update(msg).digest();
    return asBuffer(first);
}
```

See also: [asArray](#function-asarray), [asBuffer](#function-asbuffer)

<details>

<summary>Function sha256Hash Details</summary>

Returns

sha256 hash of buffer contents.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: signAction

Completes a previously created action which required custom input unlocking script signing.

```ts
export async function signAction(args: {
    inputs?: Record<string, CreateActionInput>;
    createResult: DojoCreateTransactionResultApi;
    acceptDelayedBroadcast?: boolean;
    log?: string;
}): Promise<SignActionResult> 
```

See also: [CreateActionInput](#interface-createactioninput), [DojoCreateTransactionResultApi](#interface-dojocreatetransactionresultapi), [SignActionResult](#interface-signactionresult)

<details>

<summary>Function signAction Details</summary>

Returns

An Action object containing "txid", "rawTx" "mapiResponses" and "inputs".

Argument Details

+ **args**
  + All parameters for this function are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: stampLog

If a log is being kept, add a time stamped line.

```ts
export function stampLog(log: string | undefined | {
    log?: string;
}, lineToAdd: string): string | undefined 
```

<details>

<summary>Function stampLog Details</summary>

Returns

undefined or log extended by time stamped `lineToAdd` and new line.

Argument Details

+ **log**
  + Optional time stamped log to extend, or an object with a log property to update
+ **lineToAdd**
  + Content to add to line.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: stampLogFormat

Replaces individual timestamps with delta msecs.
Looks for two network crossings and adjusts clock for clock skew if found.
Assumes log built by repeated calls to `stampLog`

```ts
export function stampLogFormat(log?: string): string 
```

<details>

<summary>Function stampLogFormat Details</summary>

Returns

reformated multi-line event log

Argument Details

+ **log**
  + Each logged event starts with ISO time stamp, space, rest of line, terminated by `\n`.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: submitDirectTransaction

Submits a transaction directly to a ninja

```ts
export async function submitDirectTransaction(args: {
    protocol?: string;
    transaction: SubmitDirectTransaction;
    senderIdentityKey: string;
    note: string;
    amount: number;
    labels?: string[];
    derivationPrefix?: string;
}): Promise<SubmitDirectTransactionResult> 
```

See also: [SubmitDirectTransaction](#interface-submitdirecttransaction), [SubmitDirectTransactionResult](#interface-submitdirecttransactionresult)

<details>

<summary>Function submitDirectTransaction Details</summary>

Returns

Object containing reference number, status=success, and human-readable note acknowledging the transaction

Argument Details

+ **args**
  + All parameters for this function are provided in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: toBEEFfromEnvelope

Converts a BRC-8 Everett-style Transaction Envelope 
to a

```ts
export function toBEEFfromEnvelope(e: EnvelopeEvidenceApi): {
    tx: Transaction;
    beef: number[];
} 
```

See also: [EnvelopeEvidenceApi](#interface-envelopeevidenceapi)

<details>

<summary>Function toBEEFfromEnvelope Details</summary>

Returns

tx: Transaction containing required merklePath and sourceTransaction values

beef: tx.toBEEF()

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: toEnvelopeFromBEEF

BEEF standard: BRC-62: Background Evaluation Extended Format (BEEF) Transactions
https://github.com/bitcoin-sv/BRCs/blob/master/transactions/0062.md

BUMP standard: BRC-74: BSV Unified Merkle Path (BUMP) Format
https://github.com/bitcoin-sv/BRCs/blob/master/transactions/0074.md

```ts
export function toEnvelopeFromBEEF(input: Transaction | number[]): EnvelopeEvidenceApi 
```

See also: [EnvelopeEvidenceApi](#interface-envelopeevidenceapi)

<details>

<summary>Function toEnvelopeFromBEEF Details</summary>

Returns

Everett-style Envelope for the transaction.

Argument Details

+ **input**
  + Either a `Transaction` with sourceTransaction and merklePath,
recursively, on inputs,
or a serialized BEEF of the transaction.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: unbasketOutput

Removes the uniquely identified output's basket assignment.

The output will no longer belong to any basket.

This is typically only useful for outputs that are no longer usefull.

```ts
export async function unbasketOutput(args: {
    txid: string;
    vout: number;
    basket: string;
}): Promise<void> 
```

<details>

<summary>Function unbasketOutput Details</summary>

Argument Details

+ **args**
  + All parameters are given in an object

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateAbortActionArgs

```ts
export function validateAbortActionArgs(args: sdk.AbortActionArgs): ValidAbortActionArgs 
```

See also: [AbortActionArgs](#interface-abortactionargs), [ValidAbortActionArgs](#interface-validabortactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateAcquireCertificateArgs

```ts
export function validateAcquireCertificateArgs(args: sdk.AcquireCertificateArgs): ValidAcquireCertificateArgs 
```

See also: [AcquireCertificateArgs](#interface-acquirecertificateargs), [ValidAcquireCertificateArgs](#interface-validacquirecertificateargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateBasketInsertion

```ts
export function validateBasketInsertion(args?: sdk.BasketInsertion): ValidBasketInsertion | undefined 
```

See also: [BasketInsertion](#interface-basketinsertion), [ValidBasketInsertion](#interface-validbasketinsertion)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateCreateActionArgs

```ts
export function validateCreateActionArgs(args: sdk.CreateActionArgs): ValidCreateActionArgs 
```

See also: [CreateActionArgs](#interface-createactionargs), [ValidCreateActionArgs](#interface-validcreateactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateCreateActionInput

```ts
export function validateCreateActionInput(i: sdk.CreateActionInput): ValidCreateActionInput 
```

See also: [CreateActionInput](#interface-createactioninput), [ValidCreateActionInput](#interface-validcreateactioninput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateCreateActionOptions

```ts
export function validateCreateActionOptions(options?: CreateActionOptions): CreateActionOptions 
```

See also: [CreateActionOptions](#interface-createactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateCreateActionOptions

Set all default true/false booleans to true or false if undefined.
Set all possibly undefined numbers to their default values.
Set all possibly undefined arrays to empty arrays.
Convert string outpoints to `{ txid: string, vout: number }`

```ts
export function validateCreateActionOptions(options?: sdk.CreateActionOptions): ValidCreateActionOptions 
```

See also: [CreateActionOptions](#interface-createactionoptions), [ValidCreateActionOptions](#interface-validcreateactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateCreateActionOutput

```ts
export function validateCreateActionOutput(o: sdk.CreateActionOutput): ValidCreateActionOutput 
```

See also: [CreateActionOutput](#interface-createactionoutput), [ValidCreateActionOutput](#interface-validcreateactionoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateInteger

```ts
export function validateInteger(v: number | undefined, name: string, defaultValue?: number, min?: number, max?: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateInternalizeActionArgs

```ts
export function validateInternalizeActionArgs(args: sdk.InternalizeActionArgs): ValidInternalizeActionArgs 
```

See also: [InternalizeActionArgs](#interface-internalizeactionargs), [ValidInternalizeActionArgs](#interface-validinternalizeactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateInternalizeOutput

```ts
export function validateInternalizeOutput(args: sdk.InternalizeOutput): ValidInternalizeOutput 
```

See also: [InternalizeOutput](#interface-internalizeoutput), [ValidInternalizeOutput](#interface-validinternalizeoutput)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateListActionsArgs

```ts
export function validateListActionsArgs(args: sdk.ListActionsArgs): ValidListActionsArgs 
```

See also: [ListActionsArgs](#interface-listactionsargs), [ValidListActionsArgs](#interface-validlistactionsargs)

<details>

<summary>Function validateListActionsArgs Details</summary>

Argument Details

+ **args.labels**
  + An array of labels used to filter actions.
+ **args.labelQueryMode**
  + Optional. Specifies how to match labels (default is any which matches any of the labels).
+ **args.includeLabels**
  + Optional. Whether to include transaction labels in the result set.
+ **args.includeInputs**
  + Optional. Whether to include input details in the result set.
+ **args.includeInputSourceLockingScripts**
  + Optional. Whether to include input source locking scripts in the result set.
+ **args.includeInputUnlockingScripts**
  + Optional. Whether to include input unlocking scripts in the result set.
+ **args.includeOutputs**
  + Optional. Whether to include output details in the result set.
+ **args.includeOutputLockingScripts**
  + Optional. Whether to include output locking scripts in the result set.
+ **args.limit**
  + Optional. The maximum number of transactions to retrieve.
+ **args.offset**
  + Optional. Number of transactions to skip before starting to return the results.
+ **args.seekPermission**
  + — Optional. Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateListCertificatesArgs

```ts
export function validateListCertificatesArgs(args: sdk.ListCertificatesArgs): ValidListCertificatesArgs 
```

See also: [ListCertificatesArgs](#interface-listcertificatesargs), [ValidListCertificatesArgs](#interface-validlistcertificatesargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateListOutputsArgs

```ts
export function validateListOutputsArgs(args: sdk.ListOutputsArgs): ValidListOutputsArgs 
```

See also: [ListOutputsArgs](#interface-listoutputsargs), [ValidListOutputsArgs](#interface-validlistoutputsargs)

<details>

<summary>Function validateListOutputsArgs Details</summary>

Argument Details

+ **args.basket**
  + Required. The associated basket name whose outputs should be listed.
+ **args.tags**
  + Optional. Filter outputs based on these tags.
+ **args.tagQueryMode**
  + Optional. Filter mode, defining whether all or any of the tags must match. By default, any tag can match.
+ **args.include**
  + Optional. Whether to include locking scripts (with each output) or entire transactions (as aggregated BEEF, at the top level) in the result. By default, unless specified, neither are returned.
+ **args.includeEntireTransactions**
  + Optional. Whether to include the entire transaction(s) in the result.
+ **args.includeCustomInstructions**
  + Optional. Whether custom instructions should be returned in the result.
+ **args.includeTags**
  + Optional. Whether the tags associated with the output should be returned.
+ **args.includeLabels**
  + Optional. Whether the labels associated with the transaction containing the output should be returned.
+ **args.limit**
  + Optional limit on the number of outputs to return.
+ **args.offset**
  + Optional. Number of outputs to skip before starting to return results.
+ **args.seekPermission**
  + — Optional. Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateOptionalEnvelopeEvidence

```ts
export function validateOptionalEnvelopeEvidence(e: OptionalEnvelopeEvidenceApi): EnvelopeEvidenceApi 
```

See also: [EnvelopeEvidenceApi](#interface-envelopeevidenceapi), [OptionalEnvelopeEvidenceApi](#interface-optionalenvelopeevidenceapi)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateOptionalInteger

```ts
export function validateOptionalInteger(v: number | undefined, name: string, min?: number, max?: number): number | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateOptionalOutpointString

```ts
export function validateOptionalOutpointString(outpoint: string | undefined, name: string): string | undefined 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateOutpointString

```ts
export function validateOutpointString(outpoint: string, name: string): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validatePositiveIntegerOrZero

```ts
export function validatePositiveIntegerOrZero(v: number, name: string): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateRelinquishOutputArgs

```ts
export function validateRelinquishOutputArgs(args: sdk.RelinquishOutputArgs): ValidRelinquishOutputArgs 
```

See also: [RelinquishOutputArgs](#interface-relinquishoutputargs), [ValidRelinquishOutputArgs](#interface-validrelinquishoutputargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateSatoshis

```ts
export function validateSatoshis(v: number | undefined, name: string, min?: number): number 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateSignActionArgs

```ts
export function validateSignActionArgs(args: sdk.SignActionArgs): ValidSignActionArgs 
```

See also: [SignActionArgs](#interface-signactionargs), [ValidSignActionArgs](#interface-validsignactionargs)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateSignActionOptions

Set all default true/false booleans to true or false if undefined.
Set all possibly undefined numbers to their default values.
Set all possibly undefined arrays to empty arrays.
Convert string outpoints to `{ txid: string, vout: number }`

```ts
export function validateSignActionOptions(options?: sdk.SignActionOptions): ValidSignActionOptions 
```

See also: [SignActionOptions](#interface-signactionoptions), [ValidSignActionOptions](#interface-validsignactionoptions)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateStringLength

```ts
export function validateStringLength(s: string, name: string, min?: number, max?: number): string 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: validateWalletPayment

```ts
export function validateWalletPayment(args?: sdk.WalletPayment): ValidWalletPayment | undefined 
```

See also: [ValidWalletPayment](#interface-validwalletpayment), [WalletPayment](#interface-walletpayment)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: verifyHmac

Verifies that a SHA-256 HMAC was created with a key that belongs to the user.

```ts
export async function verifyHmac(args: {
    data: Uint8Array | string;
    hmac: Uint8Array | string;
    protocolID: ProtocolID;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
}): Promise<boolean> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function verifyHmac Details</summary>

Returns

Whether the HMAC has been erified.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: verifySignature

Verifies that a digital signature was created with a key belonging to the user.

```ts
export async function verifySignature(args: {
    data: Uint8Array | string;
    signature: Uint8Array | string;
    protocolID: ProtocolID;
    keyID: string;
    description?: string;
    counterparty?: string;
    privileged?: boolean;
    reason?: string;
}): Promise<boolean> 
```

See also: [ProtocolID](#type-protocolid)

<details>

<summary>Function verifySignature Details</summary>

Returns

An whether the signature was successfully verified.

Argument Details

+ **args**
  + All parameters are passed in an object.

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: verifyTruthy

```ts
export function verifyTruthy<T>(v: T | null | undefined, description?: string): T 
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Function: waitForAuthentication

Waits for a user to be authenticated.

```ts
export async function waitForAuthentication(): Promise<boolean> 
```

<details>

<summary>Function waitForAuthentication Details</summary>

Returns

Always returns true

</details>

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Types

| | | |
| --- | --- | --- |
| [AcquisitionProtocol](#type-acquisitionprotocol) | [EntityNameStringMax100Bytes](#type-entitynamestringmax100bytes) | [ProtocolID](#type-protocolid) |
| [ActionStatus](#type-actionstatus) | [ErrorCodeString10To40Bytes](#type-errorcodestring10to40bytes) | [ProtocolString5To400Bytes](#type-protocolstring5to400bytes) |
| [AtomicBEEF](#type-atomicbeef) | [ErrorDescriptionString20To200Bytes](#type-errordescriptionstring20to200bytes) | [PubKeyHex](#type-pubkeyhex) |
| [BEEF](#type-beef) | [HexString](#type-hexstring) | [SatoshiValue](#type-satoshivalue) |
| [Base64String](#type-base64string) | [ISOTimestampString](#type-isotimestampstring) | [SendWithResultStatus](#type-sendwithresultstatus) |
| [BasketStringUnder300Bytes](#type-basketstringunder300bytes) | [KeyIDStringUnder800Bytes](#type-keyidstringunder800bytes) | [TXIDHexString](#type-txidhexstring) |
| [BooleanDefaultFalse](#type-booleandefaultfalse) | [KeyringRevealer](#type-keyringrevealer) | [TransactionStatusApi](#type-transactionstatusapi) |
| [BooleanDefaultTrue](#type-booleandefaulttrue) | [LabelStringUnder300Bytes](#type-labelstringunder300bytes) | [TrustSelf](#type-trustself) |
| [Byte](#type-byte) | [OriginatorDomainNameStringUnder250Bytes](#type-originatordomainnamestringunder250bytes) | [TrustSelf](#type-trustself) |
| [CertificateFieldNameUnder50Bytes](#type-certificatefieldnameunder50bytes) | [OutpointString](#type-outpointstring) | [VersionString7To30Bytes](#type-versionstring7to30bytes) |
| [Chain](#type-chain) | [OutputTagStringUnder300Bytes](#type-outputtagstringunder300bytes) | [WalletCounterparty](#type-walletcounterparty) |
| [Counterparty](#type-counterparty) | [PositiveInteger](#type-positiveinteger) | [WalletNetwork](#type-walletnetwork) |
| [DescriptionString5to50Bytes](#type-descriptionstring5to50bytes) | [PositiveIntegerDefault10Max10000](#type-positiveintegerdefault10max10000) | [WalletProtocol](#type-walletprotocol) |
| [DojoProvidedByApi](#type-dojoprovidedbyapi) | [PositiveIntegerMax10](#type-positiveintegermax10) |  |
| [EntityIconURLStringMax500Bytes](#type-entityiconurlstringmax500bytes) | [PositiveIntegerOrZero](#type-positiveintegerorzero) |  |

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---

#### Type: AcquisitionProtocol

```ts
export type AcquisitionProtocol = "direct" | "issuance"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: ActionStatus

```ts
export type ActionStatus = "completed" | "unprocessed" | "sending" | "unproven" | "unsigned" | "nosend" | "nonfinal"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: AtomicBEEF

```ts
export type AtomicBEEF = Byte[]
```

See also: [Byte](#type-byte)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: BEEF

```ts
export type BEEF = Byte[]
```

See also: [Byte](#type-byte)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: Base64String

```ts
export type Base64String = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: BasketStringUnder300Bytes

```ts
export type BasketStringUnder300Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: BooleanDefaultFalse

```ts
export type BooleanDefaultFalse = boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: BooleanDefaultTrue

```ts
export type BooleanDefaultTrue = boolean
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: Byte

```ts
export type Byte = number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: CertificateFieldNameUnder50Bytes

```ts
export type CertificateFieldNameUnder50Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: Chain

```ts
export type Chain = "main" | "test"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: Counterparty

```ts
export type Counterparty = PublicKey | PubKeyHex | "self" | "anyone"
```

See also: [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: DescriptionString5to50Bytes

```ts
export type DescriptionString5to50Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: DojoProvidedByApi

```ts
export type DojoProvidedByApi = "you" | "dojo" | "you-and-dojo"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: EntityIconURLStringMax500Bytes

```ts
export type EntityIconURLStringMax500Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: EntityNameStringMax100Bytes

```ts
export type EntityNameStringMax100Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: ErrorCodeString10To40Bytes

```ts
export type ErrorCodeString10To40Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: ErrorDescriptionString20To200Bytes

```ts
export type ErrorDescriptionString20To200Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: HexString

```ts
export type HexString = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: ISOTimestampString

```ts
export type ISOTimestampString = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: KeyIDStringUnder800Bytes

```ts
export type KeyIDStringUnder800Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: KeyringRevealer

```ts
export type KeyringRevealer = PubKeyHex | "certifier"
```

See also: [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: LabelStringUnder300Bytes

```ts
export type LabelStringUnder300Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: OriginatorDomainNameStringUnder250Bytes

```ts
export type OriginatorDomainNameStringUnder250Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: OutpointString

```ts
export type OutpointString = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: OutputTagStringUnder300Bytes

```ts
export type OutputTagStringUnder300Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: PositiveInteger

```ts
export type PositiveInteger = number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: PositiveIntegerDefault10Max10000

```ts
export type PositiveIntegerDefault10Max10000 = number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: PositiveIntegerMax10

```ts
export type PositiveIntegerMax10 = number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: PositiveIntegerOrZero

```ts
export type PositiveIntegerOrZero = number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: ProtocolID

```ts
export type ProtocolID = string | [
    0 | 1 | 2,
    string
]
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: ProtocolString5To400Bytes

```ts
export type ProtocolString5To400Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: PubKeyHex

```ts
export type PubKeyHex = HexString
```

See also: [HexString](#type-hexstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: SatoshiValue

```ts
export type SatoshiValue = number
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: SendWithResultStatus

```ts
export type SendWithResultStatus = "unproven" | "sending" | "failed"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: TXIDHexString

```ts
export type TXIDHexString = HexString
```

See also: [HexString](#type-hexstring)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: TransactionStatusApi

```ts
export type TransactionStatusApi = "completed" | "failed" | "unprocessed" | "sending" | "unproven" | "unsigned" | "nosend"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: TrustSelf

Controls level of trust for inputs from user's own transactions.

```ts
export type TrustSelf = "known"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: TrustSelf

Controls behavior of input BEEF validation.

If `known`, input transactions may omit supporting validity proof data for all TXIDs known to this wallet.

If undefined, input BEEFs must be complete and valid.

```ts
export type TrustSelf = "known"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: VersionString7To30Bytes

```ts
export type VersionString7To30Bytes = string
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: WalletCounterparty

```ts
export type WalletCounterparty = PubKeyHex | "self" | "anyone"
```

See also: [PubKeyHex](#type-pubkeyhex)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: WalletNetwork

```ts
export type WalletNetwork = "mainnet" | "testnet"
```

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
#### Type: WalletProtocol

```ts
export type WalletProtocol = [
    0 | 1 | 2,
    ProtocolString5To400Bytes
]
```

See also: [ProtocolString5To400Bytes](#type-protocolstring5to400bytes)

Links: [API](#api), [Interfaces](#interfaces), [Classes](#classes), [Functions](#functions), [Types](#types), [Variables](#variables)

---
### Variables

#### Variable: BabbageSDK

```ts
BabbageSDK = {
    abortAction,
    createAction,
    createHmac,
    createCertificate,
    createSignature,
    decrypt,
    decryptAsArray,
    decryptAsString,
    discoverByAttributes,
    discoverByIdentityKey,
    getPreferredCurrency,
    encrypt,
    encryptAsArray,
    encryptAsString,
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
    revealKeyLinkage,
    revealKeyLinkageCounterparty,
    revealKeyLinkageSpecific,
    signAction,
    submitDirectTransaction,
    unbasketOutput,
    verifyHmac,
    verifySignature,
    waitForAuthentication,
}
```

See also: [abortAction](#function-abortaction), [createAction](#function-createaction), [createCertificate](#function-createcertificate), [createHmac](#function-createhmac), [createSignature](#function-createsignature), [decrypt](#function-decrypt), [decryptAsArray](#function-decryptasarray), [decryptAsString](#function-decryptasstring), [discoverByAttributes](#function-discoverbyattributes), [discoverByIdentityKey](#function-discoverbyidentitykey), [encrypt](#function-encrypt), [encryptAsArray](#function-encryptasarray), [encryptAsString](#function-encryptasstring), [getCertificates](#function-getcertificates), [getEnvelopeForTransaction](#function-getenvelopefortransaction), [getHeight](#function-getheight), [getInfo](#function-getinfo), [getMerkleRootForHeight](#function-getmerklerootforheight), [getNetwork](#function-getnetwork), [getPreferredCurrency](#function-getpreferredcurrency), [getPublicKey](#function-getpublickey), [getTransactionOutputs](#function-gettransactionoutputs), [getVersion](#function-getversion), [isAuthenticated](#function-isauthenticated), [listActions](#function-listactions), [proveCertificate](#function-provecertificate), [requestGroupPermission](#function-requestgrouppermission), [revealKeyLinkage](#function-revealkeylinkage), [revealKeyLinkageCounterparty](#function-revealkeylinkagecounterparty), [revealKeyLinkageSpecific](#function-revealkeylinkagespecific), [signAction](#function-signaction), [submitDirectTransaction](#function-submitdirecttransaction), [unbasketOutput](#function-unbasketoutput), [verifyHmac](#function-verifyhmac), [verifySignature](#function-verifysignature), [waitForAuthentication](#function-waitforauthentication)

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
