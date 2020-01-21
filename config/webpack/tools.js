function judgeMode(mode,dev,prod){
    mode === 'production' ? prod : dev
}

module.exports = {
    judgeMode
}