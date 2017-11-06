export function isSyncChunk (chunk) {
  return chunk && chunk.sync && Object.keys(chunk).length === 1
}
