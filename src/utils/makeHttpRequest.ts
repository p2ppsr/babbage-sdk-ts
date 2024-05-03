import isomorphicFetch from 'isomorphic-fetch'
import { parser } from 'stream-json'
import { streamValues } from 'stream-json/streamers/StreamValues'

const fetch =
  typeof window !== 'object'
    ? isomorphicFetch
    : window.fetch

export default async function makeHttpRequest<R>(
  routeURL: string,
  requestInput: RequestInit = {}
): Promise<R> {

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
    return await response.arrayBuffer()
  }

  let parsedJSON: any = [];
  if (typeof window !== 'object') {
    const jsonParser = parser();
    const resultStream = response.body.pipe(jsonParser).pipe(streamValues());
    const dataPromise = new Promise((resolve, reject) => {
      resultStream.on('data', ({ value }) => {
        parsedJSON.push(value);
      });
      resultStream.on('end', () => {
        resolve(parsedJSON);
      });
      resultStream.on('error', (err) => {
        reject(err);
      });
    });

    await dataPromise; // Wait until the stream is finished

    // Assuming the JSON is an array, directly return the results array
    // If it's expected to be a single object, you might need to aggregate differently
    if (parsedJSON.length === 1 && !Array.isArray(parsedJSON[0])) {
      parsedJSON = parsedJSON[0] as R; // Single object case
    }
    parsedJSON = parsedJSON as unknown as R; // Array or complex object case
  } else {
    // Browser environment: use the ReadableStream interface
    const reader = response.body.getReader();
    let results = '';
    let read;
    do {
      read = await reader.read();
      if (!read.done) {
        results += new TextDecoder('utf-8').decode(read.value, { stream: true });
      }
    } while (!read.done);
    reader.releaseLock();
    parsedJSON = JSON.parse(results) as R
  }

  if (parsedJSON.status === 'error') {
    const e = new Error(parsedJSON.description)
    e["code"] = parsedJSON["code"] || 'ERR_BAD_REQUEST'
    Object.keys(parsedJSON).forEach(key => {
      if (key !== 'description' && key !== 'code' && key !== 'status') {
        e[key] = parsedJSON[key]
      }
    })
    throw e
  }

  return parsedJSON.result as R

}