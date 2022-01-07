const _ = require("lodash")
const fuzzy = require("fuzzy-search")
const logix = require("./LogiX.json").map(l => {
    return {
        ...l,
        pathName: l.pathName.startsWith('LogiX/') ? l.pathName.slice(6) : l.pathName
    }
})
const component = require("./Component.json")

const logixNames = [...new Set(logix.map((l) => l.name))]
const componentNames = [...new Set(component.map((l) => l.name))]

console.log(`LogiX Node Count : ${logixNames.length}`)
console.log(`Component Count : ${componentNames.length}`)
const logixSearcher = new fuzzy(logixNames, [], { sort: true })
const componentSearcher = new fuzzy(componentNames, [], { sort: true })

const j2e = require("json2emap")
const express = require("express")
const app = express();

app.get("/logix/:fullName", (req, res) => {
    const result = logix.find((l) => l.fullName === req.params.fullName)
    res.send(req.query.emap ? j2e(result) : result)
})


app.get("/logix", (req, res) => {
    if (!req.query.q) {
        res.status(400).send("BAD_REQUEST")
        return
    }

    let result = logixSearcher.search(req.query.q)
    if (req.query.details) {
        result = result.map((r) => { return logix.find(e => e.name === r) })
        if (req.query.details !== "full") {
            result = result.map(r => { return _.pick(r, ["pathName", "fullName"]) })
        }
    }

    if (req.query.limit) {
        const limit = Number(req.query.limit);
        if (!Number.isInteger(limit) || limit <= 0) {
            res.status(400).send("BAD_REQUEST")
            return
        }
        result = result.slice(0, limit)
    }

    res.send(req.query.emap ? j2e(result) : result)
})


app.get("/component/:fullName", (req, res) => {
    const result = component.find((l) => l.fullName === req.params.fullName)
    res.send(req.query.emap ? j2e(result) : result)
})


app.get("/component", (req, res) => {
    if (!req.query.q) {
        res.status(400).send("BAD_REQUEST")
        return
    }

    let result = componentSearcher.search(req.query.q)

    if (!req.query.logix) {
        result = result.filter((c) => !c.startsWith("/LogiX"))
    }

    if (req.query.details) {
        result = result.map((r) => { return component.find(e => e.name === r) })
        if (req.query.details !== "full") {
            result = result.map(r => { return _.pick(r, ["pathName", "fullName"]) })
        }
    }

    if (req.query.limit) {
        const limit = Number(req.query.limit);
        if (!Number.isInteger(limit) || limit <= 0) {
            res.status(400).send("BAD_REQUEST")
            return
        }
        result = result.slice(0, limit)
    }

    res.send(req.query.emap ? j2e(result) : result)
})




const server = app.listen(3000, function () {
    console.log("ok port:" + server.address().port)
});
