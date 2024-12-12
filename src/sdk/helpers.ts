import { Utils } from "@bsv/sdk";
import { sdk, WERR_INVALID_PARAMETER } from "..";
import { OutPoint, TrustSelf } from "../types";

export function parseWalletOutpoint(outpoint: string): { txid: string; vout: number; } {
    const [ txid, vout ] = outpoint.split('.')
    return { txid, vout: Number(vout)}
}

function defaultTrue(v?: boolean) { return v === undefined ? true : v }
function defaultFalse(v?: boolean) { return v === undefined ? false : v }
function defaultZero(v?: number) { return v === undefined ? 0 : v }
function default0xffffffff(v?: number) { return v === undefined ? 0xffffffff : v }
function defaultOne(v?: number) { return v === undefined ? 1 : v }
function defaultEmpty<T>(v?: T[]) { return v === undefined ? [] : v }

function validateOptionalStringLength(s: string | undefined, name: string, min?: number, max?: number): string | undefined {
    if (s === undefined) return undefined
    return validateOptionalStringLength(s, name, min, max)
}

export function validateSatoshis(v: number | undefined, name: string, min?: number): number {
  if (v === undefined || !Number.isInteger(v) || v < 0 || v > 21e14)
    throw new WERR_INVALID_PARAMETER(name, 'a valid number of satoshis')
  if (min !== undefined && v < min)
      throw new WERR_INVALID_PARAMETER(name, `at least ${min} satoshis.`)
  return v
}

export function validateOptionalInteger(v: number | undefined, name: string, min?: number, max?: number): number | undefined {
  if (v === undefined) return undefined
  return validateInteger(v, name, undefined, min, max)
}

export function validateInteger(v: number | undefined, name: string, defaultValue?: number, min?: number, max?: number): number {
  if (v === undefined) {
    if (defaultValue !== undefined) return defaultValue
    throw new WERR_INVALID_PARAMETER(name, 'a valid integer')
  }
  if (!Number.isInteger(v))
    throw new WERR_INVALID_PARAMETER(name, 'an integer')
  v = Number(v)
  if (min !== undefined && v < min)
      throw new WERR_INVALID_PARAMETER(name, `at least ${min} length.`)
  if (max !== undefined && v > max)
      throw new WERR_INVALID_PARAMETER(name, `no more than ${max} length.`)
  return v
}

export function validateStringLength(s: string, name: string, min?: number, max?: number): string {
  const bytes = Utils.toArray(s, 'utf8').length
  if (min !== undefined && bytes < min)
    throw new WERR_INVALID_PARAMETER(name, `at least ${min} length.`)
  if (max !== undefined && bytes > max)
    throw new WERR_INVALID_PARAMETER(name, `no more than ${max} length.`)
  return s
}

function validateOptionalHexString(s: string | undefined, name: string): string | undefined {
    if (s === undefined) return undefined
    return validateHexString(s, name)
}

function validateHexString(s: string, name: string): string {
    if (s.length % 2 === 1)
        throw new WERR_INVALID_PARAMETER(name, `even length, not ${s.length}.`)
    const hexRegex = /^[0-9A-Fa-f]+$/;
    if (!hexRegex.test(s))
        throw new WERR_INVALID_PARAMETER(name, `hexadecimal string.`)
    return s
}


export interface ValidCreateActionInput {
  outpoint: OutPoint
  inputDescription: sdk.DescriptionString5to50Bytes
  sequenceNumber: sdk.PositiveIntegerOrZero
  unlockingScript?: sdk.HexString
  unlockingScriptLength: sdk.PositiveInteger
}

export function validateCreateActionInput(i: sdk.CreateActionInput): ValidCreateActionInput {
    if (i.unlockingScript === undefined && i.unlockingScriptLength === undefined)
        throw new WERR_INVALID_PARAMETER('unlockingScript, unlockingScriptLength', `at least one valid value.`)
    const unlockingScript = validateOptionalHexString(i.unlockingScript, 'unlockingScript')
    const unlockingScriptLength = i.unlockingScriptLength || unlockingScript!.length / 2
    if (unlockingScript && unlockingScriptLength !== unlockingScript.length / 2)
        throw new WERR_INVALID_PARAMETER('unlockingScriptLength', `length unlockingScript if both valid.`)
    const vi: ValidCreateActionInput = {
        outpoint: parseWalletOutpoint(i.outpoint),
        inputDescription: validateStringLength(i.inputDescription, 'inputDescription', 5, 50),
        unlockingScript,
        unlockingScriptLength,
        sequenceNumber: default0xffffffff(i.sequenceNumber)
    }
    return vi
}

