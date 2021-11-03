<template>
  <div class="news">
    <div class="news__content">
      <div class="news__block">
        <div class="subtitle">
          <h2>Натисніть, щоб приєднатись до спілкування</h2>
        </div>
        <div class="rooms__main-button">
          <a href="https://meet.google.com/obr-fuig-zzf" target="_blank" class="button button--small-font button--medium button--center"> Загальна зала </a>
        </div>
        <div class="rooms__content">
          <a href="https://meet.google.com/ngx-hevh-kmx" target="_blank" class="button button--small-font button--medium button--white"> Військовослужбовці </a>
          <a href="https://meet.google.com/ybn-befg-mbp" target="_blank" class="button button--small-font button--medium button--white"> Бізнес </a>
          <a href="https://meet.google.com/orf-usai-rtb" target="_blank" class="button button--small-font button--medium button--white"> Чиновники </a>
          <a href="https://meet.google.com/coa-efur-jvb" target="_blank" class="button button--small-font button--medium button--white"> Співробітники правоохоронних органів і судді </a>
          <a href="https://meet.google.com/ffu-rxnf-bfh" target="_blank" class="button button--small-font button--medium button--white"> Вразливі верстви населення </a>
          <a href="https://meet.google.com/xfg-xtwh-gzs" target="_blank" class="button button--small-font button--medium button--white"> Митці та культурні діячі </a>
          <a href="https://meet.google.com/kne-wyqr-vdo" target="_blank" class="button button--small-font button--medium button--white"> ЗМІ </a>
          <a href="https://meet.google.com/rvq-bqwp-qsk" target="_blank" class="button button--small-font button--medium button--white"> Громадські активісти </a>
          <a href="https://meet.google.com/hrn-byea-vcf" target="_blank" class="button button--small-font button--medium button--white"> Пенсіонери </a>
          <a href="https://meet.google.com/ewg-qmrr-tfj" target="_blank" class="button button--small-font button--medium button--white"> Бюджетники </a>
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
