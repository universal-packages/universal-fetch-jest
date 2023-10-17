import '../src'
import Server from './utils/Server'

jest.retryTimes(5)

const server = new Server()

beforeEach(async (): Promise<void> => {
  await server.start()
})

afterEach(async (): Promise<void> => {
  await server.stop()
})

describe(fHead, (): void => {
  it('makes a HEAD request', async (): Promise<void> => {
    await fHead('/HEAD-url/yes')

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toBeUndefined()
  })
})
