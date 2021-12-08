<template>
    <div class="news">
    <div class="news__content">
          <div class="admin__block">
            <h3 class="news__title">Згенерувати нову гру</h3>
            <div class="news__text">
              <p>Оберіть ігрові опції та натисніть "Згенерувати гру" </p>
            </div>
              <div class="news__text">
                <q-radio v-model="gameStyle" val="Minecraft" label="Minecraft" /><br>
                <q-radio v-model="gameStyle" val="Meet" label="Meet" /><br>
              </div>
              <q-select class="admin__select" rounded borderless v-model="pushes" :options="[1, 2, 3, 4, 5]" label="Кількість законів, що може висунути одна група" />
              <q-select class="admin__select" rounded borderless v-model="votes" :options="[1, 2, 3, 4, 5]" label="Кількість законів, за які може проголосувати одна група" />
              <q-select class="admin__select" rounded borderless v-model="adoption_number" :options="[1, 2, 3, 4, 5]" label="Кількість голосів, що потрібна для прийняття закону" />
              <input class="login__input" type="text" v-model="gameName" placeholder="Назва гри">
              <button class="button button--small-font button--small button--white" @click="generateGame()">Згенерувати гру</button>
          </div>
          <div class="admin__block">
            <h3 class="news__title">Дані по всім іграм</h3>
            <div class="news__text" v-for="(game, index) in getGames" v-bind:key="index">
                    <q-expansion-item
                    expand-separator
                    icon="videogame_asset"
                    :label="game.name"
                    :caption="index"
                    >
              <q-separator/>
              <q-separator/>
              </q-expansion-item>
            </div>
          </div>
          </div>
          </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { groups } from '../json/groups.js'

export default {
  name: 'Superadmin',
  data () {
    return {
      gameStyle: 'Minecraft',
      new_news: {
        title: '',
        text: '',
        author: 'Адміністрація'
      },
      playersNumber: 10,
      pushes: 3,
      votes: 3,
      adoption_number: 3,
      gameName: 'Game Name'
    }
  },
  computed: {
    ...mapGetters([
      'getGames'
    ])
  },
  components: {
  },
  methods: {
    renewGame () {
      this.allGames = this.getSuperadminSet
    },
    generateGame () {
      var currentTime = Date.now().toString()
      var newsText = `Ми раді вітати Вас у незалежній країні Марсія! Скоро почнеться розбудова нашої великої та червоної держави! Make Marsia great again!<br>

Ознайомтесь з інформацією для нових прибульців з Землі.

Ваше головне завдання – піклуватися про інтереси вашої команди та процвітання держави Марсії загалом.<br>
Є 50 законів, за які можна проголосувати. Усі вони знаходяться в розділі “Закони”. <br>
Гра ділиться на раунди. У кожному ви можете обговорювати з іншими командами закони, які 
вважаєте за необхідне проголосувати.<br>
Під час реєстрації всі учасники було рівномірно розподілені між 10 командами. <br>
У процесі обговорення кнопка “голосування” не буде активною, тільки під час самого цього процесу.<br>
Обговорення відбуватимуться в окремих кімнатах Google Meets. <br>
У розділі “Команди” знаходяться посилання на кімнати кожної команди. Представники груп можуть обговорювати 
з іншими командами закони, за які вони хотіли б проголосувати, переходячи з однієї кімнати в іншу. <br>
В кожному раунді кожна група може вибрати три закони і запропонувати їх для голосування. <br>
Для цього вам треба позначити ці закони, і вони перемістяться до розділу “Голосування”. <br>
У ньому кожен зможе побачити закони, висунуті іншими командами.<br>
Після обговорень модератори оголосять початок голосування. <br>
Представник вашої команди повинен натиснути кнопку "Проголосувати" на обраному вами законі. <br>
Усі голоси будуть підраховані автоматично. <br>
Прийнятими вважаються ті закони, які загалом набрали більше трьох голосів від усіх команд. <br>
Модератори підведуть підсумки туру та розпочнуть новий.<br>
У вкладці «Статистика» ви можете знайти параметри «Рейтингів груп» та «Рівня добробуту». <br>
Кожен запроваджений закон має на них позитивний чи негативний вплив, додаючи чи віднімаючи 
кількість балів. «Рейтинг груп» – це накопичені гравцями бали. «Рівень добробуту» – це графік, 
що відображає кілька параметрів, які визначатимуть поточний стан країни: Економіка, Політичні права, Якість життя та Безпека.
Доля Марсії у ваших руках!`
      var currentGame = {
        numberOfPlayers: 0,
        gameStyle: this.gameStyle,
        rules: {
          pushes: this.pushes,
          votes: this.votes,
          adoption_number: this.adoption_number
        },
        news: {
          [currentTime]: {
            title: 'Вітаємо у Марсії!',
            text: newsText,
            author: 'Адміністрація Марсії'
          }
        },
        1: {},
        gameID: 'G-' + currentTime.substring(7),
        gameCreation: new Date(Number(currentTime)).toLocaleDateString('uk-UA') + ' ' + new Date(Number(currentTime)).toLocaleTimeString('uk-UA'),
        name: this.gameName,
        gameStage: 0,
        gamePhase: 'Registration',
        groups: {},
        wellbeing: {
          Економіка: 15,
          'Політичні права': 15,
          'Якість життя': 15,
          Безпека: 15
        }
      }
      function getRandomInt (min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
      }
      currentGame.login_set = {}
      for (var group of groups) {
        currentGame.groups[group] = {}
        currentGame.groups[group].stats = getRandomInt(20, 31)
        currentGame.groups[group].pushes = this.pushes
        currentGame.groups[group].votes = this.votes
        currentGame.login_set[group] = { accounts: '' }
        currentGame.login_set[group] = {}
        currentGame.timing = {}
        currentGame.timing.timeToNextRound = 0
        currentGame.timing.timeToNextRound = 0
      }
      currentGame.groups.Admin = []
      currentGame.groups.Admin.pushes = 10
      currentGame.groups.Admin.votes = 10
      currentGame.groups.Observer = []
      currentGame.groups.Observer.pushes = 0
      currentGame.groups.Observer.votes = 0
      currentGame['1'] = {}
      currentGame['1'].pushedLaws = {}
      currentGame['2'] = {}
      currentGame['2'].pushedLaws = {}
      currentGame['3'] = {}
      currentGame['3'].pushedLaws = {}
      currentGame['4'] = {}
      currentGame['4'].pushedLaws = {}
      currentGame['5'] = {}
      currentGame['5'].pushedLaws = {}
      currentGame['6'] = {}
      currentGame['6'].pushedLaws = {}
      this.$store.dispatch('createNewGame', currentGame)
    }
  }
}
</script>
