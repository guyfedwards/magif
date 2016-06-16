const Clipboard = require('clipboard');
const ipc = require('ipc');

const addButton = document.querySelector('.js-add')
const quitButton = document.querySelector('.js-quit')
const input = document.querySelector('.js-gif-input')
const outlet = document.querySelector('.js-outlet')

const clipboard = new Clipboard('.gif-item')

clipboard.on('success', e => {
  ipc.send('hide-window')
})

ipc.on('update-template', (arg) => {
  updateGifs(arg)
})

addButton.addEventListener('click', () => {
  let inputString = input.value
  let gifObj = parseInput(inputString)

  input.value = ''

  ipc.send('add-gif', gifObj)
})

quitButton.addEventListener('click', () => {
  ipc.send('quit')
})

function parseInput(string) {
  let strArr = string.split(' ')
  let url = strArr[0]
  let tags = strArr.splice(1)

  return {
    url: url,
    tags: tags
  }
}

function updateGifs(gifs) {
  outlet.innerHTML = ''

  gifs.forEach((curr, ind) => {
    outlet.appendChild(gifItemTemplate(curr))
  })

  addGifItemEventListeners()
}

function gifItemTemplate(gif) {
  let el = document.createElement('div')
  let frameLink = getFrameUrl(gif.link)

  el.className = 'gif-item'
  el.setAttribute('data-clipboard-text', gif.link)
  el.style.backgroundImage = `url("${frameLink}")`
  el.setAttribute('data-gif-url', gif.link)

  return el
}

function getFrameUrl(link) {
  const isGiphy = /giphy/.test(link)

  if (isGiphy) {
    let regex = /giphy\.gif/

    return link.replace(regex, '200_s.gif')
  } else {
    let regex = /giphy\.gif/

    return link.replace(regex, '200_s.gif')
  }
}

function switchGifWithFrame(el) {
  const gifUrl =  stripUrlString(el.getAttribute('data-gif-url'))
  const frameUrl = stripUrlString(el.style.backgroundImage)

  el.setAttribute('data-gif-url', frameUrl)
  el.style.backgroundImage = `url("${gifUrl}")`
}

function addGifItemEventListeners() {
  const items = Array.from(document.querySelectorAll('.gif-item'))

  items.forEach((curr, ind) => {
    curr.addEventListener('mouseenter', e => {
      switchGifWithFrame(e.target)
    })
    curr.addEventListener('mouseleave', e => {
      switchGifWithFrame(e.target)
    })
  })
}

function stripUrlString(str) {
  return str.replace(/url\("/, '').replace(/"\)/, '')
}
