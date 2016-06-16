const fs = require('fs')
const ipc = require('ipc')
const menubar = require('menubar')
const { setApplicationMenu } = require('menu')
const menu = require('./src/menu')

const mb = menubar()

const jsonPath = mb.app.getPath('userData') + '/' + 'gifs.json'

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
      link: gif.url,
      tags: gif.tags
    })
    var jsonGifs = JSON.stringify(newGifs)

    fs.writeFile(jsonPath, jsonGifs, err => {
      if (err) throw err
    })
    renderGifs()
  })
}

function renderGifs() {
  getGifs(jsonPath)
  .then((result) => {
    setTimeout(() => {
      mb.window.webContents.send('update-template', result)
    }, 500)
  })
}
