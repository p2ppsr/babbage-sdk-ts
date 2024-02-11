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


    test("4_format log", async () => {
        const log = `
2024-02-09T21:52:43.158Z start ninja createTransactionWithOutputs
2024-02-09T21:52:43.159Z start dojo client createTransaction
2024-02-09T21:52:44.147Z start dojo express createTransaction **NETWORK**
2024-02-09T21:52:44.151Z start dojo createTransactionWithOutputs
2024-02-09T21:52:44.159Z ... dojo createTransactionWithOutputs validated
2024-02-09T21:52:44.163Z ... dojo createTransactionWithOutputs selected inputs gotten
2024-02-09T21:52:44.179Z ... dojo createTransactionWithOutputs found outputGeneration basket
2024-02-09T21:52:44.182Z ... dojo createTransactionWithOutputs found count basket utxos
2024-02-09T21:52:44.183Z ... dojo createTransactionWithOutputs change generated
2024-02-09T21:52:44.184Z ... dojo createTransactionWithOutputs envelope generated for a0b7bdbe9d08b6e83f26ba34f10395c52bb32872d95bf392107b157bf2ef3b11     
2024-02-09T21:52:44.186Z ... dojo createTransactionWithOutputs envelope generated for da94c28817d688fd7004082e693e6d33abc0ee50e6a05b3c5d760dbd9ed83185     
2024-02-09T21:52:44.189Z ... dojo createTransactionWithOutputs envelope generated for 15989e0b263bf140f44bfba7aa61e868ded673f51b51311ee1bfc032053eb97b     
2024-02-09T21:52:44.191Z ... dojo createTransactionWithOutputs storage transaction start
2024-02-09T21:52:44.194Z ... dojo createTransactionWithOutputs storage transaction transaction inserted
2024-02-09T21:52:44.204Z ... dojo createTransactionWithOutputs storage transaction selectedInputs updated
2024-02-09T21:52:44.204Z ... dojo createTransactionWithOutputs storage transaction paymailHandle retrieved
2024-02-09T21:52:44.206Z ... dojo createTransactionWithOutputs storage transaction findOrInsert output basket todo tokens
2024-02-09T21:52:44.212Z ... dojo createTransactionWithOutputs storage transaction insert output non-service-charge
2024-02-09T21:52:44.223Z ... dojo createTransactionWithOutputs storage transaction output tagged
2024-02-09T21:52:44.225Z ... dojo createTransactionWithOutputs storage transaction insert commission
2024-02-09T21:52:44.233Z ... dojo createTransactionWithOutputs storage transaction labeled
2024-02-09T21:52:44.233Z ... dojo createTransactionWithOutputs storage transaction end
2024-02-09T21:52:44.238Z end dojo createTransactionWithOutputs
2024-02-09T21:52:44.239Z end dojo express createTransaction
2024-02-09T21:52:43.488Z end dojo client createTransaction **NETWORK**
2024-02-09T21:52:44.159Z start dojo client createTransaction
2024-02-09T21:52:45.147Z start dojo express createTransaction **NETWORK**
2024-02-09T21:52:45.151Z start dojo createTransactionWithOutputs
2024-02-09T21:52:45.159Z ... dojo createTransactionWithOutputs validated
2024-02-09T21:52:45.163Z ... dojo createTransactionWithOutputs selected inputs gotten
2024-02-09T21:52:45.179Z ... dojo createTransactionWithOutputs found outputGeneration basket
2024-02-09T21:52:45.182Z ... dojo createTransactionWithOutputs found count basket utxos
2024-02-09T21:52:45.183Z ... dojo createTransactionWithOutputs change generated
2024-02-09T21:52:45.184Z ... dojo createTransactionWithOutputs envelope generated for a0b7bdbe9d08b6e83f26ba34f10395c52bb32872d95bf392107b157bf2ef3b11     
2024-02-09T21:52:45.186Z ... dojo createTransactionWithOutputs envelope generated for da94c28817d688fd7004082e693e6d33abc0ee50e6a05b3c5d760dbd9ed83185     
2024-02-09T21:52:45.189Z ... dojo createTransactionWithOutputs envelope generated for 15989e0b263bf140f44bfba7aa61e868ded673f51b51311ee1bfc032053eb97b     
2024-02-09T21:52:45.191Z ... dojo createTransactionWithOutputs storage transaction start
2024-02-09T21:52:45.194Z ... dojo createTransactionWithOutputs storage transaction transaction inserted
2024-02-09T21:52:45.204Z ... dojo createTransactionWithOutputs storage transaction selectedInputs updated
2024-02-09T21:52:45.204Z ... dojo createTransactionWithOutputs storage transaction paymailHandle retrieved
2024-02-09T21:52:45.206Z ... dojo createTransactionWithOutputs storage transaction findOrInsert output basket todo tokens
2024-02-09T21:52:45.212Z ... dojo createTransactionWithOutputs storage transaction insert output non-service-charge
2024-02-09T21:52:45.223Z ... dojo createTransactionWithOutputs storage transaction output tagged
2024-02-09T21:52:45.225Z ... dojo createTransactionWithOutputs storage transaction insert commission
2024-02-09T21:52:45.233Z ... dojo createTransactionWithOutputs storage transaction labeled
2024-02-09T21:52:45.233Z ... dojo createTransactionWithOutputs storage transaction end
2024-02-09T21:52:45.238Z end dojo createTransactionWithOutputs
2024-02-09T21:52:45.239Z end dojo express createTransaction
2024-02-09T21:52:44.488Z end dojo client createTransaction **NETWORK**
2024-02-09T21:52:44.488Z ... ninja createTransactionWithOutputs signing transaction
2024-02-09T21:52:44.535Z end ninja createTransactionWithOutputs
`
        const logLines = log.split('\n')
        const data: {
            when: number,
            rest: string,
            delta: number,
            newClock: boolean
        }[] = []
        let last = 0
        const newClocks: number[] = []
        for (const line of logLines) {
            const spaceAt = line.indexOf(' ')
            if (spaceAt > -1) {
                const when = new Date(line.substring(0, spaceAt)).getTime()
                const rest = line.substring(spaceAt + 1)
                const delta = when - (last || when)
                const newClock = rest.indexOf('**NETWORK**') > -1
                if (newClock) newClocks.push(data.length)
                data.push({ when, rest, delta, newClock })
                last = when
            }
        }
        const total = data[data.length - 1].when - data[0].when
        let clocked = total
        if (newClocks.length % 2 === 0) {
            // Adjust for paired network crossing times and clock skew between two clocks.
            // Assumes we start on clock0, each `newClock` datum switches clocks.
            let lastNewClock = 0
            for (const newClock of newClocks) {
                clocked -= data[newClock - 1].when - data[lastNewClock].when
                lastNewClock = newClock
            }
            clocked -= data[data.length - 1].when - data[lastNewClock].when
            let network = total - clocked
            let networks = newClocks.length
            for (const newClock of newClocks) {
                const n = networks > 1 ? Math.floor(network / networks) : network
                data[newClock].delta = n
                network -= n
                networks--
            }
        }
        let log2 = `${new Date(data[0].when).toISOString()} Total = ${total} msecs\n`
        for (const d of data) {
            let df = d.delta.toString()
            df = `${' '.repeat(8 - df.length)}${df}`
            log2 += `${df} ${d.rest}\n`
        }
        console.log(log2)
    })
})