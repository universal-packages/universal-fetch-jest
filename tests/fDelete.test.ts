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

describe(fDelete, (): void => {
  it('makes a DELETE request', async (): Promise<void> => {
    await fDelete('/delete-url/yes')

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toMatchObject({ method: 'DELETE', url: '/delete-url/yes' })
  })
})
