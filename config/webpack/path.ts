import * as path from 'path'

const resolveApp = (relativePath:string) => path.resolve(__dirname,relativePath)

module.exports = {
    resolveApp
}

