import type { RpcMap, RpcMethod } from '../shared/types'

type RpcHandler<M extends RpcMethod> = (
  input: RpcMap[M]['input'],
  db: D1Database
) => Promise<RpcMap[M]['output']> | RpcMap[M]['output']

const handlers = new Map<string, RpcHandler<any>>()

export function rpc<M extends RpcMethod>(method: M, handler: RpcHandler<M>) {
  handlers.set(method, handler)
}

export async function handleRpc(env: Env, method: string, input: unknown) {
  const handler = handlers.get(method)
  if (!handler) {
    throw new Error(`Unknown method: ${method}`)
  }
  return await handler(input, env.DB)
}
