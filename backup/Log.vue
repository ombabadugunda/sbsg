<template>
  <div class="news">
    <div class="news__content">
      <h1 class="login__title"> State Building Simulation Game </h1>
            <label class="login__label" for="email">
              <input class="login__input" type="text" v-model="email" placeholder="Введіть ваш e-mail" id="email" name="email" >
            </label>
            <label class="login__label" for="username">
              <input class="login__input" type="text" v-model="username" placeholder="Введіть ваше ім'я" id="email" name="email" >
            </label>
            <label class="login__label" for="text">
              <input class="login__input" v-model="gameID" type="text" placeholder="ID гри" id="gameId" name="gameId" >
            </label>
            <button @click='logUser(gameID, email, username)' class="button button--center button--medium">Увійти</button>
    </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
    logUser (law) {
      this.$store.dispatch('logUser', law)
    }
  },
  created () {
  },
  computed: {
    ...mapGetters([
      'getGroups'
    ])
  }
}
</script>
