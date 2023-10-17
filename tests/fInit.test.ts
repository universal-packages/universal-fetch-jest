import '../src'
import Server from './utils/Server'

jest.retryTimes(5)

fInit({ headers: { 'Init-Header': 'init-header-value' }, body: 'init-body' })

const server = new Server()

beforeEach(async (): Promise<void> => {
  await server.start()
})

afterEach(async (): Promise<void> => {
  await server.stop()
})

describe(fInit, (): void => {
  it('sets the request init object globally (see top)', async (): Promise<void> => {
    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({ 'Init-Header': 'init-header-value' }), body: 'init-body', url: '/', method: 'POST' })
  })

  it('sets the request init object per test', async (): Promise<void> => {
    fInit({ headers: { 'Init-Header': 'local-init-header-value' }, body: 'local-init-body' })

    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toEqual({ headers: expect.objectContaining({ 'Init-Header': 'local-init-header-value' }), body: 'local-init-body', url: '/', method: 'POST' })
  })
})
