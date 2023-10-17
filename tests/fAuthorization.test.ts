import '../src'
import Server from './utils/Server'

jest.retryTimes(5)

fAuthorization('bearer token')

const server = new Server()

beforeEach(async (): Promise<void> => {
  await server.start()
})

afterEach(async (): Promise<void> => {
  await server.stop()
})

describe(fAuthorization, (): void => {
  it('sets the Authorization header globally (see top)', async (): Promise<void> => {
    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({ Authorization: 'bearer token' }), body: '', url: '/', method: 'POST' })
  })

  it('sets the Authorization header per test', async (): Promise<void> => {
    fAuthorization('bearer per-test')

    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({ Authorization: 'bearer per-test' }), body: '', url: '/', method: 'POST' })
  })
})
