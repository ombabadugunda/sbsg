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
                <h6>Ваша група: {{ getUser.group }} </h6>
                <h6>Ваше ім'я: {{ getUser.username }} </h6>
                <!-- <h6 v-if="getCurrentGame.gameStyle == 'Minecraft' && getUser.group != 'Admin'">Логін до Minecraft: {{ minePasses[getUser.playerNumber]['name'] }} </h6> -->
                <!-- <h6 v-if="getCurrentGame.gameStyle == 'Minecraft' && getUser.group != 'Admin'">Пароль до Minecraft: {{ minePasses[getUser.playerNumber]['password'] }} </h6> -->
                <a style="width: 300px" class="button button--small-font button--small button--white" href="https://drive.google.com/file/d/1WPBFJxqU8K5Q7UElV_streTDW8w_Bxat/view?usp=sharing" target="_blank">Завантажити гру для Windows</a>
                <a style="width: 300px" class="button button--small-font button--small button--white" href="https://drive.google.com/file/d/1PxN12YhJT3Umlv9vEcYF22ITnfE9WomQ/view?usp=sharing" target="_blank">Завантажити гру для macOS</a>
                <h6>Раунд гри: {{ getCurrentGame.gameStage }} </h6>
                <h6>Фаза гри: {{ getCurrentGame.gamePhase }} </h6>
                <h6 v-if="getCurrentGame.gameStage != 0">Перехід до наступної фази через: {{ new Date(getCurrentGame.timing.timeToNextRound).getMinutes() + 1 }} хв. </h6>
                <h6>Ваша група може висунути законів в цьому раунді: {{ getCurrentGame.groups[getUser.group].pushes }} </h6>
                <h6>Ваша група може проголосувати в цьому раунді: {{ getCurrentGame.groups[getUser.group].votes }} </h6>
                <h6>Голосів потрібно для прийняття закону: {{ getCurrentGame.rules.adoption_number }} </h6>
                <h6>Тип гри: {{ getCurrentGame.gameStyle }} </h6>
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
                <div v-for="(group, index) in Object.keys(getCurrentGame.groups).sort()" v-bind:key="index">
                  <h6>{{ group }}</h6>
                  <ul>
                    <div v-for="(player, index2) in Object.keys(getCurrentGame.login_set[group]).sort()" v-bind:key="index2">
                    <li>
                    {{ getCurrentGame.login_set[group][player].name }}
                    {{ player }}
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
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getCurrentGame',
      'getLaws'
    ])
  }
}
</script>
