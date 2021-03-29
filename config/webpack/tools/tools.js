function judgeMode(mode,dev,prod){
    return mode === 'production' ? prod : dev
}

module.exports = {
    judgeMode
}