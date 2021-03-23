<template>
  <q-page class="flex flex-center">
     <section class="main-container container">
        <log v-if="getUser.currentPage == 'Log'">
        </log>
        <superadmin v-if="getUser.currentPage == 'Superadmin'">
        </superadmin>
        <rooms
        v-if="getUser.currentPage == 'Rooms'">
        </rooms>
        <statistics
        v-if="getUser.currentPage == 'Statistics'">
        </statistics>
        <categories
        v-if="getUser.currentPage == 'Categories'">
        </categories>
        <laws
        v-if="getUser.currentPage == 'Laws'"
        ></laws>
        <news
        v-if="getUser.currentPage == 'News'"
        ></news>
        <admin
        v-if="getUser.currentPage == 'Admin'"
        ></admin>
        <voting
        v-if="getUser.currentPage == 'Voting'"
        ></voting>
        <rules
        v-if="getUser.currentPage == 'Rules'"
        ></rules>
        <quiz
        v-if="getUser.currentPage == 'Start_quiz'"
        ></quiz>
      </section>

  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
  },
  mounted () {
  },
  components: {
    categories: require('components/Categories.vue').default,
    statistics: require('components/Statistics.vue').default,
    rooms: require('components/Rooms.vue').default,
    news: require('components/News.vue').default,
    laws: require('components/Laws.vue').default,
    log: require('components/Log.vue').default,
    voting: require('components/Voting.vue').default,
    admin: require('components/Admin.vue').default,
    superadmin: require('components/Superadmin.vue').default,
    rules: require('components/Rules.vue').default,
    quiz: require('components/Start_quiz.vue').default
  }
}
</script>
