<template>
  <q-page>
      <div class="row">
        <div class="col-12">
          <div class="admin__block">
            <h3 class="news__title">Згенерувати нову гру</h3>
            <div class="news__text">
              <p>Оберіть кількість гравців та інші опції та натисніть "Згенерувати гру" </p>
            </div>
              <q-select class="admin__select" rounded borderless v-model="playersNumber" :options="[10, 20, 30, 40]" label="Кількість гравців" />
              <q-select class="admin__select" rounded borderless v-model="pushes" :options="[1, 2, 3, 4, 5]" label="Кількість законів, що може висунути одна група" />
              <q-select class="admin__select" rounded borderless v-model="votes" :options="[1, 2, 3, 4, 5]" label="Кількість законів, за які може проголосувати одна група" />
              <q-select class="admin__select" rounded borderless v-model="adoption_number" :options="[1, 2, 3, 4, 5]" label="Кількість голосів, що потрібна для прийняття закону" />
              <input class="login__input" type="text" v-model="gameName" placeholder="Назва гри">
              <button class="button button--small-font button--small button--white" @click="generateGame()">Згенерувати гру</button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="admin__block">
            <h3 class="news__title">Дані по всім іграм</h3>
            <button class="button button--small-font button--small button--white" @click="renewGame()">Оновити</button>

            <div class="news__text" v-for="(game, index) in allGames" v-bind:key="index">
                    <q-expansion-item
                    expand-separator
                    icon="videogame_asset"
                    :label="index"
                    caption="ID гри"
                    >
              <q-separator/>
              <div v-for="(account, index2) in allGames[index].login_set" v-bind:key="index2">
                <p><strong>{{ index2 }}</strong></p>
                <div v-for="(acc, index3) in allGames[index].login_set[index2]" v-bind:key="index3">
                  <p>Код: {{ index3 }} Ім'я: {{ acc.name }} <br>
                  Результати стартового квізу:<br></p>
                  <div v-for="(quiz, index4) in acc.start_quiz.result" v-bind:key="index4">
                  <p><strong>Питання: {{ index4 }}</strong><br> Відповідь: {{ quiz }} </p>
                </div>
                </div>
                <q-separator/>
              </div>
              <q-separator/>
              </q-expansion-item>
            </div>
          </div>
        </div>
      </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

const allGroups = [
  'Бізнес',
  'Чиновники',
  'Пенсіонери',
  'Митці та культурні діячі',
  'Співробітники правоохоронних органів і судді',
  'ЗМІ',
  'Громадські активісти',
  'Бюджетники',
  'Військовослужбовці',
  'Вразливі верстви населення',
  'Admin'
]

export default {
  name: 'Superadmin',
  data () {
    return {
      allGames: {},
      new_news: {
        title: '',
        text: '',
        author: 'Адміністрація'
      },
      playersNumber: 10,
      pushes: 3,
      votes: 3,
      adoption_number: 1,
      gameName: 'Game Name'
    }
  },
  computed: {
    ...mapGetters([
      'getSuperadminSet'
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
      var newsText = `Ми раді вітати Вас у незалежній країні Марсія! Скоро почнеться розбудова нашої великої та червоної держави! Make Marsia great again!

Ознайомтесь з інформацією для нових прибульців з Землі.

Ваше головне завдання – піклуватися про інтереси вашої команди та процвітання держави Марсії загалом.
Є 50 законів, за які можна проголосувати. Усі вони знаходяться в розділі “Закони”. 
Гра ділиться на раунди. У кожному ви можете обговорювати з іншими командами закони, які 
вважаєте за необхідне проголосувати.
Під час реєстрації всі учасники було рівномірно розподілені між 10 командами. 
У процесі обговорення кнопка “голосування” не буде активною, тільки під час самого цього процесу.
Обговорення відбуватимуться в окремих кімнатах Google Meets. 
У розділі “Команди” знаходяться посилання на кімнати кожної команди. Представники груп можуть обговорювати 
з іншими командами закони, за які вони хотіли б проголосувати, переходячи з однієї кімнати в іншу. 
В кожному раунді кожна група може вибрати три закони і запропонувати їх для голосування. 
Для цього вам треба позначити ці закони, і вони перемістяться до розділу “Голосування”. 
У ньому кожен зможе побачити закони, висунуті іншими командами.
Після обговорень модератори оголосять початок голосування. 
Представник вашої команди повинен натиснути кнопку "Проголосувати" на обраному вами законі. 
Усі голоси будуть підраховані автоматично. 
Прийнятими вважаються ті закони, які загалом набрали більше трьох голосів від усіх команд. 
Модератори підведуть підсумки туру та розпочнуть новий.
У вкладці «Статистика» ви можете знайти параметри «Рейтингів груп» та «Рівня добробуту». 
Кожен запроваджений закон має на них позитивний чи негативний вплив, додаючи чи віднімаючи 
кількість балів. «Рейтинг груп» – це накопичені гравцями бали. «Рівень добробуту» – це графік, 
що відображає кілька параметрів, які визначатимуть поточний стан країни: Економіка, Політичні права, Якість життя та Безпека.
Доля Марсії у ваших руках!`
      var currentGame = {
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
        gameID: currentTime,
        gameCreation: new Date(Number(currentTime)).toLocaleDateString('uk-UA') + ' ' + new Date(Number(currentTime)).toLocaleTimeString('uk-UA'),
        gameName: this.gameName,
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
      for (var group of allGroups) {
        currentGame.groups[group] = {}
        currentGame.groups[group].stats = getRandomInt(20, 31)
        currentGame.groups[group].pushes = this.pushes
        currentGame.groups[group].votes = this.votes
        currentGame.login_set[group] = { accounts: '' }
        currentGame.login_set[group] = {}
        for (let i = 0; i < this.playersNumber / 10; i++) {
          const rand = Math.floor(Math.random() * 1000000)
          currentGame.login_set[group][rand] = {}
          currentGame.login_set[group][rand].name = ''
          currentGame.login_set[group][rand].start_quiz = {}
          currentGame.login_set[group][rand].start_quiz = { passed: false }
          currentGame.login_set[group][rand].start_quiz.result = ''
        }
        if (group === 'Admin') {
          currentGame.groups[group].stats = 0
          currentGame.groups[group].pushes = 10
          currentGame.groups[group].votes = 10
        }
      }
      this.$store.dispatch('setCurrentGameFirebase', currentGame)
      this.allGames = this.getSuperadminSet
    }
  }
}
</script>
