# Fetch Jest

[![npm version](https://badge.fury.io/js/@universal-packages%2Ffetch-jest.svg)](https://www.npmjs.com/package/@universal-packages/fetch-jest)
[![Testing](https://github.com/universal-packages/universal-fetch-jest/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-fetch-jest/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-fetch-jest/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-fetch-jest)

Jest tooling for fetch. This library does not mock fetch but instead provides a way to actually test an http socket using the fetch api, providing quicker ways to reach the endpoints.

By default all request are made to `http://localhost:<4000 + JEST_WORKER_ID>`, see [Configurations](#Configurations).

## Install

```shell
npm install @universal-packages/fetch-jest
```

## Setup

Add the following to your `jest.config.js` or where you configure Jest:

```js
module.exports = {
  setupFilesAfterEnv: ['@universal-packages/fetch-jest']
}
```

## Jest Globals

### Fetchers

#### **`fDelete([path: string])`**

Makes a DELETE request to the given path.

```js
it('should delete the todo', async () => {
  await fDelete('/todos/1')

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

#### **`fGet([path: string, query: Object])`**

Makes a GET request to the given path.

```js
it('should return the todo list', async () => {
  await fGet('/todos')

  expect(fResponse).toHaveReturnedWithStatus('OK')
  expect(fResponseBody).toEqual({ todos: [{ id: 1, text: 'Buy milk' }] })
})
```

#### **`fPatch([path: string, body: Object])`**

Makes a PATCH request to the given path.

```js
it('should update the todo', async () => {
  await fPatch('/todos/1', { text: 'Buy milk and eggs' })

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

#### **`fPost([path: string, body: Object])`**

Makes a POST request to the given path.

```js
it('should create a todo', async () => {
  await fPost('/todos', { text: 'Buy milk' })

  expect(fResponse).toHaveReturnedWithStatus('OK')
  expect(fResponseBody).toEqual({ id: 1, text: 'Buy milk' })
})
```

#### **`fPut([path: string, body: Object])`**

Makes a PUT request to the given path.

```js
it('should update the todo', async () => {
  await fPut('/todos/1', { text: 'Buy milk and eggs' })

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

#### **`fBuildFormData([body: Object, files: Object])`**

Builds a `FormData` object with the given body and files, the files values are paths to the local files to be uploaded.

```js
it('should upload the file', async () => {
  const formData = fBuildFormData({ text: 'Buy milk' }, { photo: './photo.jpg' })

  await fPost('/todos', formData)

  expect(fResponse).toHaveReturnedWithStatus('OK')
  expect(fResponseBody).toEqual({ id: 1, text: 'Buy milk', filesCount: 1 })
})
```

### Configurations

#### **`fAuthorization(token: string)`**

It setups all future requests to have the `Authorization` header with the given token.

```js
// Global for all test cases
fAuthorization('token')

it('should return the todo list', async () => {
  // Per test case
  fAuthorization('token1')

  fGet('/todos')

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

#### **`fContentType(type: string)`**

It setups all future requests to have the `Content-Type` header with the given type.

```js
// Global for all test cases
fContentType('application/json')

it('should return the todo list', async () => {
  // Per test case
  fContentType('html/text')

  fGet('/todos')

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

#### **`fHeaders(headers: Object)`**

It setups all future requests to have the given headers.

```js
// Global for all test cases
fHeaders({ 'X-Header': 'value' })

it('should return the todo list', async () => {
  // Per test case
  fHeaders({ 'X-Header': 'value1' })

  fGet('/todos')

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

#### **`fHost(host: string)`**

It setups all future requests to be made to the given host.

```js
// Global for all test cases
fHost('192.168.0.1')

it('should return the todo list', async () => {
  // Per test case
  fHost('localhost')

  fGet('/todos')

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

#### **`fInit(init: OBject)`**

It setups all future requests to have the given init.

```js
// Global for all test cases
fInit({ host: 'localhost', port: 3000, protocol: 'https' })

it('should return the todo list', async () => {
  // Per test case
  fInit({ host: '0.0.0.0', port: 3000, protocol: 'http' })

  fGet('/todos')

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

#### **`fPort(port: number)`**

It setups all future requests to be made to the given port.

```js
// Global for all test cases
fPort(3000)

it('should return the todo list', async () => {
  // Per test case
  fPort(4000)

  fGet('/todos')

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

## Matchers

### **`toHaveReturnedWithStatus(status: string | number)`**

It checks if the response status is the given status.

```js
it('should return the todo list', async () => {
  await fGet('/todos')

  expect(fResponse).toHaveReturnedWithStatus('OK')
})
```

## Typescript
In order for typescript to see the global types you need to reference the types somewhere in your project, normally `./src/globals.d.ts`.

```ts
/// <reference types="@universal-packages/fetch-jest" />
```

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
