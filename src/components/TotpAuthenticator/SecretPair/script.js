import * as OTPAuth from 'otpauth'
import { ToastProgrammatic as Toast } from 'buefy'
import { DialogProgrammatic as Dialog } from 'buefy'

function strip(str) {
  return str.replace(/\s/g, '');
}

// ==================
// NAME
// ==================

const name = 'SecretPair'

// ==================
// COMPONENTS
// ==================
const components = {}

// ==================
// PROPS
// ==================
const props = {
  indexKey: '',
  secretPairKey: { type: String, required: true },
  secretPairIssuer: { type: String, required: true }
}

// ================
// DATA
// ================
const data = function () {
  return {
    token: ''
  }
}

// ================
// COMPUTED
// ================
const computed = {}

// ================
// MOUNTED
// ================
const mounted = function () {
  this.refreshToken()
  this.intervalTimer = setInterval(this.refreshToken, 1000)
}

// =================
// METHODS
// =================
const createPasswordNow = function () {
  const passwordToken = new OTPAuth.TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromB32(strip(this.secretPairKey))
  }).generate();

  this.$set(this, 'token', passwordToken)
}

const refreshToken = function () {
  this.createPasswordNow()
}

const removeSecretPair = function () {
  Dialog.confirm({
    title: 'Delete Password for ' + this.secretPairIssuer,
    message:'Are you sure you want to delete this?',
    type: 'is-danger',
    hasIcon: true,
    focusOn: 'cancel',
    animation: 'zoom-out',
    cancelText: 'Cancel',
    confirmText: 'Delete Password',
    onConfirm: () => this.$parent.removeSecretPair(this.indexKey)
  })
}

const onCopy = function (e) {
  Toast.open({
    message: 'You copied: ' + e.text,
    duration: 3000,
    position: 'is-bottom'
  })
}

const onError = function (e) {
  Toast.open({
    message: 'Failed to copy password' + e.text,
    duration: 4000,
    position: 'is-bottom'
  })
}

export default {
  name,
  components,
  props,
  data,
  computed,
  mounted,
  methods: {
    createPasswordNow,
    refreshToken,
    removeSecretPair,
    onCopy,
    onError
  }
}
