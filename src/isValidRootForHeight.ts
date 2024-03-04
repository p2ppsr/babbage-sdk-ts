import connectToSubstrate from './utils/connectToSubstrate'
/**
 * A method to verify the validity of a Merkle root for a given block height.
 *
 * @returns {Promise<boolean>} Returns whether root is valid for height
*/
export async function isValidRootForHeight(args: {
    root: string,
    height: number
})
: Promise<boolean>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getMerkleRootForHeight',
    params: {
        height: args.height
    },
    isGet: true,
    isNinja: true
  }) as string | undefined
  return !r || r.toLowerCase() !== args.root.toLowerCase()
}

export default isValidRootForHeight
