// 生产环境插件
import type { Plugin } from "vite";
import fs from "node:fs"
import * as electronBuilder from "electron-builder";
import path from 'path'
const buildBackground = () => {
    require('esbuild').buildSync({
        entryPoints: ['src/background.ts'],
        bundle: true,
        outfile: 'dist/background.js',
        platform: 'node',
        target: 'node18',
        external: ['electron']
    })
}

// 打包 需要先等vite打包有了index.html之后，再执行electron-builder打包
export const ElectronBuildPlugin = (): Plugin => {
    return {
        name: "electron-build",
        closeBundle () {
            buildBackground()
            // electron-builder 需要指定package.json main
            const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
            json.main = 'background.js'
            fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 4))
            // bug electron-builder 解决方法：弄一个假的node_modules
            fs.mkdirSync('dist/node_modules')

            electronBuilder.build({
                config: {
                    directories : {
                        output: path.resolve(process.cwd(), 'release'),
                        app: path.resolve(process.cwd(), 'dist')
                    },
                    extraResources: [
                        {
                            from: "src/py/pydist",
                            to: "pydist"
                        },
                    ],
                    files: ['**/*'],
                    // 打包成压缩包
                    asar: true,
                    appId: 'com.example.app',
                    productName: 'xiaomi',
                    nsis: {
                        // 取消一键安装
                        oneClick: false,
                        // 允许用户选择安装目录
                        allowToChangeInstallationDirectory: true,
                    }
                }
            })
        }
    }
}
