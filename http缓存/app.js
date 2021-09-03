var http = require('http')
const { runInNewContext } = require('vm')

http.createServer(function(req, res) {
  
  let d = new Date(Date.now() + 5000).toUTCString()
  // 具体日期
  res.setHeader('Expire', d)
  // max-age单位是秒
  res.setHeader('Cache-Control', 'public;max-age=100')
  res.write('<head><meta charset="utf-8" /></head>')
  res.write('服务器缓存 Disk Cache')
  res.statusCode = 301
  res.end()
}).listen('7777')