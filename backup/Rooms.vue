<template>
  <div class="news">
    <div class="news__content">
      <div class="news__block">
        <div class="subtitle">
          <h2>Натисніть, щоб приєднатись до спілкування</h2>
        </div>
        <div class="rooms__main-button">
          <a href="https://meet.google.com/ffk-rxbi-cck" target="_blank" class="button button--small-font button--medium button--center"> Загальна зала </a>
        </div>
        <div class="rooms__content">
          <a href="https://meet.google.com/pgo-rrfe-skr" target="_blank" class="button button--small-font button--medium button--white"> Військовослужбовці </a>
          <a href="https://meet.google.com/fnj-uvws-tep" target="_blank" class="button button--small-font button--medium button--white"> Бізнес </a>
          <a href="https://meet.google.com/ogo-qjvq-tjh" target="_blank" class="button button--small-font button--medium button--white"> Чиновники </a>
          <a href="https://meet.google.com/xsp-ffpm-igp" target="_blank" class="button button--small-font button--medium button--white"> Співробітники правоохоронних органів і судді </a>
          <a href="https://meet.google.com/dtv-ybfa-htr" target="_blank" class="button button--small-font button--medium button--white"> Вразливі верстви населення </a>
          <a href="https://meet.google.com/usv-xpzg-jpx" target="_blank" class="button button--small-font button--medium button--white"> Митці та культурні діячі </a>
          <a href="https://meet.google.com/ota-zufk-uvi" target="_blank" class="button button--small-font button--medium button--white"> ЗМІ </a>
          <a href="https://meet.google.com/wqs-kgpz-gux" target="_blank" class="button button--small-font button--medium button--white"> Громадські активісти </a>
          <a href="https://meet.google.com/ahh-ssrr-kuo" target="_blank" class="button button--small-font button--medium button--white"> Пенсіонери </a>
          <a href="https://meet.google.com/bvi-ahre-yxd" target="_blank" class="button button--small-font button--medium button--white"> Бюджетники </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Rooms',
  computed: {
    ...mapGetters([
      'getGroups'
    ])
  },
  data () {
    return {
    }
  },
  components: {
  },
  methods: {
    changePage (page) {
      this.$store.commit('setPage', page)
    }
  }
}
</script>