export interface ValidCreateActionOutput {
  lockingScript: sdk.HexString
  satoshis: sdk.SatoshiValue
  outputDescription: sdk.DescriptionString5to50Bytes
  basket?: sdk.BasketStringUnder300Bytes
  customInstructions?: string
  tags: sdk.OutputTagStringUnder300Bytes[]
}

export function validateCreateActionOutput(o: sdk.CreateActionOutput): ValidCreateActionOutput {
    const vo: ValidCreateActionOutput = {
        lockingScript: validateHexString(o.lockingScript, 'lockingScript'),
        satoshis: validateSatoshis(o.satoshis, 'satoshis'),
        outputDescription: validateStringLength(o.outputDescription, 'outputDescription', 5, 50),
        basket: validateOptionalStringLength(o.basket, 'basket', 0, 300),
        customInstructions: o.customInstructions,
        tags: defaultEmpty(o.tags).map(t => validateStringLength(t, 'tags', 0, 300))
    }
    return vo
}

/**
 * Set all default true/false booleans to true or false if undefined.
 * Set all possibly undefined numbers to their default values.
 * Set all possibly undefined arrays to empty arrays.
 * Convert string outpoints to `{ txid: string, vout: number }`
 */
export function validateCreateActionOptions(options?: sdk.CreateActionOptions) : ValidCreateActionOptions {
  const o = options || {}
  const vo: ValidCreateActionOptions = {
    signAndProcess: defaultTrue(o.signAndProcess),
    acceptDelayedBroadcast: defaultTrue(o.acceptDelayedBroadcast),
    knownTxids: defaultEmpty(o.knownTxids),
    returnTXIDOnly: defaultFalse(o.returnTXIDOnly),
    noSend: defaultFalse(o.noSend),
    noSendChange: defaultEmpty(o.noSendChange).map(nsc => parseWalletOutpoint(nsc)),
    sendWith: defaultEmpty(o.sendWith),
    randomizeOutputs: defaultTrue(o.randomizeOutputs)
  }
  return vo
}

export interface ValidProcessActionOptions {
  acceptDelayedBroadcast: sdk.BooleanDefaultTrue
  returnTXIDOnly: sdk.BooleanDefaultFalse
  noSend: sdk.BooleanDefaultFalse
  sendWith: sdk.TXIDHexString[]
}

export interface ValidCreateActionOptions extends ValidProcessActionOptions {
  signAndProcess: boolean
  trustSelf?: TrustSelf
  knownTxids: sdk.TXIDHexString[]
  noSendChange: OutPoint[]
  randomizeOutputs: boolean
}

export interface ValidSignActionOptions extends ValidProcessActionOptions {
  acceptDelayedBroadcast: boolean
  returnTXIDOnly: boolean
  noSend: boolean
  sendWith: sdk.TXIDHexString[]
}

export interface ValidProcessActionArgs {
  options: sdk.ValidProcessActionOptions
  // true if a batch of transactions is included for processing.
  isSendWith: boolean
  // true if there is a new transaction (not no inputs and no outputs)
  isNewTx: boolean
  // true if any new transaction should NOT be sent to the network
  isNoSend: boolean
  // true if options.acceptDelayedBroadcast is true
  isDelayed: boolean
  log?: string
}

export interface ValidCreateActionArgs extends ValidProcessActionArgs {
  description: sdk.DescriptionString5to50Bytes
  inputBEEF?: sdk.BEEF
  inputs: sdk.ValidCreateActionInput[]
  outputs: sdk.ValidCreateActionOutput[]
  lockTime: number
  version: number
  labels: string[]

  options: ValidCreateActionOptions
  // true if transaction creation completion will require a `signAction` call.
  isSignAction: boolean
}

export interface ValidSignActionArgs extends ValidProcessActionArgs {
  spends: Record<sdk.PositiveIntegerOrZero, sdk.SignActionSpend>
  reference: sdk.Base64String

  options: sdk.ValidSignActionOptions
}

