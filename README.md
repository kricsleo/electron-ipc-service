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

### In Main

```ts
import { app } from 'electron'
import { initializeIpcServices, IpcService, useIpcContext } from 'electron-ipc-service'

// 1. Define your custom service that extends "IpcService"
class AppService extends IpcService {
  // 1.1. Define a unique "namespace" for each service,
  // all service methods will be available under this namespace.
  static readonly namespace = 'app'

  // 1.2. Implement your custom functions, which can be sync or async,
  // but the results will always be a Promise when called from the renderer.
  getAppVersion() {
    return app.getVersion()
  }

  async search(input: string) {
    // 1.3. Access ipc context with `useIpcContext()` when needed,
    // it's automatically injected via AsyncLocalStorage
    const { sender } = useIpcContext()

    const { promise, resolve } = Promise.withResolvers<Electron.Result | null>()
    let requestId = -1
    sender.once('found-in-page', (_, result) => {
      resolve(result.requestId === requestId ? result : null)
    })
    requestId = sender.findInPage(input)
    return promise
  }
}

// Define other custom services
class UtilService extends IpcService {
  static readonly namespace = 'util'
  bar() {
    return `${UtilService.namespace} - bar`
  }
}

// 2. Initialize ipc services
const ipcServices = initializeIpcServices([AppService, UtilService])

// 2.1. Export the ipc service types for use by the renderer's `createIpcClient`,
// enabling full type safety!
export type IpcServices = typeof ipcServices
```

### In Preload Script

```ts
import { initializeIpcBridge } from 'electron-ipc-service/preload'

// 3. Setup the ipc channel bridge to connect the "main"/"renderer" processes
initializeIpcBridge()
```

### In Renderer

```ts
import { createIpcClient } from 'electron-ipc-service/renderer'
import type { IpcServices } from '<path_to_your_main_ipc_declaration_file.ts>'

// 4. Setup the ipc client
export const ipc = createIpcClient<IpcServices>()

// Then you can call ipc methods with full type-safety 🎉
await ipc.app.getAppVersion() // => "0.0.1"
await ipc.app.search('foo') // => { matches: ... }
await ipc.util.bar() // => "util - bar"
```

## Thanks

Most of the code is forked from https://github.com/Innei/electron-ipc-decorator/<br>

> 2025 © Innei, Released under the MIT License.<br>
> [Personal Website](https://innei.in/) · GitHub [@Innei](https://github.com/innei/)

Thanks for all the hard works ❤️

## License

❤️ [MIT](./LICENSE) © [Kricsleo](https://github.com/kricsleo)
