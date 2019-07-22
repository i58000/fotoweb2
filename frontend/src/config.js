if (process.env.NODE_ENV == 'production') {
    global.config = {
        host: 'caijiapei.com',
        port: '80',
        context: './'
    }
} else {
    global.config = {
        host: 'localhost',
        port: '8090',
        context: 'http://localhost:8090/'
    }
}

global.FOTOS_SEP = "$"
