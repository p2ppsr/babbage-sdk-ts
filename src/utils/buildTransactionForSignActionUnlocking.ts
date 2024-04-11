import { Script, Transaction, TransactionInput, TransactionOutput } from '@bsv/sdk';
import { CreateActionInput, DojoCreateTransactionResultApi } from '../types';

/**
 * Constructs a @bsv/sdk `Transaction` from Ninja inputs and Dojo create transaction results. 
 * 
 * @param ninjaInputs Ninja inputs as passed to createAction
 * @param createResult Create transaction results returned by createAction when signActionRequires is true.
 * @param changeKeys Dummy keys can be used to create a transaction with which to generate Ninja input lockingScripts.
 */
export async function buildTransactionForSignActionUnlocking(
  ninjaInputs: Record<string, CreateActionInput>,
  createResult: DojoCreateTransactionResultApi,
): Promise<Transaction>
{
  const {
    inputs: dojoInputs,
    outputs: dojoOutputs,
    derivationPrefix,
    version,
    lockTime,
  } = createResult;

  const tx = new Transaction(version, [], [], lockTime);

  //////////////
  // Add OUTPUTS
  /////////////

  for (const [i, out] of dojoOutputs.entries()) {
    let output: TransactionOutput;
    output = {
      satoshis: out.satoshis,
      lockingScript: asBsvSdkScript(out.script),
      change: false
    };
    tx.addOutput(output);
  }

  const getIndex = (o: (number | { index: number; })): number => {
    if (typeof o === 'object') {
      return o.index;
    } else {
      return o;
    }
  };

  //////////////
  // Add INPUTS
  /////////////
  let vin = -1;
  for (const [inputTXID, input] of Object.entries(dojoInputs)) {
    // For each transaction supplying inputs...
    const txInput = asBsvSdkTx(input.rawTx); // transaction referenced by input "outpoint" (txid,vout)
    if (txInput.id("hex") !== inputTXID)
      throw new Error(`rawTx must match txid. Hash of rawTx is not equal to input txid ${inputTXID}`);

    for (const otr of input.outputsToRedeem) {
      vin++;
      // For each output being redeemed from that input transaction
      const otrIndex = getIndex(otr);
      const otrOutput = txInput.outputs[otrIndex]; // the bitcoin transaction output being spent by new transaction


      // Find this input in ninjaInputs to find if an already signed unlocking script was provided.
      const otrNinja = ninjaInputs[inputTXID]?.outputsToRedeem.find(x => x.index === otrIndex);

      // Three types of inputs are handled:
      // Type0: Locking script will be inserted by caller before calling sign, numeric otrNinja.unlockingScript value
      // Type1: An already signed unlock script is provided as a hex string in otrNinja.unlockingScript
      // Type2: SABPPP protocol inputs which will be signed later by signAction
      // 
      if (typeof otrNinja?.unlockingScript === 'number') {
        // Type0
        const inputToAdd: TransactionInput = {
          sourceTransaction: txInput,
          sourceTXID: inputTXID,
          sourceOutputIndex: otrIndex,
          sequence: otrNinja.sequenceNumber || 0xffffffff
        };
        tx.addInput(inputToAdd);
      } else if (typeof otrNinja?.unlockingScript === 'string') {
        // Type1
        const inputToAdd: TransactionInput = {
          sourceTransaction: txInput,
          sourceTXID: inputTXID,
          sourceOutputIndex: otrIndex,
          unlockingScript: asBsvSdkScript(otrNinja.unlockingScript),
          sequence: otrNinja.sequenceNumber || 0xffffffff
        };
        tx.addInput(inputToAdd);
      } else if (!otrNinja) {
        // Type2
        const inputToAdd: TransactionInput = {
          sourceTransaction: txInput,
          sourceTXID: inputTXID,
          sourceOutputIndex: otrIndex,
          sequence: 0xffffffff
        };
        tx.addInput(inputToAdd);
      } else {
        throw new Error(`unhandled input type ${vin}`);
      }
    }
  }

  return tx
}

function asBsvSdkScript(script: string | Buffer | Script): Script {
  if (Buffer.isBuffer(script)) {
    script = Script.fromHex(asString(script))
  } else if (typeof script === 'string') {
    script = Script.fromHex(script)
  }
  return script
}

function asString(val: Buffer | string | number[], encoding?: BufferEncoding): string {
  if (Array.isArray(val)) val = Buffer.from(val)
  return Buffer.isBuffer(val) ? val.toString(encoding ?? 'hex') : val
}

function asBsvSdkTx(tx: string | Buffer | Transaction): Transaction {
  if (Buffer.isBuffer(tx)) {
    tx = Transaction.fromHex(asString(tx))
  } else if (typeof tx === 'string') {
    tx = Transaction.fromHex(tx)
  }
  return tx
}