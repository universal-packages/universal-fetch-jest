import FormData from 'form-data'
import { createReadStream } from 'fs'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import fetch, { RequestInit, Response } from 'node-fetch'

import './globals'

// GLOBAL SHARED CONTEXT INIT REQUEST DATA ///////////////////////////////////////////

const DEFAULT_HOST = 'localhost'
const DEFAULT_PORT = 4000 + Number(process.env['JEST_WORKER_ID'])

const FETCH_CONTEXT: any = {
  global: {},
  test: {},
  inTestContext: false
}

global.fDefaultPort = DEFAULT_PORT

// JEST CONTEXT SETTERS //////////////////////////////////////////////////////////////

beforeEach(() => {
  FETCH_CONTEXT.inTestContext = true
})

afterEach(() => {
  FETCH_CONTEXT.inTestContext = false
  FETCH_CONTEXT.test = {}

  delete global.fResponse
})

// INIT REQUEST QUICK SETTERS ////////////////////////////////////////////////////////

global.fAuthorization = function fAuthorization(token: string): void {
  if (FETCH_CONTEXT.inTestContext) {
    if (!FETCH_CONTEXT.test.headers) FETCH_CONTEXT.test.headers = {}

    FETCH_CONTEXT.test.headers['Authorization'] = token
  } else {
    if (!FETCH_CONTEXT.global.headers) FETCH_CONTEXT.global.headers = {}

    FETCH_CONTEXT.global.headers['Authorization'] = token
  }
}

global.fContentType = function fContentType(type: string): void {
  if (FETCH_CONTEXT.inTestContext) {
    if (!FETCH_CONTEXT.test.headers) FETCH_CONTEXT.test.headers = {}

    FETCH_CONTEXT.test.headers['Content-Type'] = type
  } else {
    if (!FETCH_CONTEXT.global.headers) FETCH_CONTEXT.global.headers = {}

    FETCH_CONTEXT.global.headers['Content-Type'] = type
  }
}

global.fHeaders = function fHeaders(headers: Record<string, any>): void {
  if (FETCH_CONTEXT.inTestContext) {
    FETCH_CONTEXT.test.headers = headers
  } else {
    FETCH_CONTEXT.global.headers = headers
  }
}

global.fHost = function fHost(host: string): void {
  if (FETCH_CONTEXT.inTestContext) {
    FETCH_CONTEXT.test.host = host
  } else {
    FETCH_CONTEXT.global.host = host
  }
}

global.fInit = function fInit(init: RequestInit): void {
  if (FETCH_CONTEXT.inTestContext) {
    FETCH_CONTEXT.test = init
  } else {
    FETCH_CONTEXT.global = init
  }
}

global.fPort = function fPort(port: number): void {
  if (FETCH_CONTEXT.inTestContext) {
    FETCH_CONTEXT.test.port = port
  } else {
    FETCH_CONTEXT.global.port = port
  }
}

// FORM DATA QUICK SETTERS //////////////////////////////////////////////////////////

global.fBuildFormData = function fBuildFormData(body: Record<string, any>, files?: Record<string, string>): FormData {
  const formData = new FormData()

  const bodyKeys = Object.keys(body)

  for (let i = 0; i < bodyKeys.length; i++) {
    formData.append(bodyKeys[i], typeof body[bodyKeys[i]] === 'string' ? body[bodyKeys[i]] : JSON.stringify(body[bodyKeys[i]]))
  }

  if (files) {
    const imagesKeys = Object.keys(files)

    for (let i = 0; i < imagesKeys.length; i++) {
      const file = imagesKeys[i]

      if (Array.isArray(files[file])) {
        files[file].forEach((f) => formData.append(file, createReadStream(f)))
      } else {
        formData.append(file, createReadStream(files[file]))
      }
    }
  }

  return formData
}

// QUICK BY METHOD FETCHERS //////////////////////////////////////////////////////////

global.fDelete = async function fDelete(path?: string): Promise<void> {
  global.fResponse = await fetch(buildUrl(path), buildInit('DELETE'))
  await setResponseBody()
}

