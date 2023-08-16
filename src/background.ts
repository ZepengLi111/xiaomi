// electron 主进程文件
import {app, BrowserWindow} from 'electron'
import process from "process";
const fs = require('fs')
const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain

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






const createWindow = () => {
    const win = new BrowserWindow({
        show: false,
        height: 700,
        width: 1100,
        minHeight: 700,
        minWidth: 1100,
        webPreferences: {
            nodeIntegration: true, // 可以在渲染进程中使用node的api，为了安全默认是false
            contextIsolation: false, // 关闭渲染进程的沙箱，默认true，也是处于安全的考虑
            webSecurity: false, // 关闭跨域检测
        },
        useContentSize: true,
        frame: false,
    })

    if (process.argv[2]) {
        win.loadURL(process.argv[2]) // 开发环境
    } else {
        win.loadFile('index.html') // 生产环境
    }
    win.webContents.on("before-input-event", function () {
        let isOpened = false
        return (event, input) => {
            if (input.control && input.key.toLowerCase() === 'q') {
                if (isOpened) {
                    win.webContents.closeDevTools()
                }
                else {
                    win.webContents.openDevTools()
                }
                isOpened = !isOpened
                event.preventDefault()
            }
        }
    }())

    ipc.on("window-close", () => {
        win.close()
    })
    // 启动窗口时隐藏,直到渲染进程加载完成「ready-to-show 监听事件」 再显示窗口,防止加载时闪烁
    win.once("ready-to-show", () => {
        win.show(); // 显示窗口
    });
}

app.whenReady().then(() => {
    createWindow()

})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 macOS窗口全部关闭时,dock中程序不会退出
app.on("window-all-closed", () => {
    process.platform !== "darwin" && app.quit()
})




