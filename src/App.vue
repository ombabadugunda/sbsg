<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import Vue from 'vue'
import Vuex from 'vuex'
import store from '../src/store/index'

Vue.use(Vuex)

export default {
  store,
  name: 'App'
}
</script>
