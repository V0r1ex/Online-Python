const { runPython } = require("./python")

module.exports = function(app, globalPath) {
    app.get('/', (req, res) => res.sendFile(globalPath('index')))
    app.post('/sendCode', (req, res) => runPython(req.body.data).then(data => res.send(data)))
}
