//网页服务
const  express = require('express')
const   path = require('path')
const  app = express()

app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'index.html'))
})
app.listen(3000,()=>{
    console.log('进入网页服务');
})


// websocket server
const  net = require('net') //node自带的一个包
//net 这个服务是tcp/IP的一个服务和express的http服务还是有一定差别的
const  server = net.createServer()
//解析头部的包
const  parseHeader = require('parse-headers')

//crypto 加密包
const crypto = require('crypto')
server.on('connection',socket => {
    //监听socket的数据来源
    socket.on('data',(buffer)=>{
        //数据都是二进制的buffer
        const  str = buffer.toString()
        //查看传输了几次消息  第一次是握手 后面是websokcet 封包后的传输
        console.log("----message----");
        //解析头部
        const header = parseHeader(str)
        console.log(header)

        //crypto 加密
        const  sha1 = crypto.createHash('sha1')
        sha1.update(header['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
        const  acceptKey = sha1.digest('base64')
        let response =`HTTP/1.1 101 Switch protocols
Upgrade:websocket
Connection:Upgrade
Sec-Websocket-Accept:${acceptKey}


 `
        socket.write(response)
    })
})

server.listen(8090,()=>{
    console.log('连接聊天服务')
})