import connectToSubstrate from './utils/connectToSubstrate'
/**
 * A method to verify the validity of a Merkle root for a given block height.
 *
 * @returns {Promise<boolean>} Returns the merkle root for height or undefined, if height doesn't have a known merkle root or is invalid.
*/
export async function getMerkleRootForHeight(height: number)
: Promise<string | undefined>
{
  const connection = await connectToSubstrate()
  const r = await connection.dispatch({
    name: 'getMerkleRootForHeight',
    params: {
        height
    },
    isGet: true,
    isNinja: true
  }) as string | undefined
  return r
}

export default getMerkleRootForHeight
