import stripAnsi from 'strip-ansi'

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

describe('toHaveReturnedWithStatus', (): void => {
  it('passes if the response status matches the expectation', async (): Promise<void> => {
    await fPost()

    expect(fResponse).toHaveReturnedWithStatus(200)
    expect(fResponse).not.toHaveReturnedWithStatus('CREATED')
  })

  it('fails if the response status does not match the expectation', async (): Promise<void> => {
    await fPost()

    let error: Error

    try {
      expect(fResponse).toHaveReturnedWithStatus('CREATED')
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected response status "201 (Created)" but was "200 (OK)" instead')
  })

  it('fails if the response status was returned but it was not expected', async (): Promise<void> => {
    await fPost()

    let error: Error

    try {
      expect(fResponse).not.toHaveReturnedWithStatus(200)
    } catch (e) {
      error = e
    }

    expect(stripAnsi(error.message)).toEqual('expected response status to not be "200 (OK)" but it was')
  })
})
