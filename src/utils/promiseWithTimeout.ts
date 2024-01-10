/** Provides a timedout promise.
 * @param {Object} obj All parameters for this function are provided in an object
 * @param {Number} obj.timeout Timeout in milliseconds, promise interupted, control returned, if not completed after `timeout` milliseconds.
 * @param {Function} obj.promise The promised function to be run to completion or interupted, control returned, after `timeout` milliseconds.
 * @param {Error} obj.error The error that is thrown if the time expires. Defaults to `new Error('Timed out')`
 */
export default async function promiseWithTimeout<T>(obj: {
  timeout: number,
  promise: Promise<T>,
  error?: Error
}) : Promise<T> {

  if (!obj.error) obj.error = new Error('Timed out')

  return Promise.race([
    obj.promise,
    new Promise<never>((resolve, reject) => setTimeout(() => reject(obj.error), obj.timeout))
  ])
}
