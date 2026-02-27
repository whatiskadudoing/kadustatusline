/**
 * Read all of stdin and return as a UTF-8 string.
 * Works with Bun's process.stdin async iterator.
 */
export async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
}
