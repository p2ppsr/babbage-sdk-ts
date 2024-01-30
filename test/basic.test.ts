import sdk from '../src/index'

describe("basic tests", () => {

    test("0_getNetwork", async () => {
        const n = await sdk.getNetwork()
        expect(n).toBe('test')
    }, 9000000)

    test("1_", async () => {
        const outs = await sdk.getTransactionOutputs({
            basket: 'default'
        })
        expect(outs.length).toBeGreaterThan(0)
    }, 9000000)
})