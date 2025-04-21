import FormData from 'form-data'
import { StatusCodes } from 'http-status-codes'
import { RequestInit, Response } from 'node-fetch'

declare global {
  function fDelete(path?: string): Promise<void>
  function fGet(path?: string, query?: any): Promise<void>
  function fHead(path?: string): Promise<void>
  function fOptions(path?: string): Promise<void>
  function fPatch(path?: string, body?: any): Promise<void>
  function fPost(path?: string, body?: any): Promise<void>
  function fPut(path?: string, body?: any): Promise<void>

  function fBuildFormData(body: Record<string, any>, files?: Record<string, string | string[]>): FormData

  function fInit(init: RequestInit): void
  function fContentType(type: string): void
  function fAuthorization(token: string): void
  function fHeaders(headers: Record<string, any>): void
  function fHost(host: string): void
  function fPort(port: number): void

  var fDefaultPort: number
  var fResponse: Response
  var fResponseBody: any

  namespace jest {
    interface Matchers<R> {
      toHaveReturnedWithStatus(status: keyof typeof StatusCodes | number): R
    }
  }
}

export {}
