<template>
  <div class="login">
      <div class="container">
        <h1 class="login__title"> State Building Simulation Game </h1>
            <label class="login__label" for="username">
              <input class="login__input" type="text" v-model="username" placeholder="Ім'я" id="username" name="username" >
            </label>
            <label class="login__label" for="password">
              <input class="login__input" v-model="id" type="password" placeholder="Код" id="password" name="password" >
            </label>
            <q-btn @click='logUser(id, username)' class="button button--center button--big">Увійти</q-btn>
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
      id: '',
      username: ''
    }
  },
  methods: {
    logUser (id, username) {
      if (username === '') {
        Notify.create({
          message: 'Введіть ім\'я гравця!',
          color: 'red'
        })
      } else {
        var user = {
          id: id,
          username: username
        }
        this.$store.dispatch('loginUser', user)
      }
    }
  },
  computed: {
    ...mapGetters([
      'getGroups'
    ])
  }
}
</script>
