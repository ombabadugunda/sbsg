
<template>
  <q-layout view="hHh lpR lFf">
      <router-view />

  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  computed: {
    ...mapGetters([
      'getUser',
      'getCurrentGame'
    ])
  },
  methods: {
    changePage (page) {
      this.$store.commit('setPage', page)
    }
  },
  components: {
  }
}
</script>
