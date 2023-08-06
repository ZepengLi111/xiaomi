// electron 主进程文件

import {app, BrowserWindow} from 'electron'
import * as process from "process";

let fs = require('fs')
fs.writeFile('./debug.txt', 'hello ', () => {

})

const path = require('path')

let pyProc:any = null
let pyPort = null

const createPyProc = () => {
    let port = '4242'
    let script = path.join(__dirname, '../pydist/api', 'api')
    fs.appendFile('./debug.txt', script + ' ', () => {

    })
    pyProc = require('child_process').execFile(script, [port])
    if (pyProc != null) {
        console.log('child process success')
    }
}


const exitPyProc = () => {
    pyProc.kill()
    pyProc = null
    pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


app.whenReady().then(() => {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true, // 可以在渲染进程中使用node的api，为了安全默认是false
            contextIsolation: false, // 关闭渲染进程的沙箱，默认true，也是处于安全的考虑
            webSecurity: false, // 关闭跨域检测
        }
    })
    // win.webContents.openDevTools()

    if (process.argv[2]) {
        win.loadURL(process.argv[2]) // 开发环境
    }else {
        win.loadFile('index.html') // 生产环境
    }


})




