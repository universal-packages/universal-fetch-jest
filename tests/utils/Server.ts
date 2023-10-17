import http, { Server as IS } from 'http'

export default class Server {
  private internalServer: IS
  private host: string
  private port: number

  public constructor(host?: string, port?: number) {
    this.host = host || 'localhost'
    this.port = port || 4000 + Number(process.env.JEST_WORKER_ID)

    this.internalServer = http.createServer((request, response) => {
      const parsedHEaders = request.rawHeaders.reduce(
        (acc, header, index) => {
          if (index % 2 === 0) {
            acc[header] = request.rawHeaders[index + 1]
          }

          return acc
        },
        {} as Record<string, string>
      )
      const chunks = []
      let receivedBody = ''

      request.on('data', (chunk) => {
        chunks.push(chunk)
      })

      request.on('end', () => {
        try {
          receivedBody = JSON.parse(Buffer.concat(chunks).toString())
        } catch {
          receivedBody = Buffer.concat(chunks).toString()
        }

        response.setHeader('Content-Type', 'application/json')
        response.writeHead(200)
        response.end(JSON.stringify({ headers: parsedHEaders, body: receivedBody, url: request.url, method: request.method }))
      })
    })

    this.internalServer.keepAliveTimeout = 60 * 1000 + 1000
    this.internalServer.headersTimeout = 60 * 1000 + 2000
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.internalServer.listen(this.port, this.host, resolve)
      } catch (error) {
        reject(error)
      }
    })
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.internalServer.close((error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
