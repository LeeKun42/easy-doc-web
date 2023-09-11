import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig(({command,mode}) => {
    const envPrefix = "EASY_DOC_"
    const envDir = "env"
    console.log('vite config', command, mode, process.cwd())
    const config = loadEnv(mode,envDir, envPrefix)
    console.log('vite config load env', config)
    return {
        envDir: envDir,
        envPrefix: envPrefix,
        plugins: [
            vue(),
            AutoImport({
                resolvers: [
                    ElementPlusResolver()
                ],
            }),
            Components({
                resolvers: [
                    IconsResolver({
                        prefix: 'icon',
                        enabledCollections: ['ep'],
                    }),
                    ElementPlusResolver(),
                ],
            }),
            Icons({
                autoInstall: true,
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            port: 5173,
            host: "0.0.0.0"
        },
    }
})