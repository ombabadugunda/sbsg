<template>
    <div class="news">
      <div class="news__content">
        <div class="news__block">
        <div class="login__checkbox-wrapper">
            <div class="login__checkbox">
              <input type="radio" id="groups" value="groups" v-model="pickedStat">
              <label for="groups" class="login__checkbox-label"> Рейтинги груп </label>
            </div>
            <div class="login__checkbox">
              <input type="radio" id="wellbeing" value="wellbeing" v-model="pickedStat">
              <label for="wellbeing" class="login__checkbox-label"> Рівень добробуту </label>
            </div>
          </div>
        <groups v-if="pickedStat == 'groups'">
        </groups>
        <wellbeing v-if="pickedStat == 'wellbeing'">
        </wellbeing>
      </div>
    </div>
    </div>
</template>

<script>

export default {
  name: 'Statistics',
  data () {
    return {
      pickedStat: 'groups'
    }
  },
  components: {
    groups: require('components/Statistics_groups.vue').default,
    wellbeing: require('components/Statistics_wellbeing.vue').default
  },
  methods: {
  }
}
</script>
