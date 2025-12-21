> Most of the code is forked from https://github.com/Innei/electron-ipc-decorator/

Make Electron's IPC calls elegant and simple. Mostly, enjoying full type-safety! 🎩

## Install

```bash
pnpm i electron-ipc-service
```

## Usage

### In Main

```ts
import { createIpcServices, initializeIpcServices, IpcService } from 'electron-ipc-service'

// 1. Define your custom service to be called through IPC by the renderer
class ServiceA implements IpcService {
  // "namespace" must be declared "as const",
  // all service methods will be available under this namespace.
  namespace = 'a' as const

  foo() {
    return `${this.namespace} - foo`
  }

  async bar() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return `${this.namespace} - bar`
  }
}

// Define another custom service
class ServiceB extends IpcService {
  namespace = 'b' as const

  foo() {
    return `${this.namespace} - foo`
  }

  async bar() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return `${this.namespace} - bar`
  }
}

const ipcServices = createIpcServices([ServiceA, ServiceB])
initializeIpcServices(ipcServices)

// 2. Export this type for use by the renderer's `createIpcClient` to enable full type-safety.
export type IpcServices = typeof ipcServices
```

### In Preload Script

```ts
import { initializeIpcBridge } from 'electron-ipc-service/preload'

// 3. Setup the IPC channel bridge to connect the "main"/"renderer" processes
initializeIpcBridge()
```

### In Renderer

```ts
import { createIpcClient } from 'electron-ipc-service/renderer'
import type { IpcServices } from '<path_to_your_main_ipc_declaration_file.ts>'

// 4. Setup the IPC client
export const ipc = createIpcClient<IpcServices>()

// Then you can call ipc methods with full type-safety
await ipc.a.foo() // => "a - foo"
await ipc.a.bar() // => "a - bar"
await ipc.b.foo() // => "b - foo"
await ipc.b.bar() // => "b - bar"
```
