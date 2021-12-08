<template>
    <div class="container">
      <navbar v-if="getCurrentPage != 'Log' && getCurrentPage != 'Superadmin' && getCurrentPage != 'Start_quiz'" class="header-nav">
      </navbar>
      <div class="break"></div>
      <log v-if="getCurrentPage == 'Log'">
      </log>
      <superadmin v-if="getCurrentPage == 'Superadmin'">
      </superadmin>
      <rooms
      v-if="getCurrentPage == 'Rooms'">
      </rooms>
      <statistics
      v-if="getCurrentPage == 'Statistics'">
      </statistics>
      <categories
      v-if="getCurrentPage == 'Categories'">
      </categories>
      <laws
      v-if="getCurrentPage == 'Laws'"
      ></laws>
      <news
      v-if="getCurrentPage == 'News'"
      ></news>
      <admin
      v-if="getCurrentPage == 'Admin'"
      ></admin>
      <voting
      v-if="getCurrentPage == 'Voting'"
      ></voting>
      <rules
      v-if="getCurrentPage == 'Rules'"
      ></rules>
      <quiz
      v-if="getCurrentPage == 'Start_quiz'"
      ></quiz>
      <div v-if="getCurrentPage != 'Log' && getCurrentPage != 'Superadmin' && getGame.gameStage != 0" class="news">
          <div class="news__block news__title timer ">
            <p>Наступний раунд через: {{ parsedTime }} </p>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  data () {
    return {
      timer: null,
      currentTime: 0,
      timeToNextRound: 0
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUsers',
      'getGame',
      'getCurrentPage',
      'getUserEmail',
      'getGames',
      'getTimer'
    ]),
    parsedTime () {
      // Setting time for Timer

      var date = new Date(-this.getTimer)
      var parsedTime = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
      return parsedTime
    }
  },
  created: function () {
    // Setting game Phase and Round

    this.$store.dispatch('setGames')
    this.$store.dispatch('setUsers')
    var phaseOrder = ['0.Registration']
    for (var i = 1; i < 7; i++) {
      phaseOrder.push(i + '.Discussion')
      phaseOrder.push(i + '.Law pushing')
      phaseOrder.push(i + '.Voting')
      phaseOrder.push(i + '.Voting summary')
    }
    phaseOrder.push('0.Game ended')
    setInterval(() => {
      var currentTime = Date.now()
      if (this.getGame !== undefined && this.getGame.timing[0] !== 0) {
        for (var t in this.getGame.timing) {
          if (this.getGame.timing[t] > currentTime) {
            this.$store.dispatch('setPhase', phaseOrder[t])
            break
          }
        }
        var timeToNextRound = currentTime - this.getGame.timing[t]
        this.$store.dispatch('setTimeToNextRound', timeToNextRound)
      }
    }, 1000)
  },
  components: {
    categories: require('components/Categories.vue').default,
    statistics: require('components/Statistics.vue').default,
    rooms: require('components/Rooms.vue').default,
    news: require('components/News.vue').default,
    log: require('components/Log.vue').default,
    voting: require('components/Voting.vue').default,
    admin: require('components/Admin.vue').default,
    superadmin: require('components/Superadmin.vue').default,
    rules: require('components/Rules.vue').default,
    quiz: require('components/Start_quiz.vue').default,
    navbar: require('components/Nav_bar.vue').default
  }
}
</script>
