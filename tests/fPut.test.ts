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

describe(fPut, (): void => {
  it('makes a PUT request', async (): Promise<void> => {
    await fPut('/put-url/yes', { put: true })

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toMatchObject({ method: 'PUT', url: '/put-url/yes', body: { put: true } })
  })
})
