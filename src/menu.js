const { buildFromTemplate } = require('menu')
const menu = buildFromTemplate([{
  label: 'Application',
  submenu: [
    {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'}
  ]
}])

module.exports = menu
