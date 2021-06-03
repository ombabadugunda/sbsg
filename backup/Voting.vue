<template>
    <div class="news">
      <div class="news__content">
          <div v-if="getCurrentGame.gameStage == '0'" class="news__block">
            <h3 class="news__title">Тут будуть з'являтись закони, що були висунуті на голосування</h3>
          </div>
          <div v-if="getCurrentGame.gameStage != '0'" class="news__block">
            <div v-for="(stage, index) in getStages" v-bind:key="index" class="news__content">
              <q-expansion-item
                expand-separator
                :label=getRoundName(Object.keys(stage)[0])
                header-class="news__title"
              >
              <div v-for="(law, name, index2) in getLawsForStage(stage)" v-bind:key="index2" >
                <div class="news__block">
                  <h3 class="news__title">{{ name }}</h3>
                  <div v-for="(change, index) in getLawsChange(law)" v-bind:key="index" class="news__text">
                    <p>{{ change.name }}:  <span v-bind:class="{ add__plus: change.params > 0 }">{{ change.params }}</span></p>
                  </div>
                  <div class="rooms__main-button" v-if="getCurrentGame.gamePhase == 'Voting' && getCurrentGame.gameStage == Object.keys(stage)[0] && !getVotedGroups(law).includes(getUser.group)">
                    <q-btn @click="voteFor(name)" class="button  button--medium button--center">+ Віддати свій голос +</q-btn>
                  </div>
                  <div class="rooms__main-button" v-if="getCurrentGame.gamePhase == 'Voting' && getCurrentGame.gameStage == Object.keys(stage)[0] && getVotedGroups(law).includes(getUser.group)">
                    <q-btn class="disabled button button--center">Ваша група віддала голос за цей закон</q-btn>
                  </div>
                  <div v-if="(getCurrentGame.gameStage != Object.keys(stage)[0] || getCurrentGame.gamePhase == 'Voting summary') && getVotedGroups(law).length !== 0">
                    <q-separator />
                    <h3 class="news__title">Групи, що віддали свій голос за цей закон</h3>
                    <div v-for="(group, index) in getVotedGroups(law)" v-bind:key="index" class="news__text">
                      <p>{{ group }}</p>
                    </div>
                  </div>
                  <div class="news__title" v-if="getCurrentGame.gameStage != Object.keys(stage)[0] || getCurrentGame.gamePhase == 'Voting summary'">
                    <q-separator />
                    <h4 v-bind:class="{ text__green: law.rating >= getCurrentGame.rules.adoption_number }">Загальна кількість голосів: <strong>{{ law.rating }}</strong></h4>
                  </div>
                  <div v-if="(getCurrentGame.gameStage != Object.keys(stage)[0] || getCurrentGame.gamePhase == 'Voting summary') && law.rating >= getCurrentGame.rules.adoption_number">
                    <q-separator />
                    <h3 class="news__title">Зміни загальних показників</h3>
                    <div v-for="(blago, index) in getBlagoChange(law)" v-bind:key="index" class="news__text">
                      <p>{{ blago.name }}:  <span v-bind:class="{ add__plus: blago.params > 0 }">{{ blago.params }}</span></p>
                    </div>
                  </div>
                </div>
              </div>
              </q-expansion-item>
              <!-- <div v-for="(law, name, index) in getLaws" v-bind:key="index" class="news__content">
                <div class="news__block">
                  <h3 class="news__title">{{ name }}</h3>
                  <div v-for="(change, index) in getLawsChange(law)" v-bind:key="index" class="news__text">
                    <p>{{ change.name }}:  <span v-bind:class="{ add__plus: change.params > 0 }">{{ change.params }}</span></p>
                  </div>
                  <div v-if="getCurrentGame.gamePhase == 'Voting summary' && law.rating >= getCurrentGame.rules.adoption_number">
                    <q-separator />
                    <h3 class="news__title">Зміни загальних показників</h3>
                    <div v-for="(blago, index) in getBlagoChange(law)" v-bind:key="index" class="news__text">
                      <p>{{ blago.name }}:  <span v-bind:class="{ add__plus: blago.params > 0 }">{{ blago.params }}</span></p>
                    </div>
                  </div>
                  <div class="rooms__main-button" v-if="getCurrentGame.gamePhase == 'Voting'">
                    <q-btn @click="voteFor(name)" class="button button--small-font button--medium button--center">+ Віддати свій голос +</q-btn>
                  </div>
                  <div v-if="getCurrentGame.gamePhase == 'Voting summary' && getVotedGroups(law).length !== 0">
                    <q-separator />
                    <h3 class="news__title">Групи, що віддали свій голос за цей закон</h3>
                    <div v-for="(group, index) in getVotedGroups(law)" v-bind:key="index" class="news__text">
                      <p>{{ group }}</p>
                    </div>
                  </div>
                  <div class="news__title" v-if="getCurrentGame.gamePhase == 'Voting summary'">
                    <q-separator />
                    <h4 v-bind:class="{ text__green: law.rating >= getCurrentGame.rules.adoption_number }">Загальна кількість голосів: <strong>{{ law.rating }}</strong></h4>
                  </div>
                </div>
              </div> -->
          </div>
          </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

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
    voteFor (law) {
      this.$store.dispatch('voteFor', law)
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
      return _.orderBy(changes, 'name')
    },
    getBlagoChange (law) {
      var blagos = []
      for (var blago in law.change.wellbeing) {
        blagos.push({
          name: blago,
          params: law.change.wellbeing[blago]
        })
      }
      return blagos
    },
    getVotedGroups (law) {
      var groups = []
      for (var i in law.groups_voted) {
        groups.push(law.groups_voted[i])
      }
      return _.orderBy(groups, 'name')
    },
    getRoundName (round) {
      return 'Раунд ' + round
    },
    getLawsForStage (stage) {
      var laws = stage[Object.keys(stage)[0]].laws
      const orderedLaws = Object.keys(laws).sort().reduceRight(
        (obj, key) => {
          obj[key] = laws[key]
          return obj
        },
        {})
      return orderedLaws
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getCurrentGame',
      'getLaws'
    ]),
    getStages () {
      var stages = []
      for (var elem in this.getCurrentGame) {
        if (!isNaN(elem)) {
          var stageToPush = {}
          stageToPush[elem] = this.getCurrentGame[elem]
          stages.push(stageToPush)
        }
      }
      return stages
    }
    // getLaws () {
    //   const orderedLaws = Object.keys(this.getCurrentGame[this.getCurrentGame.gameStage].laws).sort().reduceRight(
    //     (obj, key) => {
    //       obj[key] = this.getCurrentGame[this.getCurrentGame.gameStage].laws[key]
    //       return obj
    //     },
    //     {})
    //   return orderedLaws
    // }
  }
}
</script>
