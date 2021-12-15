const fs = require("fs");
const logix = require("./LogiX.json")
const newLogix = logix.map((l,i) => {
    l.id = i
    return l
} )
fs.writeFile("newLogix.json", JSON.stringify(newLogix), (err) => {
    if (err) throw err;
    console.log('正常に書き込みが完了しました');
  });