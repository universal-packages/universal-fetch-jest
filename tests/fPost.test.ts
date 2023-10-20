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

describe(fPost, (): void => {
  it('makes a POST request', async (): Promise<void> => {
    await fPost('/post-url/yes', { post: true })

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toMatchObject({ headers: { 'Content-Type': 'application/json' }, method: 'POST', url: '/post-url/yes', body: { post: true } })
  })
})
