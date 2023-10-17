import '../src'
import Server from './utils/Server'

jest.retryTimes(5)

fHeaders({ 'Init-Header': 'init-header-value' })

const server = new Server()

beforeEach(async (): Promise<void> => {
  await server.start()
})

afterEach(async (): Promise<void> => {
  await server.stop()
})

describe(fHeaders, (): void => {
  it('sets the request headers globally (see top)', async (): Promise<void> => {
    await fPost()

    expect(fResponse).toHaveReturnedWithStatus('OK')
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({ 'Init-Header': 'init-header-value' }), body: '', url: '/', method: 'POST' })
  })

  it('sets the request headers per test', async (): Promise<void> => {
    fHeaders({ 'Init-Header': 'per-test' })

    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({ 'Init-Header': 'per-test' }), body: '', url: '/', method: 'POST' })
  })
})
