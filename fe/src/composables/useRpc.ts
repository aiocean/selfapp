import type { RpcMap, RpcMethod } from '@shared/rpc'

export async function rpc<M extends RpcMethod>(
  method: M,
  ...args: RpcMap[M]['input'] extends void ? [] : [RpcMap[M]['input']]
): Promise<RpcMap[M]['output']> {
  const input = args[0] ?? undefined
  const res = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, input }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
  return json.result
}
