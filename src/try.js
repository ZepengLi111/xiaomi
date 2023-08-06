const path = require('path')

let pyProc = null
let pyPort = null

const createPyProc = () => {
    let port = '4242'
    let script = path.join(__dirname, 'py', 'api.py')
    console.log(script)
    pyProc = require('child_process').spawn('python', [script, port])
    if (pyProc != null) {
        console.log('child process success')
    }
}

const exitPyProc = () => {
    pyProc.kill()
    pyProc = null
    pyPort = null
}

createPyProc()
