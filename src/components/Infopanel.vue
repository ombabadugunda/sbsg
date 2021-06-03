<template>
    <nav>
              <ul class="footer-nav__list">
                <li>
                    <span> {{ getUser.email }} </span>
                </li>
                <li>
                    <span> {{ getUser.group }} </span>
                </li>
                <li>
                    <span> Фаза: {{ getCurrentGame.gamePhase }} </span>
                </li>
                <li>
                    <span> Раунд: {{getCurrentGame.gameStage}} </span>
                </li>
                <li>
                    <span> Законів лишилось: {{ getCurrentGame.groups[getUser.group].pushes }} </span>
                </li>
                <li>
                    <span> Голосів лишилось: {{ getCurrentGame.groups[getUser.group].votes }} </span>
                </li>
              </ul>
            </nav>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Infopanel',
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getCurrentGame'
    ])
  },
  methods: {
  }
}
</script>
