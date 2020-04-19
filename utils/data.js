
const fs = require('fs')
const path = require('path')

const pathToData = path.join(__dirname, '../database.json')

const loadData = () => {
    const buffer = fs.readFileSync(pathToData)
    const data = buffer.toString()
    return JSON.parse(data)
}

const saveData = (data) => {
    return fs.writeFileSync(pathToData, JSON.stringify(data))
}

module.exports = { loadData, saveData }