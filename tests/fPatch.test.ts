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

describe(fPatch, (): void => {
  it('makes a PATCH request', async (): Promise<void> => {
    await fPatch('/patch-url/yes', { patch: true })

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toMatchObject({ headers: { 'Content-Type': 'application/json' }, method: 'PATCH', url: '/patch-url/yes', body: { patch: true } })
  })
})
