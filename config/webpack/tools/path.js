const path = require("path")
const resolvePath = function (relativePath) {
    return path.resolve(__dirname, relativePath) 
}
module.exports = {
    resolvePath
}
