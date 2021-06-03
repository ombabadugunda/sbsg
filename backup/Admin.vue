<template>
          <div class="news">
            <div class="row">
              <div class="col-6">
                <div class="admin__block">
                  <h3 class="news__title">Контроль фази гри</h3>
                  <div class="news__text">
                    <p>Натискаючи цю кнопку ви змінюєте фазу гри на наступну</p>
                  </div>
                    <button class="button button--small-font button--small button--white" @click="startGame()">Розпочати гру</button>
                    <button class="button button--small-font button--small button--white" @click="stopGame()">Скинути гру на початкову фазу</button>
                </div>
              </div>
              <div class="col-6">
                <div class="admin__block">
                  <h3 class="news__title">Поточна гра</h3>
                  <div class="news__text">
                    <p>Раунд гри: {{ getCurrentGame.gameStage }} </p>
                    <p>Фаза гри: {{ getCurrentGame.gamePhase }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="admin__block">
                  <h3 class="news__title">Дані команд</h3>
                  <div class="news__text" v-for="group in Object.keys(getCurrentGame.groups).sort()" v-bind:key="group">
                    {{ group }} <span> {{ getCurrentGame.groups[group] }}</span>
                        <q-separator/>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="admin__block">
                  <h3 class="news__title">Акаунти</h3>
                    <div class="news__text" v-for="group in Object.keys(getCurrentGame.groups).sort()" v-bind:key="group">
                      {{ group }} :
                        <span v-for="(account, index) in getCurrentGame.login_set[group]" v-bind:key="index">
                          &ensp; {{ index }} {{ account.name }},
                        </span>
                        <q-separator/>
                    </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="admin__block">
                  <h3 class="news__title">Запостити новину</h3>
                  <div class="news__text">
                    <label class="login__label" for="news">
                      <input class="login__input" v-model="new_news.title" placeholder="Заголовок новини" id="title" name="title" required>
                    </label>
                    <label class="login__label" for="news">
                      <input class="login__input" v-model="new_news.text" placeholder="Текст новини" id="text" name="text" required>
                    </label>
                    <label class="login__label" for="news">
                      <input class="login__input" v-model="new_news.author" placeholder="Автор новини" id="author" name="author" required>
                    </label>
                    <button @click='postNews(new_news.title, new_news.text, new_news.author)' type="submit" class="button button--center button--medium">Запостити</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Admin',
  data () {
    return {
      new_news: {
        title: '',
        text: '',
        author: 'Адміністрація Марсії'
      },
      playersNumber: 10,
      pushes: 3,
      votes: 3,
      adoption_number: 1
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentGame'
    ])
  },
  components: {
  },
  methods: {
    setGameStage () {
      this.$store.dispatch('setNextStageFirebase')
    },
    startGame () {
      this.$store.dispatch('startGame')
    },
    stopGame () {
      this.$store.dispatch('stopGame')
    },
    postNews (title, text, author) {
      var news = {
        title: title,
        text: text,
        author: author
      }
      this.$store.dispatch('addNews', news)
    }
  }
}
</script>
