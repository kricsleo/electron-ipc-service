import type { IpcServices } from '../../../src/main/ipc.ts'
import { createIpcRendererClient, initializeIpcRendererServices, IpcService } from 'electron-ipc-service/renderer'
import { reactive } from 'vue'

export const ipc = createIpcRendererClient<IpcServices>()

export const toastMessages = reactive<string[]>([])

class UiService extends IpcService {
  static readonly namespace = 'ui'

  showToast(message: string) {
    toastMessages.push(`[${new Date().toLocaleTimeString()}] ${message}`)
    return 'pk'
  }
}

export const rendererServices = initializeIpcRendererServices([UiService])
export type RendererIpcServices = typeof rendererServices
