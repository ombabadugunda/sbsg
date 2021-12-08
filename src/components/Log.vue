<template>
  <div class="news">
    <div class="news__content">
      <h1 class="login__title"> State Building Simulation Game </h1>
            <label v-if="getUserEmail === ''" class="login__label" for="email">
              <input class="login__input" type="text" v-model="email" placeholder="Введіть ваш e-mail" id="email" name="email" >
            </label>
            <button v-if="getUserEmail === ''" @click='setEmail(email)' class="button button--center button--medium">Увійти</button>
            <label v-if="getUserEmail !== ''" class="login__label" for="username">
              <input class="login__input" type="text" v-model="username" placeholder="Введіть ваше ім'я" id="username" name="username" >
            </label>
            <label v-if="getUserEmail !== ''" class="login__label" for="text">
              <input class="login__input" v-model="gameID" type="text" placeholder="ID гри" id="gameId" name="gameId" >
            </label>
            <bucurrtton v-if="getUserEmail !== ''" @click='setUserGame(gameID, username)' class="button button--center button--medium">Увійти</bucurrtton>
    </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
  data () {
    return {
      show: true,
      gameID: '',
      email: '',
      username: ''
    }
  },
  methods: {
    setEmail (email) {
      if (email === '') {
        Notify.create({
          message: 'Введіть вашу електронну адресу',
          color: 'red'
        })
      } else {
        this.$store.dispatch('setEmail', email)
      }
    },
    setUserGame (gameID, username) {
      if (username === '') {
        Notify.create({
          message: 'Введіть ваше ім\'я',
          color: 'red'
        })
      } else if (gameID === '') {
        Notify.create({
          message: 'Введіть ID гри',
          color: 'red'
        })
      } else {
        var user = {
          username,
          gameID
        }
        this.$store.dispatch('setUserGame', user)
      }
    }
  },
  created () {
  },
  computed: {
    ...mapGetters([
      'getUserEmail',
      'getGames',
      'getCurrentGame',
      'getUsers'
    ])
  }
}
</script>
