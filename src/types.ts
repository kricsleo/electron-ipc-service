import type { IpcMainInvokeEvent, WebContents } from 'electron'

/* @__NO_SIDE_EFFECTS__ */
export abstract class IpcService {
  /**
   * TS doesn't support "abstract static" used together.
   * So for type-safety, we enforce "name" to be an instance readonly property,
   * instead of a static property.
   *
   * @see https://github.com/microsoft/TypeScript/issues/34516
   */
  abstract readonly namespace: string
}

export interface IpcServiceConstructor {
  new (): IpcService
}

export type IpcServices<T extends readonly IpcServiceConstructor[]> = {
  // Type magic to infer if the 'name' property is a constant string literal
  // or a loose string.
  // 'ANY_LITERAL_STRING' extends 'serviceName' -> false
  // 'ANY_LITERAL_STRING' extends string -> true
  [K in T[number] as 'ANY_LITERAL_STRING' extends InstanceType<K>['namespace']
    ? 'ERROR_SERVICE_NAMESPACE_MUST_BE_DECLARED_AS_CONST'
    : InstanceType<K>['namespace']
  ]: InstanceType<K>
}

export type IpcClient<T> = {
  [K in keyof T]: IpcClientService<T[K]>
}

type IpcClientService<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? K
    : never
  ]: T[K] extends (...args: infer Args) => infer Output
    ? (...args: Args) => Promise<Awaited<Output>>
    : never
}

export interface IpcMessage {
  service: string
  method: string
  args: any[]
}

export interface IpcContext {
  sender: WebContents
  event: IpcMainInvokeEvent
}
