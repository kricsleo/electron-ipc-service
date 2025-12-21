import { createIpcServices, IpcService } from 'electron-ipc-fn'

class ServiceA implements IpcService {
  name = 'ServiceA' as const
  foo() {
    return `${this.name} - foo`
  }

  async bar() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return `${this.name} - bar`
  }
}

class ServiceB extends IpcService {
  name = 'ServiceB' as const
  foo() {
    return `${this.name} - foo`
  }

  async bar() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return `${this.name} - bar`
  }
}

export const ipcServices = createIpcServices([ServiceA, ServiceB])

export type IpcServices = typeof ipcServices
