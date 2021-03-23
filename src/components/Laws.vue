<template>
  <div class="news">
      <div class="container">
        <div v-for="(law, index) in getLawsCat()" v-bind:key="index" class="news__content">
          <div class="news__block">
            <h3 class="news__title">{{ law.text }}</h3>
            <div v-for="(change, index) in getLawsChange(law)" v-bind:key="index" class="news__text">
              <p>{{ change.name }}:  <span v-bind:class="{ add__plus: change.params > 0 }">{{ change.params }}</span></p>
            </div>
            <div class="rooms__main-button" v-if="getCurrentGame.gamePhase == 'Vote pushing' && !getPushedLaws.includes(law.text) && !getAdoptedLaws.includes(law.text)">
              <q-btn @click="pushForVoting(law)" class="button button--small-font button--medium button--center">Висунути на голосування</q-btn>
            </div>
            <div class="rooms__main-button" v-if="getCurrentGame.gamePhase == 'Vote pushing' && getPushedLaws.includes(law.text)">
              <q-btn class="disabled button button--small-font button--medium button--center">Закон на голосуванні</q-btn>
            </div>
            <div class="rooms__main-button" v-if="getAdoptedLaws.includes(law.text)">
              <q-btn class="disabled button button--small-font button--medium button--center">Закон прийнятий</q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Laws',
  props: [],
  data () {
    return {
    }
  },
  components: {
  },
  methods: {
    pushForVoting (law) {
      this.$store.dispatch('pushForVoting', law)
    },
    getLawsCat () {
      var laws = []
      for (var lawCat in this.getLaws) {
        if (this.getLaws[lawCat].category === this.getUser.currentCategorie) {
          laws.push(this.getLaws[lawCat])
        }
      }
      return laws
    },
    getLawsChange (law) {
      var changes = []
      for (var change in law.change) {
        if (change !== 'special_1' && change !== 'special_2' && change !== 'wellbeing') {
          changes.push({
            name: change,
            params: law.change[change]
          })
        }
      }
      return changes
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getCurrentGame',
      'getLaws'
    ]),
    getLawsList () {
      var laws = []
      for (var law in this.getLaws) {
        if (this.getLaws[law].category === this.getUser.currentCategorie) {
          laws.push(this.getLaws[law])
        }
      }
      return laws
    },
    getPushedLaws () {
      var pushed = []
      for (var pushedLaw in this.getCurrentGame[this.getCurrentGame.gameStage].laws) {
        pushed.push(pushedLaw)
      }
      return pushed
    },
    getAdoptedLaws () {
      var adopted = []
      for (var stage in this.getCurrentGame) {
        for (var adopt in this.getCurrentGame[stage].adopted) {
          adopted.push(adopt)
        }
      }
      return adopted
    }
  }
}
</script>
