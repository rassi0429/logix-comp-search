const _ = require("lodash")
const fuzzy = require("fuzzy-search")
const logix = require("./LogiX.json")
const names = [...new Set(logix.map((l) => l.name))]

console.log(`LogiX Node Count : ${names.length}`)
const searcher = new fuzzy(names, [], { sort: true })

const j2e = require("json2emap")
const express = require("express")
const app = express();
app.get("/", (req, res) => {
    if (!req.query.q || !req.query.type) {
        res.status(400).send("BAD_REQUEST")
        return
    }

    if (req.query.type == "logix") {
        let result = searcher.search(req.query.q)
        if (req.query.details) {
            result = result.map((r) => { return logix.find(e => e.name === r) })
            if (req.query.details != "full") {
                result = result.map(r => { return _.pick(r, ["name", "fullName", "pathName", "types"]) })
            }
        }
        res.send(req.query.emap ? j2e(result) : result)
    } else {
        res.send([])
    }
})



const server = app.listen(3000, function () {
    console.log("ok port:" + server.address().port)
});


