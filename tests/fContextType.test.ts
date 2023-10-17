import '../src'
import Server from './utils/Server'

jest.retryTimes(5)

fContentType('application/json')

const server = new Server()

beforeEach(async (): Promise<void> => {
  await server.start()
})

afterEach(async (): Promise<void> => {
  await server.stop()
})

describe(fContentType, (): void => {
  it('sets the COnten-Type header globally (see top)', async (): Promise<void> => {
    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({ 'Content-Type': 'application/json' }), body: '', url: '/', method: 'POST' })
  })

  it('sets the COnten-Type header per test', async (): Promise<void> => {
    fContentType('text/plain')

    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({ 'Content-Type': 'text/plain' }), body: '', url: '/', method: 'POST' })
  })
})
