## A Complete Example of `createAction`, `signAction`, and `abortAction`

```ts
import {
    CreateActionInput,
    abortAction,
    buildTransactionForSignActionUnlocking,
    createAction,
    signAction
} from '@babbage/sdk-ts'
import {
    PrivateKey, P2PKH,
    PublicKey
} from '@bsv/sdk'

const priv = PrivateKey.fromRandom()
const pub = PublicKey.fromPrivateKey(priv)
const address = pub.toAddress()
const satoshis = 122
const p2pkh = new P2PKH()
const lock = p2pkh.lock(address)
const unlock = p2pkh.unlock(priv, "single", false, satoshis, lock)

const r1 = await createAction({
    outputs: [{
        satoshis,
        script: lock.toHex(),
        description: `send to address ${address}`
    }],
    description: `send to private key ${priv.toHex()}`
})
if (!r1.txid || !r1.rawTx) throw new Error()

const unlockingScriptLength = await unlock.estimateLength()

const inputs: Record<string, CreateActionInput> = {}
inputs[r1.txid] = {
    rawTx: r1.rawTx,
    mapiResponses: r1.mapiResponses,
    inputs: r1.inputs,
    outputsToRedeem: [
        {
            index: 0,
            unlockingScript: unlockingScriptLength,
            spendingDescription: `spend address ${address}`
        }
    ]
}

const r2a = await createAction({
    inputs,
    description: `receive from private key ${priv.toHex()}`
})
if (!r2a.createResult) throw new Error()

const ra = await abortAction({ referenceNumber: r2a.createResult.referenceNumber })

const r2 = await createAction({
    inputs,
    description: `receive from private key ${priv.toHex()}`
})
if (!r2.createResult) throw new Error()

const tx = await buildTransactionForSignActionUnlocking(inputs, r2.createResult)
tx.inputs[0].unlockingScriptTemplate = unlock
await tx.sign()
if (!tx.inputs[0].unlockingScript) throw new Error()

inputs[r1.txid].outputsToRedeem[0].unlockingScript = tx.inputs[0].unlockingScript?.toHex()

const r4 = await signAction({ inputs, createResult: r2.createResult })

console.log(r4.txid)
```