<template>
    <div class="news">
      <div class="container">
        <div class="news__content">
          <div class="news__block">
            <h3 class="news__title">Конституція Марсії</h3>
            <div class="news__text">
              <ul>
                1. Носієм суверенітету і єдиним джерелом влади в Марсії є народ.<br>
                2. Марсія – демократична держава. Закони приймаються на загальних зборах представників десяти соціальних груп.<br>
                3. Під час голосування представники кожної соціальної групи мають віддати свої голоси за три закони. До виконання
                буде прийнято всі закони, що набрали більше, ніж три голоси.<br>
                4. Представник кожної соціальної групи має право говорити та бути почутим іншими. Свобода слова знаходиться під
                захистом конституції.<br>
                5. Всі закони заздалегідь люб'язно написані шановними лідерами Марса, які також вирішують всі спірні питання
              </ul>
            </div>
          </div>
            <div class="news__block">
              <h3 class="news__title">Інформація про поточну гру</h3>
              <div class="news__text">
                <a v-if="getGame.gamePhase == 'Game ended'" style="width: 300px" class="button button--small-font button--small button--center" href="https://forms.gle/iGEC9cHCnGfswGx77" target="_blank">Залиште відгук про гру, будь ласка!</a>
                <h6>ID гри: {{ getUser.gameID }} </h6>
                <h6>Назва гри: {{ getGame.name }} </h6>
                <h6>Ваша група: {{ getUser.group }} </h6>
                <h6>Ваше ім'я: {{ getUser.username }} </h6>
                <h6 v-if="getGame.gameStyle == 'Minecraft' && getUser.group != 'Admin'">Логін до Minecraft: {{ minePasses[getUser.playerNumber + 1]['name'] }} </h6>
                <h6 v-if="getGame.gameStyle == 'Minecraft' && getUser.group != 'Admin'">Пароль до Minecraft: {{ minePasses[getUser.playerNumber + 1]['password'] }} </h6>
                <a v-if="getGame.gameStyle == 'Minecraft'" style="width: 300px" class="button button--small-font button--small button--white" href="https://drive.google.com/file/d/1WPBFJxqU8K5Q7UElV_streTDW8w_Bxat/view?usp=sharing" target="_blank">Завантажити гру для Windows</a>
                <a v-if="getGame.gameStyle == 'Minecraft'" style="width: 300px" class="button button--small-font button--small button--white" href="https://drive.google.com/file/d/1WPBFJxqU8K5Q7UElV_streTDW8w_Bxat/view?usp=sharing" target="_blank">Завантажити гру для Windows</a>
                <a v-if="getGame.gameStyle == 'Meet'" style="width: 300px" class="button button--small-font button--small button--white" v-bind:href="getBackground" target="_blank">Завантажити фон для Meet</a>
                <h6>Раунд гри: {{ getGame.gameStage }} </h6>
                <h6>Фаза гри: {{ getGame.gamePhase }} </h6>
                <h6>Ваша група може висунути законів в цьому раунді: {{ getGame.groups[getUser.group].pushes }} </h6>
                <h6>Ваша група може проголосувати в цьому раунді: {{ getGame.groups[getUser.group].votes }} </h6>
                <h6>Голосів потрібно для прийняття закону: {{ getGame.rules.adoption_number }} </h6>
                <h6>Тип гри: {{ getGame.gameStyle }} </h6>
                <h6>Всього раундів: 6 </h6>
                <h6>Часові інтервали для першого раунду</h6>
                <ul>
                  <li>обговорення: 15</li>
                  <li>висування законів: 5</li>
                  <li>голосування: 5</li>
                  <li>підведення підсумків: 3</li>
                </ul>
                <h6>Часові інтервали для наступних раундів  </h6>
                <ul>
                  <li>обговорення: 10</li>
                  <li>висування законів: 3</li>
                  <li>голосування: 3</li>
                  <li>підведення підсумків: 3</li>
                </ul>
              </div>
            </div>
            <div class="news__block">
              <h3 class="news__title">Інформація про учасників гри</h3>
              <div class="news__text">
                <div v-for="(group, index) in getGroups" v-bind:key="index">
                  <h6>{{ group }}</h6>
                  <ul>
                    <div v-for="(player, index2) in getPlayers(group)" v-bind:key="index2">
                    <li>
                      {{index2 }}. Ім'я: {{player.name}}, Email:  {{player.email}} <br>
                    </li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import { mapGetters } from 'vuex'
import minePasses from '../json/minepasses.json'
import { groups } from '../json/groups.js'

export default {
  name: 'News',
  data () {
    return {
      minePasses
    }
  },
  components: {
  },
  methods: {
    getPlayers (group) {
      var players = {}
      var i = 1
      for (var user in this.getUsers) {
        if (this.getUsers[user].gameID === this.getUser.gameID) {
          if (this.getUsers[user].group === group) {
            players[i] = {}
            players[i].name = this.getUsers[user].username
            players[i].email = this.getUsers[user].email
            i++
          }
        }
      }
      return players
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getUsers',
      'getLaws',
      'getGame',
      'getGames'
    ]),
    getGroups () {
      return groups
    },
    getBackground () {
      var background = ''
      if (this.getUser.group === 'Бізнес') {
        background = 'https://drive.google.com/file/d/1Jw3Ls_SoC0GS_F556NL1Teyth6g-kVwl/view?usp=sharing'
      }
      if (this.getUser.group === 'Чиновники') {
        background = 'https://drive.google.com/file/d/1rR2R8vNB619YQuBwLXmYpHUFmauPbCYa/view?usp=sharing'
      }
      if (this.getUser.group === 'Пенсіонери') {
        background = 'https://drive.google.com/file/d/1kYK2QIR1wFwVJ9ZgjBHJotjIM5MQwJFI/view?usp=sharing'
      }
      if (this.getUser.group === 'Митці та культурні діячі') {
        background = 'https://drive.google.com/file/d/1nTLOGGLcLQN7luVFAbNF-5HrbHYVEUlf/view?usp=sharing'
      }
      if (this.getUser.group === 'Співробітники правоохоронних органів і судді') {
        background = 'https://drive.google.com/file/d/1zr80HDqLibZbfqpCO-cRhfl67O5fog5H/view?usp=sharing'
      }
      if (this.getUser.group === 'ЗМІ') {
        background = 'https://drive.google.com/file/d/1C2ZMf6VgsrL9mRmavSoItdMX96bWzVfu/view?usp=sharing'
      }
      if (this.getUser.group === 'Громадські активісти') {
        background = 'https://drive.google.com/file/d/1Cn7doi3VsImWxGWsLqdLbFERLQR7lDaq/view?usp=sharing'
      }
      if (this.getUser.group === 'Бюджетники') {
        background = 'https://drive.google.com/file/d/12QjCcV1TSgvj5J4WaQXTRxEAyOfLi497/view?usp=sharing'
      }
      if (this.getUser.group === 'Військовослужбовці') {
        background = 'https://drive.google.com/file/d/1JBvuQ0QQ_TVC_6d2CcihOS_3nBEtx78U/view?usp=sharing'
      }
      if (this.getUser.group === 'Вразливі верстви населення') {
        background = 'https://drive.google.com/file/d/1q3yDlAOiYjHlGXct2eMCCFsOtPeJxCga/view?usp=sharing'
      }
      return background
    }
  }
}
</script>
