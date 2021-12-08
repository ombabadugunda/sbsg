<template>
  <div class="news">
    <div class="news__content">
      <div class="news__block">
        <div class="subtitle">
          <h2> Оберіть реформу </h2>
        </div>
        <div v-for="category in getCategories" v-bind:key="category" class="rooms__content">
          <q-expansion-item
                group="accordion"
                expand-separator
                :label=category
                header-class="news__title"
              >
              <div v-for="(law, name, index) in getLawsCat(category)" v-bind:key="index" class="news__content">
          <div class="news__block">
            <h3 class="news__title">{{ law.text }}</h3>
            <div v-for="(change, index) in getLawsChange(law)" v-bind:key="index" class="news__text">
              <p>{{ change.name }}:  <span v-bind:class="{ add__plus: change.params > 0 }">{{ change.params }}</span></p>
            </div>
            <div class="rooms__main-button" v-if="getGame.gamePhase == 'Law pushing' && !getPushedLaws.includes(law.code) && !getAdoptedLaws.includes(law.code)">
              <q-btn @click="pushForVoting(law.code)" class="button button--small-font button--medium button--center">Висунути на голосування</q-btn>
            </div>
            <div class="rooms__main-button" v-if="getGame.gamePhase == 'Law pushing' && getPushedLaws.includes(law.code)">
              <q-btn class="disabled button button--small-font button--medium button--center">Закон на голосуванні</q-btn>
            </div>
            <div class="rooms__main-button" v-if="getAdoptedLaws.includes(law.code)">
              <q-btn class="disabled button button--small-font button--medium button--center">Закон прийнятий</q-btn>
            </div>
          </div>
        </div>
          </q-expansion-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
var _ = require('lodash')

export default {
  name: 'Categories',
  data () {
    return {
    }
  },
  methods: {
    pushForVoting (law) {
      this.$store.dispatch('pushForVoting', law)
    },
    getLawsCat (category) {
      var laws = []
      for (var lawCat in this.getLaws) {
        if (this.getLaws[lawCat].category === category) {
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
      'getGame',
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
      if (this.getGame[this.getGame.gameStage] !== undefined) {
        for (var pushedLaw in this.getGame[this.getGame.gameStage].pushedLaws) {
          pushed.push(pushedLaw)
        }
      }
      return pushed
    },
    getAdoptedLaws () {
      var adopted = []
      for (var stage in this.getGame) {
        for (var law in this.getGame[stage].pushedLaws) {
          if (_.size(this.getGame[stage].pushedLaws[law].groups_voted) >= this.getGame.rules.adoption_number) {
            adopted.push(law)
          }
        }
      }
      return adopted
    },
    getCategories () {
      var categories = []
      for (var law in this.getLaws) {
        if (!categories.includes(this.getLaws[law].category) && (this.getLaws[law].category !== undefined)) {
          categories.push(this.getLaws[law].category)
        }
      }
      return categories
    }
  }
}
</script>
