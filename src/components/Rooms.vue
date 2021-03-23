<template>
      <div class="rooms">
        <div class="container">
          <div class="subtitle">
            <h2> Перелік кімнат для спілкування </h2>
            <h2>Натисніть, щоб приєднатись до спілкування</h2>
          </div>
          <div class="rooms__main-button">
            <a href="#" class="button button--small-font button--medium button--center"> Загальна зала </a>
          </div>
          <div class="rooms__content">
            <a href="#" class="button button--small-font button--medium button--white"> Військовослужбовці </a>
            <a href="#" class="button button--small-font button--medium button--white"> Бізнес </a>
            <a href="#" class="button button--small-font button--medium button--white"> Чиновники </a>
            <a href="#" class="button button--small-font button--medium button--white"> Співробітники правоохоронних органів і судді </a>
            <a href="#" class="button button--small-font button--medium button--white"> Вразливі верстви населення </a>
            <a href="#" class="button button--small-font button--medium button--white"> Митці та культурні діячі </a>
            <a href="#" class="button button--small-font button--medium button--white"> ЗМІ </a>
            <a href="#" class="button button--small-font button--medium button--white"> Громадські активісти </a>
            <a href="#" class="button button--small-font button--medium button--white"> Пенсіонери </a>
            <a href="#" class="button button--small-font button--medium button--white"> Бюджетники </a>
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
