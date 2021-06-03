<template>
  <div class="news">
    <div class="news__content">
      <div class="news__block" v-for="(one_news, index) in getNews" v-bind:key="index" >
        <h3 class="news__title">{{ one_news.title }}</h3>
        <div class="news__text">
          <p v-html="one_news.text"></p>
        </div>
        <div class="news__info" >{{ one_news.author }} <br>{{ new Date(Number(index)).toLocaleDateString("uk-UA") }} {{ new Date(Number(index)).toLocaleTimeString("uk-UA") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'News',
  data () {
    return {
    }
  },
  components: {
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'getCurrentGame',
      'getLaws'
    ]),
    getNews () {
      var news = this.getCurrentGame.news
      const orderedNews = Object.keys(news).sort().reduceRight(
        (obj, key) => {
          obj[key] = news[key]
          return obj
        },
        {})
      return orderedNews
    }
  }
}
</script>