export function validateCreateActionArgs(args: sdk.CreateActionArgs) : ValidCreateActionArgs {
    const vargs: ValidCreateActionArgs = {
      description: validateStringLength(args.description, 'description', 5, 50),
      inputBEEF: args.inputBEEF,
      inputs: defaultEmpty(args.inputs).map(i => validateCreateActionInput(i)),
      outputs: defaultEmpty(args.outputs).map(o => validateCreateActionOutput(o)),
      lockTime: defaultZero(args.lockTime),
      version: defaultOne(args.version),
      labels: defaultEmpty(args.labels),
      options: validateCreateActionOptions(args.options),
      isSendWith: false,
      isDelayed: false,
      isNoSend: false,
      isNewTx: false,
      isSignAction: false,
    }
    vargs.isSendWith = vargs.options.sendWith.length > 0
    vargs.isNewTx = (vargs.inputs.length > 0) || (vargs.outputs.length > 0)
    vargs.isSignAction = vargs.isNewTx && (vargs.options.signAndProcess === false || vargs.inputs.some(i => i.unlockingScript === undefined))
    vargs.isDelayed = vargs.options.acceptDelayedBroadcast
    vargs.isNoSend = vargs.options.noSend

    if (!vargs.isSendWith && !vargs.isNewTx)
      throw new WERR_INVALID_PARAMETER('args', 'either at least one input or output, or a sendWith.')

    return vargs
}

/**
 * Set all default true/false booleans to true or false if undefined.
 * Set all possibly undefined numbers to their default values.
 * Set all possibly undefined arrays to empty arrays.
 * Convert string outpoints to `{ txid: string, vout: number }`
 */
export function validateSignActionOptions(options?: sdk.SignActionOptions) : ValidSignActionOptions {
  const o = options || {}
  const vo: ValidSignActionOptions = {
    acceptDelayedBroadcast: defaultTrue(o.acceptDelayedBroadcast),
    returnTXIDOnly: defaultFalse(o.returnTXIDOnly),
    noSend: defaultFalse(o.noSend),
    sendWith: defaultEmpty(o.sendWith)
  }
  return vo
}

export function validateSignActionArgs(args: sdk.SignActionArgs) : ValidSignActionArgs {
    const vargs: ValidSignActionArgs = {
      spends: args.spends,
      reference: args.reference,
      options: validateSignActionOptions(args.options),
      isSendWith: false,
      isDelayed: false,
      isNoSend: false,
      isNewTx: true
    }
    vargs.isSendWith = vargs.options.sendWith.length > 0
    vargs.isDelayed = vargs.options.acceptDelayedBroadcast
    vargs.isNoSend = vargs.options.noSend

    return vargs
}

export interface ValidListOutputsArgs {
  basket: sdk.BasketStringUnder300Bytes
  tags: sdk.OutputTagStringUnder300Bytes[]
  tagQueryMode: 'all' | 'any'
  includeLockingScripts: boolean,
  includeTransactions: boolean,
  includeCustomInstructions: sdk.BooleanDefaultFalse
  includeTags: sdk.BooleanDefaultFalse
  includeLabels: sdk.BooleanDefaultFalse
  limit: sdk.PositiveIntegerDefault10Max10000
  offset: sdk.PositiveIntegerOrZero
  seekPermission: sdk.BooleanDefaultTrue
  knownTxids: string[]
  log?: string
}