global.fGet = async function fGet(path?: string, query?: Record<string, any>): Promise<void> {
  global.fResponse = await fetch(buildUrl(path, query), buildInit('GET'))
  await setResponseBody()
}

global.fHead = async function fHead(path?: string): Promise<void> {
  global.fResponse = await fetch(buildUrl(path), buildInit('HEAD'))
  await setResponseBody()
}

global.fOptions = async function fOptions(path?: string): Promise<void> {
  global.fResponse = await fetch(buildUrl(path), buildInit('OPTIONS'))
  await setResponseBody()
}

global.fPatch = async function fPatch(path?: string, body?: any): Promise<void> {
  global.fResponse = await fetch(buildUrl(path), buildInit('PATCH', body))
  await setResponseBody()
}

global.fPost = async function fPost(path?: string, body?: any): Promise<void> {
  global.fResponse = await fetch(buildUrl(path), buildInit('POST', body))
  await setResponseBody()
}

global.fPut = async function fPut(path?: string, body?: any): Promise<void> {
  global.fResponse = await fetch(buildUrl(path), buildInit('PUT', body))
  await setResponseBody()
}

function buildUrl(path?: string, query?: Record<string, any>): string {
  const finalHost = (FETCH_CONTEXT.inTestContext ? FETCH_CONTEXT.test?.host || FETCH_CONTEXT.global?.host : FETCH_CONTEXT.global?.host) || DEFAULT_HOST
  const finalPort = (FETCH_CONTEXT.inTestContext ? FETCH_CONTEXT.test?.port || FETCH_CONTEXT.global?.port : FETCH_CONTEXT.global?.port) || DEFAULT_PORT
  const queryString = query
    ? '?' +
      Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    : ''

  return 'http://' + `${finalHost}:${finalPort}/${path || ''}`.replace(/\/+/g, '/') + queryString
}

function buildInit(method: string, body?: any): RequestInit {
  const selectedBody = body || FETCH_CONTEXT.test?.body || FETCH_CONTEXT.global?.body
  const contentTypeHeaders = selectedBody instanceof FormData ? undefined : { 'Content-Type': 'application/json' }

  return {
    ...FETCH_CONTEXT.global,
    method: method.toUpperCase(),
    headers: { ...contentTypeHeaders, ...FETCH_CONTEXT.global?.headers, ...FETCH_CONTEXT.test?.headers },
    body: selectedBody ? (typeof selectedBody === 'string' ? selectedBody : selectedBody instanceof FormData ? selectedBody : JSON.stringify(selectedBody)) : undefined
  }
}

async function setResponseBody(): Promise<void> {
  const contentType = fResponse.headers?.get('content-type')

  try {
    if (contentType && contentType.includes('application/json')) {
      global.fResponseBody = await fResponse.json()
    } else if (contentType && contentType.includes('text/plain')) {
      global.fResponseBody = await fResponse.text()
    } else {
      global.fResponseBody = await fResponse.buffer()
    }
  } catch {
    global.fResponseBody = undefined
  }
}

// JEST MATCHERS ////////////////////////////////////////////////////////////////////

function toHaveReturnedWithStatus(response: Response, status: keyof typeof StatusCodes | number): jest.CustomMatcherResult {
  const statusNumber = typeof status === 'string' ? StatusCodes[status] : status

  const pass = this.equals(response.status, statusNumber)

  if (pass) {
    const expectedString = this.utils.printReceived(`${statusNumber} (${getReasonPhrase(statusNumber)})`)

    return {
      message: () => `expected response status to not be ${expectedString} but it was`,
      pass
    }
  } else {
    const expectedString = this.utils.printExpected(`${statusNumber} (${getReasonPhrase(statusNumber)})`)
    const receivedString = this.utils.printReceived(`${response.status} (${getReasonPhrase(response.status)})`)

    return {
      pass,
      message: () => `expected response status ${expectedString} but was ${receivedString} instead`
    }
  }
}

expect.extend({
  toHaveReturnedWithStatus
})
