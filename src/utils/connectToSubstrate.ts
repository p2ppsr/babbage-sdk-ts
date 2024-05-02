import makeHttpRequest from './makeHttpRequest'
import promiseWithTimeout from './promiseWithTimeout'
import getRandomID from './getRandomID'

/**
 * Obtains the version by using the local window.CWI instance.
 * Fails if no CWI instance exists within the local window.
 */
const getWindowVersion = (): string => window["CWI"].getVersion()

/**
 * Uses cross-document messaging to obtain a substrate connection.
 * Fails after 200ms if no version response is received.
 */
const getXDMVersion = (): Promise<string> => {
  const versionPromise = new Promise<string>((resolve, reject) => {
    try {
      const id = Buffer.from(getRandomID()).toString('base64')
      window.addEventListener('message', async e => {
        try {
          if
            (e.data.type !== 'CWI' ||
            !e.isTrusted ||
            e.data.id !== id ||
            typeof e.data !== 'object' ||
            typeof e.data.result !== 'string'
          ) {
            return
          }
          resolve(e.data.result)
        } catch (e) {
          reject(e)
        }
      })
      window.parent.postMessage({
        type: 'CWI',
        id,
        call: 'getVersion'
      }, '*')
    } catch (e) {
      reject(e)
    }
  })
  return promiseWithTimeout({
    promise: versionPromise,
    timeout: 200
  })
}

/**
 * Uses the HTTP local port 3301 API to request the version.
 * Fails if HTTP errors are encountered, or no server is running.
 */
const getHTTPVersion = (): Promise<string> => makeHttpRequest<string>(
  'http://localhost:3301/v1/version',
  {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
)

export class Communicator {
  private static cached: Communicator | undefined

  private constructor(public substrate: string, public version: string) {
  }

  static setCached(substrate: string, version: string): Communicator {
    Communicator.cached ||= new Communicator(substrate, version)
    return Communicator.cached
  }

  static getCached(): Communicator | undefined {
    return Communicator.cached
  }

  async dispatch<P extends object>(args: {
    name: string,
    params: P,
    isGet?: boolean,
    bodyParamKey?: string,
    bodyJsonParams?: boolean
    contentType?: string,
    nameHttp?: string,
    isNinja?: boolean,
  }): Promise<unknown> {
    switch (this.substrate) {
      case 'cicada-api': {
        let q = ''
        if (!args.bodyJsonParams) {
          for (const [k, v] of Object.entries(args.params)) {
            if (k === args.bodyParamKey) continue
            q += !q ? '?' : '&'
            q += `${k}=${encodeURIComponent(v)}`
          }
        }
        q = `http://localhost:3301/v1/${args.isNinja ? 'ninja/' : ''}${args.nameHttp || args.name}${q}`
        const ri: RequestInit =
          args.bodyJsonParams
            ? {
              method: args.isGet ? 'get' : 'post',
              headers: {
                'Content-Type': !args.contentType ? 'application/json' : args.contentType
              },
              body: JSON.stringify(args.params)
            }
            : args.bodyParamKey
              ? {
                method: args.isGet ? 'get' : 'post',
                headers: {
                  'Content-Type': !args.contentType ? 'application/octet-stream' : args.contentType
                },
                body: args.params[args.bodyParamKey]
              }
              : {
                method: args.isGet ? 'get' : 'post',
                headers: {
                  'Content-Type': !args.contentType ? 'application/json' : args.contentType
                }
              }
        const httpResult = await makeHttpRequest(q, ri)
        return httpResult
      } break;
      case 'babbage-xdm': {
        return new Promise((resolve, reject) => {
          const id = Buffer.from(getRandomID()).toString('base64')
          window.addEventListener('message', async e => {
            if (e.data.type !== 'CWI' || !e.isTrusted || e.data.id !== id || e.data.isInvocation) return
            if (e.data.status === 'error') {
              const err = new Error(e.data.description)
              err["code"] = e.data["code"]
              reject(err)
            } else {
              resolve(e.data.result)
            }
          })
          window.parent.postMessage({
            type: 'CWI',
            isInvocation: true,
            id,
            call: `${args.isNinja ? 'ninja.' : ''}${args.name}`,
            params: args.params
          }, '*')
        })
      } break;
      case 'window-api': {
        return args.isNinja
          ? window["CWI"].ninja[args.name](args.params)
          : window["CWI"][args.name](args.params)
      } break;
      default: {
        const e = new Error(`Unknown Babbage substrate: ${this.substrate}`)
        e["code"] = 'ERR_UNKNOWN_SUBSTRATE'
        throw e
      } break;
    }
  }
}

export default async function connectToSubstrate(): Promise<Communicator> {

  let cached = Communicator.getCached()

  // If a cached substrate exists, it is immediately returned.
  if (
    cached &&
    (
      cached.substrate === 'babbage-xdm' ||
      cached.substrate === 'cicada-api' ||
      cached.substrate === 'window-api'
    ) &&
    typeof cached.version === 'string'
  ) {
    return cached
  }

  const noIdentityErrorMessage = 'The user does not have a current MetaNet Identity. Initialize a MetaNet Client onto one of the supported substrates. Supported substrates are "window-api", "babbage-xdm", and "cicada-api".'
  const noIdentitySupportedSubstrates = ['window-api', 'babbage-xdm', 'cicada-api']
  const makeErr = (): Error => {
    // If there's no window object for XDM or window.CWI and HTTP fails
    // then there is no currently-possible way to connect.
    const err = new Error(noIdentityErrorMessage)
    err["code"] = 'ERR_NO_METANET_IDENTITY'
    err["supportedSubstrates"] = noIdentitySupportedSubstrates
    return err
  }

  if (typeof window !== 'object') { // Node always uses HTTP
    try {
      return Communicator.setCached('cicada-api', await getHTTPVersion())
    } catch (_) {
      console.error(_)
      throw makeErr()
    }
  }

  // Probe each substrate until a response is received.

  // 1. Local Window — window.CWI — "window-api"
  if (!cached) {
    try {
      cached = Communicator.setCached('window-api', await getWindowVersion())
    } catch (_) { /* window.CWI errored, proceed to next substrate. */ }
  }

  // 2. XDM — Cross-document Messaging — "babbage-xdm"
  if (!cached) {
    try {
      cached = Communicator.setCached('babbage-xdm', await getXDMVersion())
    } catch (_) { /* XDM errored, proceed to next substrate. */ }
  }

  // 3. HTTP — Port 3301 — "cicada-api"
  if (!cached) {
    try {
      cached = Communicator.setCached('cicada-api', await getHTTPVersion())
    } catch (_) { /* HTTP errored, proceed to next substrate. */ }
  }

  // All substrates probed, an ERR_NO_METANET_IDENTITY condition exists if no
  // substrate was successfully connected.
  if (!cached) {
    throw makeErr()
  }

  // Check the kernel's compatibility before resolving
  if (!cached.version.startsWith('0.3.') && !cached.version.startsWith('0.4.')) {
    const e = new Error(`Your MetaNet Client is running an incompatible kernel version ${cached.version} This SDK requires a 0.4.x kernel`)
    e["code"] = 'ERR_INCOMPATIBLE_KERNEL'
    e["compatibleKernels "] = '0.3.x or 0.4.x'
    e["invalidVersion "] = cached.version
    throw e
  }

  // Saving the version and substrate for future requests improves performance.
  return cached
}