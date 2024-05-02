import isomorphicFetch from 'isomorphic-fetch'
import { parser } from 'stream-json';
import { streamValues } from 'stream-json/streamers/StreamValues';
import { finished } from 'stream/promises';

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

  const data = await response.arrayBuffer()

  // Determine the request success and response content type
  if (response.headers.get('content-type') === 'application/octet-stream') {
    // Success
    return data
  }


  const jsonParser = parser();
  response.body.pipe(jsonParser.input);
  const resultStream = jsonParser.pipe(streamValues());
  let parsedJSON: any = [];
  resultStream.on('data', ({ value }) => {
    parsedJSON.push(value);
  });
  await finished(resultStream); // Wait until the stream is finished

  // Assuming the JSON is an array, directly return the results array
  // If it's expected to be a single object, you might need to aggregate differently
  if (parsedJSON.length === 1 && !Array.isArray(parsedJSON[0])) {
    parsedJSON = parsedJSON[0] as R; // Single object case
  }
  parsedJSON = parsedJSON as unknown as R; // Array or complex object case

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