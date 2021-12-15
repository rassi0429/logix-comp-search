const _ = require("lodash")
const fuzzy = require("fuzzy-search")
const logix = require("./LogiX.json")
const names = [...new Set(logix.map((l) => l.pathName))]

console.log(`LogiX Node Count : ${names.length}`)
const searcher = new fuzzy(names, [], { sort: true })

const j2e = require("json2emap")
const express = require("express")
const app = express();

app.get("/logix/:id/fullName",(req,res) => {
    res.send(logix.find((l) => l.id === Number(req.params.id)).fullName)
})


app.get("/logix", (req, res) => {
    if (!req.query.q) {
        res.status(400).send("BAD_REQUEST")
        return
    }

    let result = searcher.search(req.query.q)
    if (req.query.details) {
        result = result.map((r) => { return logix.find(e => e.pathName === r) })
        if (req.query.details != "full") {
            result = result.map(r => { return _.pick(r, ["pathName", "id"]) })
        }
    }
    res.send(req.query.emap ? j2e(result) : result)
})



const server = app.listen(3000, function () {
    console.log("ok port:" + server.address().port)
});


