import sdk from '../src/index'

describe("basic tests", () => {

    test("0_", async () => {
        const n = await sdk.getNetwork()
        expect(n).toBe('test')
    }, 9000000)
})