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

function validateStringLength(s: string, name: string, min?: number, max?: number): string {
    if (min !== undefined && s.length < min)
        throw new WERR_INVALID_PARAMETER(name, `at least ${min} length.`)
    if (max !== undefined && s.length > max)
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
  inputDescription: sdk.DescriptionString5to50Characters
  sequenceNumber: sdk.PositiveIntegerOrZero
  unlockingScript?: sdk.HexString
  unlockingScriptLength?: sdk.PositiveInteger
}

export function validateCreateActionInput(i: sdk.CreateActionInput): ValidCreateActionInput {
    const vi: ValidCreateActionInput = {
        outpoint: parseWalletOutpoint(i.outpoint),
        inputDescription: validateStringLength(i.inputDescription, 'inputDescription', 5, 50),
        unlockingScript: validateOptionalHexString(i.unlockingScript, 'unlockingScript'),
        unlockingScriptLength: i.unlockingScriptLength,
        sequenceNumber: default0xffffffff(i.sequenceNumber)
    }
    if (vi.unlockingScript === undefined && vi.unlockingScriptLength === undefined)
        throw new WERR_INVALID_PARAMETER('unlockingScript, unlockingScriptLength', `at least one valid value.`)
    return vi
}

/**
   * @param {HexString} lockingScript - The locking script that dictates how the output can later be spent.
   * @param {SatoshiValue} satoshis - Number of Satoshis that constitute this output.
   * @param {DescriptionString5to50Characters} outputDescription - Description of what this output represents.
   * @param {BasketStringUnder300Characters} [basket] - Name of the basket where this UTXO will be held, if tracking is desired.
   * @param {string} [customInstructions] - Custom instructions attached onto this UTXO, often utilized within application logic to provide necessary unlocking context or track token histories.
   * @param {OutputTagStringUnder300Characters[]} [tags] - Tags assigned to the output for sorting or filtering.
export interface CreateActionOutput {
  lockingScript: HexString
  satoshis: SatoshiValue
  outputDescription: DescriptionString5to50Characters
  basket?: BasketStringUnder300Characters
  customInstructions?: string
  tags?: OutputTagStringUnder300Characters[]
}
 */

export interface ValidCreateActionOutput {
  lockingScript: sdk.HexString
  satoshis: sdk.SatoshiValue
  outputDescription: sdk.DescriptionString5to50Characters
  basket?: sdk.BasketStringUnder300Characters
  customInstructions?: string
  tags: sdk.OutputTagStringUnder300Characters[]
}

export function validateSatoshis (satoshis: number): number {
  if (!Number.isInteger(satoshis) || satoshis < 0 || satoshis > 21e14)
    throw new WERR_INVALID_PARAMETER('satoshis', 'positive and less than 21e14.')
  return satoshis
}

export function validateCreateActionOutput(o: sdk.CreateActionOutput): ValidCreateActionOutput {
    const vo: ValidCreateActionOutput = {
        lockingScript: validateHexString(o.lockingScript, 'lockingScript'),
        satoshis: validateSatoshis(o.satoshis),
        outputDescription: validateStringLength(o.outputDescription, 'outputDescription', 5, 50),
        basket: validateOptionalStringLength(o.basket, 'basket', 0, 300),
        customInstructions: o.customInstructions,
        tags: defaultEmpty(o.tags).map(t => validateStringLength(t, 'tags', 0, 300))
    }
    return vo
}

export interface ValidCreateActionOptions {
  signAndProcess: boolean
  acceptDelayedBroadcast: boolean
  trustSelf?: TrustSelf
  knownTxids: sdk.TXIDHexString[]
  returnTXIDOnly: boolean
  noSend: boolean
  noSendChange: OutPoint[]
  sendWith: sdk.TXIDHexString[]
  randomizeOutputs: boolean
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

export interface ValidCreateActionArgs {
  description: sdk.DescriptionString5to50Characters
  inputBEEF?: sdk.BEEF
  inputs: sdk.ValidCreateActionInput[]
  outputs: sdk.ValidCreateActionOutput[]
  lockTime: number
  version: number
  labels: string[]
  options: ValidCreateActionOptions
  // true if a batch of transactions is included for processing.
  isSendWidth: boolean
  // true if there is a new transaction (not no inputs and no outputs)
  isNewTx: boolean
  // true if transaction creation completion will require a `signAction` call.
  isSignAction: boolean
  // true if options.acceptDelayedBroadcast is true
  isDelayed: boolean
}

export function validateCreateActionArgs(args: sdk.CreateActionArgs) : ValidCreateActionArgs {
    const vargs: ValidCreateActionArgs = {
      description: validateStringLength(args.description, 'description', 5, 50),
      inputs: defaultEmpty(args.inputs).map(i => validateCreateActionInput(i)),
      outputs: defaultEmpty(args.outputs).map(o => validateCreateActionOutput(o)),
      lockTime: defaultZero(args.lockTime),
      version: defaultOne(args.version),
      labels: defaultEmpty(args.labels),
      options: validateCreateActionOptions(args.options),
      isSendWidth: false,
      isNewTx: false,
      isSignAction: false,
      isDelayed: false
    }
    vargs.isSendWidth = vargs.options.sendWith.length > 0
    vargs.isNewTx = (vargs.inputs.length > 0) || (vargs.outputs.length > 0)
    vargs.isSignAction = vargs.isNewTx && (vargs.options.signAndProcess === false || vargs.inputs.some(i => i.unlockingScript === undefined))
    vargs.isDelayed = vargs.options.acceptDelayedBroadcast

    if (!vargs.isSendWidth && !vargs.isNewTx)
      throw new WERR_INVALID_PARAMETER('args', 'either at least one input or output, or a sendWith.')
    return vargs
}

export interface ValidSignActionOptions {
  acceptDelayedBroadcast: sdk.BooleanDefaultTrue
  returnTXIDOnly: sdk.BooleanDefaultFalse
  noSend: sdk.BooleanDefaultFalse
  sendWith: sdk.TXIDHexString[]
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

export interface ValidSignActionArgs {
  spends: Record<sdk.PositiveIntegerOrZero, sdk.SignActionSpend>
  reference: sdk.Base64String
  options: sdk.ValidSignActionOptions
  // true if a batch of transactions is included for processing.
  isSendWidth: boolean
  // true if options.acceptDelayedBroadcast is true
  isDelayed: boolean
}

export function validateSignActionArgs(args: sdk.SignActionArgs) : ValidSignActionArgs {
    const vargs: ValidSignActionArgs = {
      spends: args.spends,
      reference: args.reference,
      options: validateSignActionOptions(args.options),
      isSendWidth: false,
      isDelayed: false
    }
    vargs.isSendWidth = vargs.options.sendWith.length > 0
    vargs.isDelayed = vargs.options.acceptDelayedBroadcast

    return vargs
}
