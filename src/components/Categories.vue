<template>
      <div class="rooms">
        <div class="container">
          <div class="subtitle">
            <h2> Оберіть реформу </h2>
          </div>
          <div v-for="category in getCategories" v-bind:key="category" class="rooms__content">
            <a href="#" @click="categorySelect(category)" class="button button--small-font button--medium button--white"> {{ category }} </a>
          </div>
        </div>
      </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Categories',
  data () {
    return {
    }
  },
  methods: {
    categorySelect (cat) {
      this.$store.commit('setCategorie', cat)
      this.$store.commit('setPage', 'Laws')
    }
  },
  components: {
  },
  computed: {
    ...mapGetters([
      'getLaws'
    ]),
    getCategories () {
      var categories = []
      for (var law in this.getLaws) {
        if (!categories.includes(this.getLaws[law].category) && (this.getLaws[law].category !== undefined)) {
          categories.push(this.getLaws[law].category)
        }
      }
      return categories
    }
  }
}
</script>
