if (process.env.NODE_ENV == 'production') {
    global.config = {
        host: 'anjinshuo.tech',
        port: '80'
    }
} else {
    global.config = {
        host: 'localhost',
        port: '8090'
    }
}

global.FOTOS_SEP = "$"
