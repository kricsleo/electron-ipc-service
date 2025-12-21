export const IPC_SERVICE_CHANNEL = '__electron-ipc-fn'

export interface IpcServiceMessage {
  serviceName: string
  methodName: string
  args: any[]
}
