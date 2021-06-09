//网页服务
const  express = require('express')
const   path = require('path')
const  app = express()
app.use(express.static('static'))

app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'socketIO.html'))
})
app.listen(3000,()=>{
    console.log('进入网页服务');
})

const soceketIO = require('socket.io')(8090)

function broadcast(type,message,sender){
  for(let socket of users.keys()){
      socket.send({type,message,sender}) //每个socket对应每个用户的  发送相关给到客户端
  }
}
//只是demo演示 真是的不能用map来存取的
const users = new Map()
soceketIO.on('connect',(socket)=>{
    // 创建socket的成本很低的,维护的成本不高，进来一个用户创建一个io
    // 高成本的是计算 一个聊天室的能支撑多少个用户的，得看后面数据得存储 计算得效率
    console.log('进入聊天服务')
    socket.on('message',data=>{
         console.log(data)
        //这里用得switch 只是用作简单得demo 真正的登录还得需要用户token进行校验
        switch (data.type) {
            case 'LOGIN':
                users.set(socket,{name:data.name}) //map中的每一个key都是一个socket
                broadcast('LOGIN',`${data.name}加入了聊天`)
                break
            case 'CHAT':
                 const  user = users.get(socket) //聊天的时候的时候  先获取的当前socket
                  // socket关联的map的值 是之前存的{name:data.name}
                broadcast('CHAT',data.message,user.name)
                break
        }
    })
})

