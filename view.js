const Clipboard = require('clipboard');
const ipc = require('ipc');

const addButton = document.querySelector('.js-add')
const input = document.querySelector('.js-gif-input')
const outlet = document.querySelector('.js-outlet')

const clipboard = new Clipboard('.gif-item')

clipboard.on('success', e => {
  ipc.send('hide-window')
})

ipc.on('update-template', (arg) => {
  updateGifs(arg)
})

addButton.addEventListener('click', e => {
  let gifUrl = input.value
  ipc.send('add-gif', gifUrl)
})

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
