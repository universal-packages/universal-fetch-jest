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

describe(fBuildFormData, (): void => {
  it('creates a forma data object from a body and from a file', async (): Promise<void> => {
    await fPost('/post-url/yes', fBuildFormData({ post: true }, { file: './tests/__fixtures__/test.txt' }))

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toMatchObject({
      headers: { 'Content-Type': expect.stringMatching(/multipart\/form-data;boundary=/) },
      method: 'POST',
      url: '/post-url/yes',
      body: expect.stringMatching(/Content-Disposition: form-data; name="file"; filename="test.txt"/)
    })
  })

  it('creates a forma data object from a body and from multiple files', async (): Promise<void> => {
    await fPost('/post-url/yes', fBuildFormData({ post: true }, { file: ['./tests/__fixtures__/test.txt', './tests/__fixtures__/test2.txt'] }))

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponseBody).toMatchObject({
      headers: { 'Content-Type': expect.stringMatching(/multipart\/form-data;boundary=/) },
      method: 'POST',
      url: '/post-url/yes',
      body: expect.stringMatching(/Content-Disposition: form-data; name="file"; filename="test.txt"[\s\S]*Content-Disposition: form-data; name="file"; filename="test2.txt"/)
    })
  })
})
