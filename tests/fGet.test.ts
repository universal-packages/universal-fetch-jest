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

describe(fGet, (): void => {
  it('makes a GET request', async (): Promise<void> => {
    await fGet('get-url/10', { query: 'query' })

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toMatchObject({ method: 'GET', url: '/get-url/10?query=query' })
  })
})
