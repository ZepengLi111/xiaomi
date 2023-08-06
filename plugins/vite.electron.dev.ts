// 开发环境插件
import type {Plugin} from "vite";
import type {AddressInfo} from "net";
import {spawn} from 'child_process';
import fs from 'node:fs'

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

// vite插件要求必须导出一个对象，且对象有name属性
// 在这个对象有很多钩子
export const ElectronDevPlugin = (): Plugin => {
    return {
        name: 'electron-dev',
        configureServer (server) {
            buildBackground()
            server?.httpServer?.once('listening', () => {
                // 读取vite服务的信息
                const addressInfo = server?.httpServer?.address() as AddressInfo
                // 拼接IP地址，给electron启动服务的时候要用
                const IP = `http://localhost:${addressInfo.port}`
                // 参数一：运行的shell命令,require返回的是路径
                // electron不认识ts，所以需要编译
                // 进程传参法
                let ElectronProcess =  spawn(require('electron'), ['dist/background.js', IP])
                fs.watchFile('src/background.ts', () => {
                    ElectronProcess.kill()
                    buildBackground()
                    ElectronProcess =  spawn(require('electron'), ['dist/background.js', IP])
                })
                ElectronProcess.stderr.on('data', (data) => {
                    console.log('日志', data.toString())
                })
            })
        }
    }
}