/**
   * @param {BasketStringUnder300Bytes} args.basket - Required. The associated basket name whose outputs should be listed.
   * @param {OutputTagStringUnder300Bytes[]} [args.tags] - Optional. Filter outputs based on these tags.
   * @param {'all' | 'any'} [args.tagQueryMode] - Optional. Filter mode, defining whether all or any of the tags must match. By default, any tag can match.
   * @param {'locking scripts' | 'entire transactions'} [args.include] - Optional. Whether to include locking scripts (with each output) or entire transactions (as aggregated BEEF, at the top level) in the result. By default, unless specified, neither are returned.
   * @param {BooleanDefaultFalse} [args.includeEntireTransactions] - Optional. Whether to include the entire transaction(s) in the result.
   * @param {BooleanDefaultFalse} [args.includeCustomInstructions] - Optional. Whether custom instructions should be returned in the result.
   * @param {BooleanDefaultFalse} [args.includeTags] - Optional. Whether the tags associated with the output should be returned.
   * @param {BooleanDefaultFalse} [args.includeLabels] - Optional. Whether the labels associated with the transaction containing the output should be returned.
   * @param {PositiveIntegerDefault10Max10000} [args.limit] - Optional limit on the number of outputs to return.
   * @param {PositiveIntegerOrZero} [args.offset] - Optional. Number of outputs to skip before starting to return results.
   * @param {BooleanDefaultTrue} [args.seekPermission] — Optional. Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export function validateListOutputsArgs(args: sdk.ListOutputsArgs) : ValidListOutputsArgs {
    let tagQueryMode: 'any' | 'all'
    if (args.tagQueryMode === undefined || args.tagQueryMode === 'any')
      tagQueryMode = 'any'
    else if (args.tagQueryMode === 'all')
      tagQueryMode = 'all'
    else
      throw new WERR_INVALID_PARAMETER('tagQueryMode', `undefined, 'any', or 'all'`)

    const vargs: ValidListOutputsArgs = {
      basket: validateStringLength(args.basket, 'basket', 0, 300),
      tags: (args.tags || []).map(t => validateStringLength(t, 'tag', 0, 300)),
      tagQueryMode,
      includeLockingScripts: args.include === 'locking scripts',
      includeTransactions: args.include === 'entire transactions',
      includeCustomInstructions: defaultFalse(args.includeCustomInstructions),
      includeTags: defaultFalse(args.includeTags),
      includeLabels: defaultFalse(args.includeLabels),
      limit: validateInteger(args.limit, 'limit', 10, 1, 10000),
      offset: validateInteger(args.offset, 'offset', 0, 0, undefined),
      seekPermission: defaultTrue(args.seekPermission),
      knownTxids: [],
    }

    return vargs
}

export interface ValidListActionsArgs {
  labels: sdk.LabelStringUnder300Bytes[]
  labelQueryMode: 'any' | 'all'
  includeLabels: sdk.BooleanDefaultFalse
  includeInputs: sdk.BooleanDefaultFalse
  includeInputSourceLockingScripts: sdk.BooleanDefaultFalse
  includeInputUnlockingScripts: sdk.BooleanDefaultFalse
  includeOutputs: sdk.BooleanDefaultFalse
  includeOutputLockingScripts: sdk.BooleanDefaultFalse
  limit: sdk.PositiveIntegerDefault10Max10000
  offset: sdk.PositiveIntegerOrZero
  seekPermission: sdk.BooleanDefaultTrue
  log?: string
}

/**
   * @param {sdk.LabelStringUnder300Bytes[]} args.labels - An array of labels used to filter actions.
   * @param {'any' | 'all'} [args.labelQueryMode] - Optional. Specifies how to match labels (default is any which matches any of the labels).
   * @param {sdk.BooleanDefaultFalse} [args.includeLabels] - Optional. Whether to include transaction labels in the result set.
   * @param {sdk.BooleanDefaultFalse} [args.includeInputs] - Optional. Whether to include input details in the result set.
   * @param {sdk.BooleanDefaultFalse} [args.includeInputSourceLockingScripts] - Optional. Whether to include input source locking scripts in the result set.
   * @param {sdk.BooleanDefaultFalse} [args.includeInputUnlockingScripts] - Optional. Whether to include input unlocking scripts in the result set.
   * @param {sdk.BooleanDefaultFalse} [args.includeOutputs] - Optional. Whether to include output details in the result set.
   * @param {sdk.BooleanDefaultFalse} [args.includeOutputLockingScripts] - Optional. Whether to include output locking scripts in the result set.
   * @param {sdk.PositiveIntegerDefault10Max10000} [args.limit] - Optional. The maximum number of transactions to retrieve.
   * @param {sdk.PositiveIntegerOrZero} [args.offset] - Optional. Number of transactions to skip before starting to return the results.
   * @param {sdk.BooleanDefaultTrue} [args.seekPermission] — Optional. Whether to seek permission from the user for this operation if required. Default true, will return an error rather than proceed if set to false.
 */
export function validateListActionsArgs(args: sdk.ListActionsArgs) : ValidListActionsArgs {
    let labelQueryMode: 'any' | 'all'
    if (args.labelQueryMode === undefined || args.labelQueryMode === 'any')
      labelQueryMode = 'any'
    else if (args.labelQueryMode === 'all')
      labelQueryMode = 'all'
    else
      throw new WERR_INVALID_PARAMETER('labelQueryMode', `undefined, 'any', or 'all'`)

    const vargs: ValidListActionsArgs = {
      labels: (args.labels || []).map(t => validateStringLength(t, 'label', 0, 300)),
      labelQueryMode,
      includeLabels: defaultFalse(args.includeLabels),
      includeInputs: defaultFalse(args.includeInputs),
      includeInputSourceLockingScripts: defaultFalse(args.includeInputSourceLockingScripts),
      includeInputUnlockingScripts: defaultFalse(args.includeInputUnlockingScripts),
      includeOutputs: defaultFalse(args.includeOutputs),
      includeOutputLockingScripts: defaultFalse(args.includeOutputLockingScripts),
      limit: validateInteger(args.limit, 'limit', 10, 1, 10000),
      offset: validateInteger(args.offset, 'offset', 0, 0, undefined),
      seekPermission: defaultTrue(args.seekPermission)
    }

    return vargs
}