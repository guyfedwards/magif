const Clipboard = require('clipboard');
const ipc = require('ipc');

const addButton = document.querySelector('.js-add')
const quitButton = document.querySelector('.js-quit')
const input = document.querySelector('.js-gif-input')
const outlet = document.querySelector('.js-outlet')

const clipboard = new Clipboard('.gif-item__gif')

clipboard.on('success', e => {
  ipc.send('hide-window')
})

ipc.on('update-template', (arg) => {
  updateGifs(arg)
})

document.querySelector('body').addEventListener('click', (e) => {
  if (e.target.classList.contains('js-delete')) {
    const id = e.target.parentElement.getAttribute('data-id')
    ipc.send('delete', id);
  }
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
  const template = document.createElement('template')
  const frameLink = getFrameUrl(gif.link)
  const html = `
    <div class="gif-item" data-id="${gif.id}">
      <div class="gif-item__gif"
           style="background-image:url(${frameLink})"
           data-clipboard-text="${gif.link}"
           data-gif-url="${gif.link}"></div>

      <svg class="gif-item__delete js-delete" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="white" viewBox="0 0 24 24"><path d="M12 0c-4.992 0-10 1.242-10 3.144 0 .406 3.556 18.488 3.633 18.887 1.135 1.313 3.735 1.969 6.334 1.969 2.601 0 5.199-.656 6.335-1.969.081-.404 3.698-18.468 3.698-18.882 0-2.473-7.338-3.149-10-3.149zm0 1.86c4.211 0 7.624.746 7.624 1.667 0 .92-3.413 1.667-7.624 1.667s-7.625-.746-7.625-1.667 3.415-1.667 7.625-1.667zm4.469 19.139c-.777.532-2.418 1.001-4.502 1.001-2.081 0-3.72-.467-4.498-.998l-.004-.021c-1.552-7.913-2.414-12.369-2.894-14.882 3.55 1.456 11.304 1.455 14.849-.002-.868 4.471-2.434 12.322-2.951 14.902z"/></svg>
    </div>
  `

  template.innerHTML = html

  return template.content
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
  const items = Array.from(document.querySelectorAll('.gif-item__gif'))

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
