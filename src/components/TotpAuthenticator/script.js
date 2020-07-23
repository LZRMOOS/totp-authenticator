import SecretPair from './SecretPair/SecretPair'

function currentSecs() {
  return Math.round(new Date().getTime() / 1000.0)
}

// ==================
// NAME
// ==================
const name = 'TotpAuthenticator'

// ==================
// COMPONENTS
// ==================
const components = {
  SecretPair
}

// ==================
// PROPS
// ==================
const props = {}

// ================
// DATA
// ================
const data = function () {
  return {
    newSecretPair: {
      secretKey: '',
      secretIssuer: ''
    },
    file: null,
    secretPairs: [],
    updatingIn: 0
  }
}

// ================
// COMPUTED
// ================
const isComplete = function () {
  if (this.newSecretPair.secretKey && this.newSecretPair.secretIssuer) {
    if(this.newSecretPair.secretKey.length === 16) {
      return true
    }
  }
}

// ================
// MOUNTED
// ================
const mounted = function () {
  if (localStorage.getItem('secretPairs')) {
    try {
      this.secretPairs = JSON.parse(localStorage.getItem('secretPairs'))
    } catch(e) {
      localStorage.removeItem('secretPairs')
    }
  }

  this.updateProgressBar()
  this.intervalTimer = setInterval(this.updateProgressBar, 1000)
}

// =================
// METHODS
// =================
/**
 * Creates a new item from the value of newItem
 * and pushes it into the secretPairs list
 */

const updateProgressBar = function () {
  this.updatingIn = 30 - (currentSecs() % 30)
}

const addSecretPair = function () {
  if (!this.newSecretPair.secretKey || !this.newSecretPair.secretIssuer) return

  this.secretPairs.push(this.newSecretPair)
  this.newSecretPair = { secretKey: '', issuer: '' }
  this.saveSecretPairs()
}

const removeSecretPair = function (indexKey) {
  this.secretPairs.splice(indexKey, 1)
  this.saveSecretPairs()
}

const saveSecretPairs = function () {
  const parsed = JSON.stringify(this.secretPairs)
  localStorage.setItem('secretPairs', parsed)
}

const downloadBackup = function () {
  let backup = encodeURIComponent(JSON.stringify(localStorage.getItem('secretPairs')))
  const a = document.createElement('a')
  a.setAttribute('href', 'data:text/plain;charset=utf-8,'+ backup)
  a.setAttribute('download', 'backup.json')
  a.click()
}

const restoreBackup = function () {
  const reader = new FileReader()
  reader.onload = persistFile

  if(this.file) {
    reader.readAsText(this.file)
  }

  function persistFile (event) {
    const backup = JSON.parse(event.target.result)
    window.localStorage.setItem('secretPairs', backup)

    location.reload()
  }
}

export default {
  name,
  components,
  props,
  data,
  mounted,
  computed: {
    isComplete
  },
  methods: {
    updateProgressBar,
    addSecretPair,
    saveSecretPairs,
    removeSecretPair,
    restoreBackup,
    downloadBackup
  }
}
