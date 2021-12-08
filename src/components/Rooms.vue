<template>
  <div class="news">
    <div class="news__content">
      <div class="news__block">
        <div class="subtitle">
          <h2>Натисніть, щоб приєднатись до спілкування</h2>
        </div>
        <div class="rooms__main-button">
          <a href="https://meet.google.com/xhv-qxrr-bkf" target="_blank" class="button button--small-font button--medium button--center"> Загальна зала </a>
        </div>
        <div class="rooms__content">
          <a href="https://meet.google.com/zup-dpne-ctn" target="_blank" class="button button--small-font button--medium button--white"> Військовослужбовці </a>
          <a href="https://meet.google.com/fop-vcdc-khk" target="_blank" class="button button--small-font button--medium button--white"> Бізнес </a>
          <a href="https://meet.google.com/pqe-mwao-wbv" target="_blank" class="button button--small-font button--medium button--white"> Чиновники </a>
          <a href="https://meet.google.com/szp-myxv-vbz" target="_blank" class="button button--small-font button--medium button--white"> Співробітники правоохоронних органів і судді </a>
          <a href="https://meet.google.com/aev-jdjv-jon" target="_blank" class="button button--small-font button--medium button--white"> Вразливі верстви населення </a>
          <a href="https://meet.google.com/buw-ohxi-fft" target="_blank" class="button button--small-font button--medium button--white"> Митці та культурні діячі </a>
          <a href="https://meet.google.com/wqa-ojxh-smr" target="_blank" class="button button--small-font button--medium button--white"> ЗМІ </a>
          <a href="https://meet.google.com/iur-yncm-uqv" target="_blank" class="button button--small-font button--medium button--white"> Громадські активісти </a>
          <a href="https://meet.google.com/dci-vzho-mkn" target="_blank" class="button button--small-font button--medium button--white"> Пенсіонери </a>
          <a href="https://meet.google.com/sur-xafw-juv" target="_blank" class="button button--small-font button--medium button--white"> Бюджетники </a>
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
