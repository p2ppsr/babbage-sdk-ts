import {
    CreateActionInput,
    abortAction,
    buildTransactionForSignActionUnlocking,
    createAction,
    signAction
} from '../src'
import {
    PrivateKey, P2PKH,
    PublicKey
} from '@bsv/sdk'

describe("signAction tests", () => {
    jest.setTimeout(9000000)

    test("0_send to public key and receive back", async () => {
        const priv = PrivateKey.fromRandom()
        const pub = PublicKey.fromPrivateKey(priv)
        const address = pub.toAddress()
        const satoshis = 122
        const p2pkh = new P2PKH()
        const lock = p2pkh.lock(address)
        // Prepare to pay with SIGHASH_ALL and without ANYONE_CAN_PAY.
        // In otherwords:
        // - all outputs must remain in the current order, amount and locking scripts.
        // - all inputs must remain from the current outpoints and sequence numbers.
        // (unlock scripts are never signed)
        const unlock = p2pkh.unlock(priv, "all", false, satoshis, lock)

        const r1 = await createAction({
            outputs: [{
                satoshis,
                script: lock.toHex(),
                description: `send to address ${address}`
            }],
            description: `send to private key ${priv.toHex()}`
        })
        expect(r1.signActionRequired).not.toBe(true)
        expect(r1.txid).toBeTruthy()
        expect(r1.rawTx).toBeTruthy()
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
        expect(r2a.signActionRequired).toBe(true)
        expect(r2a.txid).not.toBeTruthy()
        expect(r2a.rawTx).not.toBeTruthy()
        expect(r2a.createResult).toBeTruthy()
        if (!r2a.createResult) throw new Error()
        
        const ra = await abortAction({ referenceNumber: r2a.createResult.referenceNumber })
        expect(ra.referenceNumber).toBe(r2a.createResult.referenceNumber)

        const r2 = await createAction({
            inputs,
            description: `receive from private key ${priv.toHex()}`
        })
        expect(r2.signActionRequired).toBe(true)
        expect(r2.txid).not.toBeTruthy()
        expect(r2.rawTx).not.toBeTruthy()
        expect(r2.createResult).toBeTruthy()
        if (!r2.createResult) throw new Error()

        const tx = await buildTransactionForSignActionUnlocking(inputs, r2.createResult)
        tx.inputs[0].unlockingScriptTemplate = unlock
        await tx.sign()
        expect(tx.inputs[0].unlockingScript).toBeTruthy()
        if (!tx.inputs[0].unlockingScript) throw new Error()

        inputs[r1.txid].outputsToRedeem[0].unlockingScript = tx.inputs[0].unlockingScript?.toHex()

        const r4 = await signAction({ inputs, createResult: r2.createResult })
        expect(r4.txid).toBeTruthy()
        expect(r4.rawTx).toBeTruthy()
    })
})