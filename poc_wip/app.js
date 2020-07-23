function getCurrentSeconds() {
  return Math.round(new Date().getTime() / 1000.0);
}

function stripSpaces(str) {
  return str.replace(/\s/g, '');
}

class Form {
  constructor({secret_key, issuer}) {
    this.secret_key = secret_key;
    this.issuer = issuer;
  }
}

const app = new Vue({
  el: '#app',
  data: {
    secret_key: 'JBSWY3DPEHPK3PXP',
    secret_pair: new Form({secret_key: '', issuer: ''}),
    secret_pairs: [],
    updatingIn: 0,
    token: null,
    current_token: null
  },

  mounted() {
    if (localStorage.getItem('secret_pairs')) {
      try {
        this.secret_pairs = JSON.parse(localStorage.getItem('secret_pairs'));
      } catch(e) {
        localStorage.removeItem('secret_pairs')
      }
    }

    this.update();
    this.intervalTimer = setInterval(this.update, 1000);
  },

  destroyed() {
    clearInterval(this.intervalTimer);
  },

  computed: {
    totp() {
      return new OTPAuth.TOTP({
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromB32(stripSpaces(this.secret_key))
      });
    },
    createPassword() {
      return new OTPAuth.TOTP({
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromB32(stripSpaces(this.current_token))
      });
    }
  },

  methods: {
    update() {
      this.updatingIn = 30 - (getCurrentSeconds() % 30);
      // this.token = this.totp.generate();
      // this.current_token = this.createPassword(this.secret_pair.secret_key).generate();

      if (!this.current_token) {
        return
      }
      Vue.set(app, 'token', this.createPassword.generate())
    },

    addSecretPair(e) {
      if (!this.secret_pair) {
        return
      }

      Vue.set(app.secret_pair, 'token', this.totp.generate())

      this.secret_pairs.push(this.secret_pair);
      this.secret_pair = { secret_key: '', issuer: '', token: '' };
      this.saveSecretPairs();
    },

    removeSecretPair(key) {
      this.secret_pairs.splice(key, 1);
      this.saveSecretPairs();
    },

    saveSecretPairs() {
      const parsed = JSON.stringify(this.secret_pairs);
      localStorage.setItem('secret_pairs', parsed);
    },

    selectSecretPair(index) {
      Vue.set(app, 'current_token', this.secret_pairs[index].secret_key);
      Vue.set(app, 'token', this.createPassword.generate());
      // Vue.set(app, 'current_token', this.createPassword.generate());

      // this.current_token = index;
      // this.current_token = this.secret_pairs[index].secret_key
      // this.current_token this.createPassword(this.secret_pairs.find(x).secret_key).generate();
    }
  }
});
