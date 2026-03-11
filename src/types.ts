import type { IpcMainInvokeEvent, WebContents } from 'electron'

/* @__NO_SIDE_EFFECTS__ */
export abstract class IpcService {
  /**
   * TS doesn't support "abstract static" used together.
   *
   * @see https://github.com/microsoft/TypeScript/issues/34516
   */
  static readonly namespace: string
}

export interface IpcServiceConstructor {
  new (): IpcService
  readonly namespace: string
}

export type IpcServices<T extends readonly IpcServiceConstructor[]> = {
  [K in T[number] as 'ANY_LITERAL_STRING' extends K['namespace']
    ? 'ERROR_SERVICE_MUST_DECLARE_A_STATIC_READONLY_NAMESPACE_STRING'
    : K['namespace']
  ]: InstanceType<K>
}

export type IpcMainClient<T> = {
  [K in keyof T]: IpcMainClientService<T[K]>
}

type IpcMainClientService<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? K
    : never
  ]:
  T[K] extends (...args: infer Args) => any
    ? (...args: Args) => never
    : never
}

export type IpcRendererClient<T> = {
  [K in keyof T]: IpcRendererClientService<T[K]>
}

type IpcRendererClientService<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? K
    : never
  ]:
  T[K] extends (...args: infer Args) => infer Output
    ? (...args: Args) => Promise<Awaited<Output>>
    : never
}

export interface IpcMessage {
  service: string
  method: string
  args: any[]
}

export interface IpcMainContext {
  sender: WebContents
  event: IpcMainInvokeEvent
}
