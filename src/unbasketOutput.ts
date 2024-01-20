import connectToSubstrate from './utils/connectToSubstrate'

/**
 * Removes the uniquely identified output's basket assignment.
 * 
 * The output will no longer belong to any basket.
 * 
 * This is typically only useful for outputs that are no longer usefull.
 *
 * @param {Object} args All parameters are given in an object
 * @param {String} [args.txid] The transaction hash as hex string of the transaction containing the output.
 * @param {number} [args.vout] The output index in the transaction.
 * @param {String} [args.basket] The name of the basket from which to remove the output.
 */
export async function unbasketOutput(args: {
  txid: string,
  vout: number,
  basket: string
}) : Promise<void> {
  const connection = await connectToSubstrate()
  await connection.dispatch({
    name: 'unbasketOutput',
    params: {
      txid: args.txid,
      vout: args.vout,
      basket: args.basket
    },
    bodyJsonParams: true,
    isNinja: true
  })
}

export default unbasketOutput