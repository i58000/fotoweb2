    
//代理配置
let conifg = {
    '/fotos/':{
        target: 'http://localhost:80',
    },
    '/':{
        target: 'http://localhost:8080',
    }
}
module.exports = conifg