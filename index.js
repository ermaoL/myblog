const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为ejs
app.set('views engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// session 中间件
app.use(session({
  name: config.session.key, // 设置cookie中保存session id的字段名称
  secret: config.session.secret, // 通过设置secret来计算hash值并放在cookie中，使产生的signedCookie 防篡改
  resave: true, // 强制更新session
  saveUninitialized: false, // 设置为false，强制创建一个session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge // 过期时间，过期后cookie中的session id自动删除
  },
  store: new MongoStore({ // 将session存储到mongodb
    url: config.mongodb // mongodb地址
  })
}))

// flash中间件，用来显示通知
app.use(flash())

// 路由
routes(app)

// 监听端口，启动程序
app.listen(config.port, function() {
  config.log(`${pkg.name} listening on port ${config.port}`)
})