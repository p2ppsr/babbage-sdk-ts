/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import sdk from '../src/index'
import pushdrop from 'pushdrop'
import { bsv, randomBytesBase64 } from 'cwi-base'

describe("basic tests", () => {

    jest.setTimeout(90000000)

    test("0_getNetwork", async () => {
        const n = await sdk.getNetwork()
        expect(n).toBe('testnet')
    })

    test("1_getTransactionOutputs", async () => {
        try {
            await sdk.getTransactionOutputs({})
        } catch (e: any) {
            expect(e.code).toBe('ERR_INTERNAL')
            expect(e.message).toBe('basket is missing!')
        }

        try {
            await sdk.getTransactionOutputs({
                basket: 'default',
            })
        } catch (e: any) {
            expect(e.code).toBe('ERR_INTERNAL')
            expect(e.message).toBe('You are not allowed to access this basket!')
        }

        let outs = await sdk.getTransactionOutputs({ basket: 'foobar' })

        if (outs.length === 0) {
            const grantorKey = 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeafeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

            const lockScript: string = await pushdrop.create({
            fields: [
                Buffer.from('1'),
                Buffer.from('2'),
                Buffer.from('3'),
            ],
            key: bsv.PrivKey.fromBn(new bsv.Bn(grantorKey, 'hex')).toWif()
            })

            const r = await sdk.createAction({
                outputs: [{ basket: 'foobar', satoshis: 101, script: lockScript }],
                description: 'test',
                acceptDelayedBroadcast: true
            })

            expect(r.txid.length).toBe(64)

            outs = await sdk.getTransactionOutputs({ basket: 'foobar' })
        }

        expect(outs.length).toBeGreaterThan(0)

    })
  
    test("2_encrypt and decrypt", async () => {
        //await sdk.createCertificate({ certificateType: '', fieldObject: { a: 'a' }, certifierUrl: '', certifierPublicKey: '' })
        //await sdk.createHmac({ data: 'able was I', protocolID: 'foo', keyID: '42' })
        //await sdk.createSignature({ data: 'able was I', protocolID: 'foo', keyID: '42' })
        const plaintext = 'able was I'
        const plaintextA = new TextEncoder().encode(plaintext)

        {
            const ciphertext = await sdk.encrypt({ plaintext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'string' })
            const decrypted = await sdk.decrypt({ ciphertext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'string' })
            expect(decrypted).toBe(plaintext)
        }

        {
            const ciphertext = await sdk.encrypt({ plaintext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'string' })
            const decrypted = await sdk.decrypt({ ciphertext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'Uint8Array' })
            const decryptext = new TextDecoder().decode(decrypted as Uint8Array)
            expect(decryptext).toBe(plaintext)
        }

        {
            const ciphertext = await sdk.encrypt({ plaintext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'Uint8Array' })
            const decrypted = await sdk.decrypt({ ciphertext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'string' })
            expect(decrypted).toBe(plaintext)
        }

        {
            const ciphertext = await sdk.encrypt({ plaintext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'Uint8Array' })
            const decrypted = await sdk.decrypt({ ciphertext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'Uint8Array' })
            const decryptext = new TextDecoder().decode(decrypted as Uint8Array)
            expect(decryptext).toBe(plaintext)
        }

        {
            const ciphertext = await sdk.encrypt({ plaintext: plaintextA, protocolID: [2, 'foobar'], keyID: '42', returnType: 'string' })
            const decrypted = await sdk.decrypt({ ciphertext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'string' })
            expect(decrypted).toBe(plaintext)
        }

        {
            const ciphertext = await sdk.encrypt({ plaintext: plaintextA, protocolID: [2, 'foobar'], keyID: '42', returnType: 'string' })
            const decrypted = await sdk.decrypt({ ciphertext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'Uint8Array' })
            const decryptext = new TextDecoder().decode(decrypted as Uint8Array)
            expect(decryptext).toBe(plaintext)
        }

        {
            const ciphertext = await sdk.encrypt({ plaintext: plaintextA, protocolID: [2, 'foobar'], keyID: '42', returnType: 'Uint8Array' })
            const decrypted = await sdk.decrypt({ ciphertext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'string' })
            expect(decrypted).toBe(plaintext)
        }

        {
            const ciphertext = await sdk.encrypt({ plaintext: plaintextA, protocolID: [2, 'foobar'], keyID: '42', returnType: 'Uint8Array' })
            const decrypted = await sdk.decrypt({ ciphertext, protocolID: [2, 'foobar'], keyID: '42', returnType: 'Uint8Array' })
            const decryptext = new TextDecoder().decode(decrypted as Uint8Array)
            expect(decryptext).toBe(plaintext)
        }


    })

    test("3_getPublicKey", async () => {
        const keyID = randomBytesBase64(32)
        const publicKey = await sdk.getPublicKey({ protocolID: 'demoo', keyID })
        expect(publicKey.length).toBe(66)
    })
})