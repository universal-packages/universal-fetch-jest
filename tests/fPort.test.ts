import '../src'
import Server from './utils/Server'

jest.retryTimes(5)

fPort(5000 + Number(process.env.JEST_WORKER_ID))

const server = new Server('localhost', 5000 + Number(process.env.JEST_WORKER_ID))

beforeEach(async (): Promise<void> => {
  await server.start()
})

afterEach(async (): Promise<void> => {
  await server.stop()
})

describe(fPort, (): void => {
  it('sets the request port globally (see top)', async (): Promise<void> => {
    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({}), body: '', url: '/', method: 'POST' })
    expect(fDefaultPort).toEqual(4000 + Number(process.env.JEST_WORKER_ID))
  })

  it('sets the request port per test', async (): Promise<void> => {
    fPort(6000 + Number(process.env.JEST_WORKER_ID) + 1)

    let error: Error

    try {
      await fPost()
    } catch (e) {
      error = e
    }

    expect(error.message).toMatch(/request to http:\/\/localhost:600.* failed/)
  })
})
