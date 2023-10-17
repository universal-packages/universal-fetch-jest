import '../src'
import Server from './utils/Server'

jest.retryTimes(5)

fHost('0.0.0.0')

const server = new Server('0.0.0.0')

beforeEach(async (): Promise<void> => {
  await server.start()
})

afterEach(async (): Promise<void> => {
  await server.stop()
})

describe(fHost, (): void => {
  it('sets the request host globally (see top)', async (): Promise<void> => {
    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({}), body: '', url: '/', method: 'POST' })
  })

  it('sets the request host per test', async (): Promise<void> => {
    fHost('other')

    let error: Error

    try {
      await fPost()
    } catch (e) {
      error = e
    }

    expect(error.message).toMatch(/failed/)
  })
})
