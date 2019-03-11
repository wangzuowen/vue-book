let http = require('http')
let fs = require('fs')
let url = require('url')

let sliders = require('./sliders')

function read (callback) {
  fs.readFile('./books.json', 'utf8', function (err, data) {
    if (!(err || data.length === 0)) {
      callback(JSON.parse(data))
    } else {
      callback([])
    }
  })
}

function write (data, callback) {
  fs.writeFile('./books.json', JSON.stringify(data), callback)
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With')
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.setHeader('X-Powered-By', ' 3.2.1')
  if (req.method === 'OPTIONS') return res.end()

  let {pathname, query} = url.parse(req.url, true)

  if (pathname === '/sliders') {
    res.setHeader('Content-Type', 'application/json;charset=utf8')
    return res.end(JSON.stringify(sliders))
  }

  if (pathname === '/hot') {
    read(function (books) {
      let hot = books.reverse().slice(0, 6)
      res.setHeader('Content-Type', 'application/json;charset=utf8')
      res.end(JSON.stringify(hot))
    })
    return
  }

  if (pathname === '/book') {
    let id = parseInt(query.id)

    switch (req.method) {
      case 'GET':
        if (id) {
        } else {
          read(function (books) {
            res.setHeader('Content-Type', 'application/json;charset=utf8')
            res.end(JSON.stringify(books.reverse()))
          })
        }
        break
      case 'PUT':
        break
      case 'POST':
        break
      case 'DELETE':
        read(function (books) {
          books = books.filter(item => item.bookId !== id)
          write(books, function () {
            res.end(JSON.stringify({}))
          })
        })
        break
    }

    return
  }
}).listen(3000)