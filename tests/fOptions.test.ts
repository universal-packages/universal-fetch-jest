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

describe(fOptions, (): void => {
  it('makes a OPTIONS request', async (): Promise<void> => {
    await fOptions('/options-url/yes')

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toMatchObject({ method: 'OPTIONS', url: '/options-url/yes' })
  })
})
