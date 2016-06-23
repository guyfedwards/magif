const fs = require('fs')
const ipc = require('ipc')
const menubar = require('menubar')
const { setApplicationMenu } = require('menu')
const menu = require('./src/menu')

const mb = menubar()

const jsonPath = `${mb.app.getPath('userData')}/gifs.json`

mb.on('ready', () => {
  const initialArray = []
  const initialJson = JSON.stringify(initialArray)

  createOrReadJsonFile(jsonPath, initialJson)
  setApplicationMenu(menu)
})

mb.on('after-create-window', () => {
  renderGifs()

  ipc.on('add-gif', (event, arg) => {
    addGif(arg)
  })

  ipc.on('delete', (event, arg) => {
    getGifs(jsonPath)
      .then((data) => {
        setTimeout(() => {
          deleteGif(data, arg)
        },10)
      })
  })

  ipc.on('hide-window', () => {
    mb.hideWindow()
  })

  ipc.on('quit', arg => {
    mb.app.quit()
  })
})

function createOrReadJsonFile(path, json) {
  fs.stat(path, (err, stats) => {
    if (err === null) {
      console.log('file exists');
    } else if (err.code === 'ENOENT') {
      fs.writeFile(path, json, err => {
        if (err) throw err
        console.log('file created');
      })
    } else {
      console.log(err);
    }
  })
}

function getGifs(path) {
  return new Promise((resolve, reject) => {
    let gifs = []

    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) throw err

      gifs = JSON.parse(data)

      resolve(gifs)
    })
  })
}

function addGif(gif) {
  getGifs(jsonPath)
  .then(data => {
    var newGifs = data

    newGifs.push({
      id: randomString(10),
      link: gif.url,
      tags: gif.tags
    })

    writeGifsToFile(newGifs)
  })
}

function deleteGif(gifs, id) {
  const newGifs = gifs.filter((el, index) => {
    return el.id !== id;
  });

  writeGifsToFile(newGifs)
}

function renderGifs() {
  getGifs(jsonPath)
  .then((result) => {
    setTimeout(() => {
      mb.window.webContents.send('update-template', result)
    }, 500)
  })
}

function writeGifsToFile(gifs) {
  var jsonGifs = JSON.stringify(gifs)

  fs.writeFile(jsonPath, jsonGifs, err => {
    if (err) throw err
  })
  renderGifs()
}

function randomString(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let string = ''
  for (var i = length; i > 0; i -= 1) {
    string += chars[Math.floor(Math.random() * chars.length)]
  }
  return string
}
