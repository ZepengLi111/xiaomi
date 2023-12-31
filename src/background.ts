// electron 主进程文件
import {app, BrowserWindow} from 'electron'
import process from "process";
import {writeFile, readFile} from "fs"
import neatCsv from 'neat-csv';
const fs = require('fs')
const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain


let pyProc:any = null
let pyPort = null

const createPyProc = () => {
    let port = '5031'
    let script
    if (process.argv[2]) {
        script = path.join(__dirname, '../dist/pydist/api', 'api') // 开发环境
    } else {
        script = path.join(__dirname, '../pydist/api', 'api') // 生产环境
    }

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
    ipc.on("choose-folder",  (event, csvContents:string[], names:string[]) => {
        electron.dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => {
            let errNames:string[] = []
            let dateStr = new Date().getTime()
            for (let i = 0; i < csvContents.length; i++)
            {
                writeFile(result.filePaths[0] + `\\${names[i]}-${dateStr}-log.csv`, csvContents[i], (err) => {
                    if (err) errNames.push(names[i])
                    if (i == csvContents.length - 1) {
                        event.sender.send("choose-folder-finished", errNames)
                    }
                })
            }
        })
    })
    ipc.on("read-chat-file", (event) => {
        electron.dialog.showOpenDialog(
            {properties: ['openFile'], filters: [{name: "聊天记录", extensions: ['csv']}]}
        ).then(result => {
            if (result.filePaths[0]) {
                readFile(result.filePaths[0], (err, data) => {
                    if (err) event.sender.send("read-chat-file-finished")
                    else {
                        neatCsv(data, ).then(r => {
                            event.sender.send("read-chat-file-finished", r)
                        }).catch(err => {
                            event.sender.send("read-chat-file-finished")
                        })

                    }
                })
            }
        })
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




