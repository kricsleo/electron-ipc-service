import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main.ts', 'src/renderer.ts', 'src/preload.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  unbundle: true,
  fixedExtension: false,
}) as UserConfig
