/* eslint-env jest */
import BabbageSDK from '../src/index'

// Tests makeHttpRequest.js is handling basic errors correctly for every route
jest.setTimeout(90000)
describe('babbage-sdk-routes', () => {
  beforeEach(() => {

  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  
  it('Throws an error when trying to make a bad request to verifyHmac', async () => {
    const hmacResults = await BabbageSDK.createHmac({
      data: Buffer.from('some data'),
      protocolID: 'Hello World',
      keyID: '1'
    })
    const result = await BabbageSDK.verifyHmac({
      data: Buffer.from('some data that was not used'),
      hmac: Buffer.from(hmacResults).toString('base64'),
      protocolID: 'Hello World',
      keyID: '1'
    })
    expect(result).toEqual(false)
  })
  it('Throws an error when trying to make a bad request to verifySignature', async () => {
    const signature = await BabbageSDK.createSignature({
      data: 'This should fail, corrrect?', // Note: Also works as a base64 string
      protocolID: 'Hello World',
      keyID: '1'
    })
    const result = await BabbageSDK.verifySignature({
      data: Buffer.from('some data'),
      signature: Buffer.from(signature).toString('base64'),
      protocolID: 'Hello World',
      keyID: '1'
    })
    expect(result).toEqual(false)
  })
  
})
