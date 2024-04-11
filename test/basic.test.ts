/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrivateKey } from '@bsv/sdk'
import sdk from '../src/index'
import pushdrop from 'pushdrop'
import { randomBytesBase64, verifyTruthy } from 'cwi-base'

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
            key: PrivateKey.fromString(grantorKey, 'hex').toWif()
            })

            const r = await sdk.createAction({
                outputs: [{ basket: 'foobar', satoshis: 101, script: lockScript }],
                description: 'test',
                acceptDelayedBroadcast: true
            })

            expect(verifyTruthy(r.txid).length).toBe(64)

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
        let network = total
        if (newClocks.length % 2 === 0) {
            // Adjust for paired network crossing times and clock skew between two clocks.
            // Assumes we start on clock0, each `newClock` datum switches clocks.
            let lastNewClock = 0
            for (const newClock of newClocks) {
                network -= data[newClock - 1].when - data[lastNewClock].when
                lastNewClock = newClock
            }
            network -= data[data.length - 1].when - data[lastNewClock].when
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log2 = `
2024-02-12T04:20:34.046Z start ninja processTransactionWithOutputs
2024-02-12T04:20:34.046Z start ninja createTransactionWithOutputs
2024-02-12T04:20:34.046Z start dojo client createTransaction
2024-02-12T04:20:34.651Z start dojo express createTransaction **NETWORK**
2024-02-12T04:20:34.656Z start dojo createTransactionWithOutputs
2024-02-12T04:20:34.666Z ... dojo createTransactionWithOutputs validated
2024-02-12T04:20:34.671Z ... dojo createTransactionWithOutputs selected inputs gotten
2024-02-12T04:20:34.690Z ... dojo createTransactionWithOutputs found outputGeneration basket
2024-02-12T04:20:34.692Z ... dojo createTransactionWithOutputs found count basket utxos
2024-02-12T04:20:34.692Z ... dojo createTransactionWithOutputs change generated
2024-02-12T04:20:34.695Z ... dojo createTransactionWithOutputs envelope generated for 134a294845f4e0ea28cf96116cc88861e8fee4d5203d528827a6d4dba98dc713
2024-02-12T04:20:34.697Z ... dojo createTransactionWithOutputs envelope generated for 6e4684be994c26298696c6fad0dde653e82d5ebc1855f05577a3af7ba073eafb
2024-02-12T04:20:34.699Z ... dojo createTransactionWithOutputs envelope generated for 042e22ede8b3d3d262ede32a8d634861011c4f836695b7505fe7a96f651ad65a
2024-02-12T04:20:34.702Z ... dojo createTransactionWithOutputs envelope generated for 633cb13ec288ba92fcbcfc832f337a68bb7c7b9977e17c6dc17d7dd0b505f398
2024-02-12T04:20:34.705Z ... dojo createTransactionWithOutputs envelope generated for ca8729dce4c529992d0cf2d567bfe711f88aacfd5ac21a09b593845412744adb
2024-02-12T04:20:34.706Z ... dojo createTransactionWithOutputs envelope generated for c41a26489a19df6d8fef9e80845e3b26b12df7d4d54ce684de352838e822f0d1
2024-02-12T04:20:34.708Z ... dojo createTransactionWithOutputs envelope generated for 1679af028e4339ff13e319c18f0ae87933bcf84c7cce2810373618fe6ca30621
2024-02-12T04:20:34.711Z ... dojo createTransactionWithOutputs envelope generated for 5bcf345493dc2505559a134fe176b18daf5d814de07f319a1c0839fb379122bc
2024-02-12T04:20:34.715Z ... dojo createTransactionWithOutputs envelope generated for 9e83ba54cc863040ccb73c9ed42f0c80a9c53d592984aaa0e97cfe4cf64c2f11
2024-02-12T04:20:34.718Z ... dojo createTransactionWithOutputs envelope generated for f404ba9970db83e797ffffed1725e95b2db04e7e873a5191990fa0b967296f02
2024-02-12T04:20:34.720Z ... dojo createTransactionWithOutputs envelope generated for 536955e32e36c26699b8c5bdecd42e2a211a4739fc43bfbf520e42f0c98cd1ed
2024-02-12T04:20:34.724Z ... dojo createTransactionWithOutputs envelope generated for b104b8f2718c75135763e9c8fc5b718105c4347e684b232670a6a211b0a5b971
2024-02-12T04:20:34.727Z ... dojo createTransactionWithOutputs envelope generated for ea0374540c1e87359bdccea51b7853f6557c1ee83388894c60e5e9e964820947
2024-02-12T04:20:34.729Z ... dojo createTransactionWithOutputs envelope generated for 668d136518574aa8c835a6ff017de924d07ab5f3a5cee4067c65ab6a1988d994
2024-02-12T04:20:34.731Z ... dojo createTransactionWithOutputs envelope generated for 2b43edaf07e2b646dd0d1ca78cc99f924ed880712d4478ee03b7930291a7f348
2024-02-12T04:20:34.733Z ... dojo createTransactionWithOutputs envelope generated for dda7e531ae3450b50bbe73a36de823ccc4c89b99c0012fa2d97cd2c702db7c66
2024-02-12T04:20:34.735Z ... dojo createTransactionWithOutputs envelope generated for bb62d7323e54960bef9181fa937726cbdec96f56faef48b7626b237cb7b73c73
2024-02-12T04:20:34.743Z ... dojo createTransactionWithOutputs envelope generated for 960e1265accead87e97913854eadc763b483c86d27d533e3cda30c5245a5d034
2024-02-12T04:20:34.745Z ... dojo createTransactionWithOutputs envelope generated for b82714292fa355ba1c698178e0dcc3c1543fc9c26815adae07752ea8cf9e7ede
2024-02-12T04:20:34.748Z ... dojo createTransactionWithOutputs envelope generated for 7f953cbfdd2460ebddffe3a06df01c9539084fca74ecddb0e567f199a0ded119
2024-02-12T04:20:34.750Z ... dojo createTransactionWithOutputs envelope generated for 1536edcde96d4ceff97f11fc619aebcfd8fb4ddb065cbb2b1e6f5d11850993ee
2024-02-12T04:20:34.752Z ... dojo createTransactionWithOutputs envelope generated for ebf87f4de21b3e5ca0e9e8894dd0c3677ea2bc436321d66af4191e1dee8fa196
2024-02-12T04:20:34.755Z ... dojo createTransactionWithOutputs envelope generated for 114e48dd6e22ba097fa391b87743a79d8c0650a101ae750f8ee7e4806131e535
2024-02-12T04:20:34.757Z ... dojo createTransactionWithOutputs envelope generated for 0a332b64049f198e87442a8a5c74c3f061b413584301665c403a11a2a4584444
2024-02-12T04:20:34.759Z ... dojo createTransactionWithOutputs envelope generated for 886a1ca7e039acc39c05374ea2b497956b41f8fbc2112bd3b828fe7019817c92
2024-02-12T04:20:34.761Z ... dojo createTransactionWithOutputs envelope generated for dd1d077d204b01f4ac48f8b50118cd5343f3d11e68473dffa75bfa4bc6c8a6cb
2024-02-12T04:20:34.763Z ... dojo createTransactionWithOutputs envelope generated for a9e53c7932645251433d65d57bc4692cd5d6d46f40321cf68efee42f0d72e1bb
2024-02-12T04:20:34.765Z ... dojo createTransactionWithOutputs envelope generated for 83db8444e88cc5cf27a921657b43559480c982f61120a843a7f48a16be2aff4c
2024-02-12T04:20:34.767Z ... dojo createTransactionWithOutputs envelope generated for 66f68c21208bb6d1336605a1249483934034dfb8d03e778cb8fa5891fc893407
2024-02-12T04:20:34.769Z ... dojo createTransactionWithOutputs envelope generated for 54fc6764a46f0007f3d4c97af9f2df6c2d843030d5e6c23ce12dc62d729de8b3
2024-02-12T04:20:34.771Z ... dojo createTransactionWithOutputs envelope generated for c6c46b3a01d86162c7d7393dbd389ab1c0cedc7ace3eb0d666d86d33041b1f1f
2024-02-12T04:20:34.773Z ... dojo createTransactionWithOutputs envelope generated for 7b711f64967d5701dbf35c5eb37e26391e7b42f2cc51d7ecbd616b03907ebcfc
2024-02-12T04:20:34.775Z ... dojo createTransactionWithOutputs envelope generated for 9e711a639e5e63198a1a2c6d0ff8756552b6898fd48c28bd631fd6ede6c7a5ec
2024-02-12T04:20:34.777Z ... dojo createTransactionWithOutputs envelope generated for b2542fe891ebb29248f353953b8b661eaffcd0d723a8467cce963649e06e6f3b
2024-02-12T04:20:34.778Z ... dojo createTransactionWithOutputs envelope generated for 8090c58dcd65bf66248df8727f5c662f5d42430803526a1af09c4209ca57f687
2024-02-12T04:20:34.780Z ... dojo createTransactionWithOutputs envelope generated for a535b840937d1868455c2ac90a67b3cd2e9454555112fb0065f1504bcf865016
2024-02-12T04:20:34.783Z ... dojo createTransactionWithOutputs envelope generated for 68cd7139dbb284894ab3fd90d12881bde9415db31320dafdbd54d4c46f21bb4a
2024-02-12T04:20:34.784Z ... dojo createTransactionWithOutputs envelope generated for d2c62398d746c341341ff1bd01cc46a2c2ca3e7dc0e4bf8305d1c442c0fd0a47
2024-02-12T04:20:34.787Z ... dojo createTransactionWithOutputs envelope generated for 756dab64750a79efb68e68245c94b9f837b9a7e2c76aeea78bcbec18708bf8ef
2024-02-12T04:20:34.789Z ... dojo createTransactionWithOutputs envelope generated for 8999b85fc066452bfe734b10308cb53fb13592ee9a4d1fd52fc1bc56a446a8fb
2024-02-12T04:20:34.790Z ... dojo createTransactionWithOutputs envelope generated for 4c60b72a2f78c272daf344c096cc290921173954c9add195ac1d188aba14c5a5
2024-02-12T04:20:34.792Z ... dojo createTransactionWithOutputs envelope generated for 9e33a641f71e1a9f285a15a6db25e31822a1d69f9fe18ac23a705ec7c32cafb0
2024-02-12T04:20:34.795Z ... dojo createTransactionWithOutputs envelope generated for fe4954353b387d5bbcccfcbf0eb405f9184f1a947c5dba52c6a2af59f75071d3
2024-02-12T04:20:34.796Z ... dojo createTransactionWithOutputs envelope generated for 4e6a15e0d7ca62b2044974158f236164441238206b49d1bac07d5b66b3a766fd
2024-02-12T04:20:34.799Z ... dojo createTransactionWithOutputs envelope generated for e5b91e10c716f4f6d7bd62836ff19379d89f484e3ac82c569d6e12ab1aaf5bfc
2024-02-12T04:20:34.801Z ... dojo createTransactionWithOutputs envelope generated for 988457383c7408dfdebc65e36404a15c1d9010bb890f451999e4ad72f4439b28
2024-02-12T04:20:34.803Z ... dojo createTransactionWithOutputs envelope generated for 3b9ed90698c7542d695a86f546b6807cedcfea0272f798cb4cc0ccd413b578bf
2024-02-12T04:20:34.806Z ... dojo createTransactionWithOutputs envelope generated for 956f420ac82ae076a3e4e2536ec27c8e7ad7c4decefb028fb6421f90beec54d9
2024-02-12T04:20:34.808Z ... dojo createTransactionWithOutputs envelope generated for 293aa160e8cfa7bd477147e3866aaa9ed75093f1affef18394dc7e2d7a67bbe4
2024-02-12T04:20:34.810Z ... dojo createTransactionWithOutputs envelope generated for 692bc34fe9aabdf72888e931165d836d78ffc00c3567dab6f11c324e639232db
2024-02-12T04:20:34.812Z ... dojo createTransactionWithOutputs envelope generated for 4359cee4943c5489da1b9f1b7db11bc776d2e860fc278c1f055d65fc6006e9d4
2024-02-12T04:20:34.814Z ... dojo createTransactionWithOutputs storage transaction start
2024-02-12T04:20:34.822Z ... dojo createTransactionWithOutputs storage transaction transaction inserted 1573
2024-02-12T04:20:34.935Z ... dojo createTransactionWithOutputs storage transaction selectedInputs updated
2024-02-12T04:20:34.935Z ... dojo createTransactionWithOutputs storage transaction paymailHandle retrieved
2024-02-12T04:20:34.938Z ... dojo createTransactionWithOutputs storage transaction insert output non-service-charge
2024-02-12T04:20:34.981Z ... dojo createTransactionWithOutputs storage transaction output tagged
2024-02-12T04:20:34.983Z ... dojo createTransactionWithOutputs storage transaction insert commission
2024-02-12T04:20:34.983Z ... dojo createTransactionWithOutputs storage transaction labeled
2024-02-12T04:20:34.983Z ... dojo createTransactionWithOutputs storage transaction end
2024-02-12T04:20:34.990Z end dojo createTransactionWithOutputs
2024-02-12T04:20:34.990Z end dojo express createTransaction
2024-02-12T04:20:35.766Z end dojo client createTransaction **NETWORK**
2024-02-12T04:20:35.766Z ... ninja createTransactionWithOutputs signing transaction
2024-02-12T04:21:17.611Z end ninja createTransactionWithOutputs
2024-02-12T04:21:17.611Z start ninja processTransaction acceptDelayedBroadcast=true
2024-02-12T04:21:17.611Z start dojo client createTransaction
2024-02-12T04:21:18.244Z start dojo express processTransaction **NETWORK**
2024-02-12T04:21:18.257Z start dojo processTransaction
2024-02-12T04:21:18.280Z ... dojo processTransaction found transaction
2024-02-12T04:21:18.293Z ... dojo processTransaction transaction checked for broadcast
2024-02-12T04:21:18.295Z ... dojo processTransaction storage transaction start
2024-02-12T04:21:18.298Z ... dojo processTransaction storage transaction non-change output updated
2024-02-12T04:21:18.303Z ... dojo processTransaction storage transaction transaction updated
2024-02-12T04:21:18.320Z ... dojo processTransaction storage transaction status updated
2024-02-12T04:21:18.324Z ... dojo processTransaction storage transaction req inserted or merged
2024-02-12T04:21:18.326Z ... dojo processTransaction storage transaction mapi response inserted
2024-02-12T04:21:18.326Z ... dojo processTransaction storage transaction end
2024-02-12T04:21:18.334Z ... dojo processTransaction storage transaction await done
2024-02-12T04:21:18.334Z end dojo express processTransaction
2024-02-12T04:21:18.950Z end dojo client processTransaction **NETWORK**
2024-02-12T04:21:18.950Z end ninja processTransaction
2024-02-12T04:21:18.950Z end ninja processTransactionWithOutputs
`