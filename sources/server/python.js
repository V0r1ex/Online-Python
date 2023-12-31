let fs = require('fs')
const cp = require('child_process')
const iconv = require('iconv-lite')

async function runPython(data) { 
    fs.writeFileSync('test.py', data, (err) => err && console.log(err))

    const ls = cp.spawn('python', ['test.py'])
    let output = ""
    return new Promise(function(resolve, reject) {
        ls.stdout.on('data', data => output += iconv.decode(data, 'cp1251'))
        ls.stderr.on('data', err => output += iconv.decode(err, 'cp1251'))
        ls.on('close', () => resolve(output))
    })
}

// let a = cp.spawn('python', ['test.py'])
// output = ''
// a.stdout.on('data', data => {
//     a.stdin.write('Hello from parent process!')
//     output = data
// })
// a.on('close', () => console.log(iconv.decode(output, 'cp1251')))
module.exports = { runPython }


