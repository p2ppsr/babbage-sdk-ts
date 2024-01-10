import isomorphicFetch from 'isomorphic-fetch'

const fetch =
  typeof window !== 'object'
    ? isomorphicFetch
    : window.fetch

export default async function makeHttpRequest<R>(
  routeURL: string,
  requestInput: RequestInit = {}
) : Promise<R>
{

  // If we're in a node environment, we need to inject the Orign header
  if (typeof window !== 'object') {
    requestInput.headers = {
      ...requestInput.headers,
      Origin: 'http://localhost'
    }
  }

  const response = await fetch(
    routeURL,
    requestInput
  )

  // Determine the request success and response content type
  if (response.headers.get('content-type') === 'application/octet-stream') {
    // Success
    return await response.arrayBuffer()
  }
  
  const parsedJSON = await response.json()
  if (parsedJSON.status === 'error') {
    const e = new Error(parsedJSON.description)
    e["code"] = parsedJSON.code || 'ERR_BAD_REQUEST'
    Object.keys(parsedJSON).forEach(key => {
      if (key !== 'description' && key !== 'code' && key !== 'status') {
        e[key] = parsedJSON[key]
      }
    })
    throw e
  }

  return parsedJSON.result as R

}