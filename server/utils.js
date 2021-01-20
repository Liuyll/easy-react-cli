import { Readable } from 'stream' 
import ReactDOMServer from 'react-dom/server'
import * as mergeStream from 'merge-stream'

class StringReadStream extends Readable {
    constructor(val) {
        super()
        this.val = val
        this.sent = false
    }

    _read() {
        if(this.sent) {
            this.push(null)
        }
        else {
            this.push(Buffer.from(this.val))
            this.sent = true
        }
        
        // need pipe ctx.res. can't destroy when read finish
        // this.destroy()
    }
}

function generateHtmlFromElement(el) {
    let html = ReactDOMServer.renderToString(el)
    html = '<!DOCTYPE html>' + html
    return html
}

function generateHtmlStreamFromElement(el) {
    const _htmlStream = ReactDOMServer.renderToNodeStream(el)
    const docStream = new StringReadStream('<!DOCTYPE html>')
    const htmlStream = mergeStream(docStream, _htmlStream)
    return htmlStream
}


export {
    generateHtmlFromElement,
    generateHtmlStreamFromElement,
    StringReadStream
}