<h3 align="center">electron-ipc-service</h3>
<p align="center">
<a href="https://www.npmjs.com/package/electron-ipc-service">
  <img src="https://img.shields.io/npm/v/electron-ipc-service?style=flat&colorA=18181B&colorB=F0DB4F" />
</a>

<a href="https://www.npmjs.com/package/electron-ipc-service">
  <img src="https://img.shields.io/npm/types/electron-ipc-service?style=flat&colorA=18181B&colorB=F0DB4F" />
</a>

<a href="https://bundlephobia.com/package/electron-ipc-service">
  <img src="https://img.shields.io/bundlephobia/minzip/electron-ipc-service?style=flat&colorA=18181B&colorB=F0DB4F" />
</a>

<a href="https://github.com/kricsleo/electron-ipc-service/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/kricsleo/electron-ipc-service.svg?style=flat&colorA=18181B&colorB=F0DB4F" />
</a>

</p>

Make Electron's IPC calls elegant and simple with just function calls.<br>
Mostly, enjoying full type-safety! 🎩

## Features

- 🚀 Supertiny — less than 1kB (gzipped)
- 🧹 Superclean — no dependencies
- 💪🏻 Full type safety, with all types defined only once

## Install

```bash
pnpm i electron-ipc-service
```

## Usage

### 1. Main Process — Define & Register Services

```ts
import { app } from 'electron'
import { createMainIpcClient, initializeIpcMainServices, IpcService, useIpcMainContext } from 'electron-ipc-service'
import type { IpcRendererServices } from '<path_to_your_renderer_ipc_file>'

// Define your custom service that extends "IpcService"
class AppService extends IpcService {
  // Define a unique "namespace" for each service,
  // all service methods will be available under this namespace.
  static override readonly namespace = 'app'

  // Implement your custom functions, which can be sync or async,
  // but the results will always be a Promise when called from the renderer.
  getAppVersion() {
    return app.getVersion()
  }

  async search(input: string) {
    // Access ipc context with `useIpcMainContext()` when needed,
    // it's automatically injected via AsyncLocalStorage
    const { sender } = useIpcMainContext()

    const { promise, resolve } = Promise.withResolvers<Electron.Result | null>()
    let requestId = -1
    sender.once('found-in-page', (_, result) => {
      resolve(result.requestId === requestId ? result : null)
    })
    requestId = sender.findInPage(input)
    return promise
  }
}

class UtilService extends IpcService {
  static override readonly namespace = 'util'
  bar() {
    return `${UtilService.namespace} - bar`
  }
}

// Initialize main services (renderer can call these)
const ipcMainServices = initializeIpcMainServices([AppService, UtilService])

// Export the type for the renderer's `createIpcRendererClient`
export type IpcMainServices = typeof ipcMainServices

// Create a client to broadcast to all renderer windows (fire-and-forget)
const rendererClient = createMainIpcClient<IpcRendererServices>()
rendererClient.ui.showToast('Hello from main!')
```

### 2. Preload Script — Bridge Main & Renderer

```ts
import { initializeIpcPreload } from 'electron-ipc-service/preload'

initializeIpcPreload()
```

### 3. Renderer — Call Main Services & Register Renderer Services

```ts
import { createIpcRendererClient, initializeIpcRendererServices, IpcService } from 'electron-ipc-service/renderer'
import type { IpcMainServices } from '<path_to_your_main_ipc_file>'

// Create a client to call main services (returns Promises)
export const mainClient = createIpcRendererClient<IpcMainServices>()

await mainClient.app.getAppVersion() // => "0.0.1"
await mainClient.app.search('foo') // => { matches: ... }
await mainClient.util.bar() // => "util - bar"

// Define renderer services that main can broadcast to
class UiService extends IpcService {
  static override readonly namespace = 'ui'

  showToast(message: string) {
    console.log('Toast:', message)
  }
}

// Initialize renderer services (main can call these via `createMainIpcClient`)
export const ipcRendererServices = initializeIpcRendererServices([UiService])
export type IpcRendererServices = typeof ipcRendererServices
```

## Thanks

Most of the code is forked from https://github.com/Innei/electron-ipc-decorator/<br>

> 2025 © Innei, Released under the MIT License.<br>
> [Personal Website](https://innei.in/) · GitHub [@Innei](https://github.com/innei/)

Thanks for all the hard works ❤️

## License

❤️ [MIT](./LICENSE) © [Kricsleo](https://github.com/kricsleo)
