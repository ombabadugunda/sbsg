<template>
    <nav>
      <ul class="header-nav__list">
        <div class="header-title">
        SBSG</div>
      <q-btn-dropdown class="dropdown"
      push
      icon="menu"
      size="lg"
      >
      <q-list>
        <q-item @click="changePage('News')" clickable v-close-popup>
          <q-item-section avatar>
            <q-avatar icon="feed" text-color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-items">Новини</q-item-label>
          </q-item-section>
        </q-item>
        <q-item @click="changePage('Categories')" clickable v-close-popup>
          <q-item-section avatar>
            <q-avatar  icon="list" text-color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label :class="{'header-active': this.getCurrentGame.gamePhase == 'Vote pushing'}" class="menu-items">Закони</q-item-label>
          </q-item-section>
        </q-item>
        <q-item @click="changePage('Statistics')" clickable v-close-popup>
          <q-item-section avatar>
            <q-avatar icon="leaderboard" text-color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label :class="{'header-active': this.getCurrentGame.gamePhase == 'Voting summary' }" class="menu-items">Статистика</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="getCurrentGame.gameType == 'Meets'" @click="changePage('Rooms')" clickable v-close-popup>
          <q-item-section avatar>
            <q-avatar icon="meeting_room" text-color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label :class="{'header-active': this.getCurrentGame.gamePhase == 'Discussion' }" class="menu-items">Кімнати</q-item-label>
          </q-item-section>
        </q-item>
        <q-item @click="changePage('Voting')" clickable v-close-popup>
          <q-item-section avatar>
            <q-avatar icon="gavel" text-color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label :class="{'header-active': this.getCurrentGame.gamePhase == 'Voting' }" class="menu-items">Голосування</q-item-label>
          </q-item-section>
        </q-item>
        <q-item @click="changePage('Rules')" clickable v-close-popup>
          <q-item-section avatar>
            <q-avatar icon="import_contacts" text-color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-items">Інформація</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="getUser.group == 'Admin'" @click="changePage('Admin')" clickable v-close-popup>
          <q-item-section avatar>
            <q-avatar icon="settings" text-color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-items">Адмінпанель</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-btn-dropdown>
        <!-- <q-icon class="icon-menu" name="menu" /> -->
        <li>
          <a href="#" @click="changePage('News')">
            <q-item-section avatar>
            <q-avatar icon="feed" text-color="grey" />
          </q-item-section>
            <span> Новини </span>
          </a>
        </li>
        <li>
          <a href="#" @click="changePage('Categories')">
            <q-item-section avatar>
            <q-avatar  icon="list" text-color="grey" />
          </q-item-section>
            <span :class="{'header-active': this.getCurrentGame.gamePhase == 'Vote pushing' }"> Закони </span>
          </a>
        </li>
        <li>
          <a href="#" @click="changePage('Statistics')">
            <q-item-section avatar>
            <q-avatar icon="leaderboard" text-color="grey" />
          </q-item-section>
            <span :class="{'header-active': this.getCurrentGame.gamePhase == 'Voting summary' }"> Статистика </span>
          </a>
        </li>
        <li v-if="getCurrentGame.gameType == 'Meets'">
          <a href="#" @click="changePage('Rooms')">
            <q-item-section avatar>
            <q-avatar icon="meeting_room" text-color="grey" />
          </q-item-section>
            <span :class="{'header-active': this.getCurrentGame.gamePhase == 'Discussion' }"> Кімнати </span>
          </a>
        </li>
        <li>
          <a href="#" @click="changePage('Voting')">
            <q-item-section avatar>
            <q-avatar icon="gavel" text-color="grey" />
          </q-item-section>
            <span :class="{'header-active': this.getCurrentGame.gamePhase == 'Voting' }"> Голосування </span>
          </a>
        </li>
        <li>
          <a href="#" @click="changePage('Rules')">
            <q-item-section avatar>
            <q-avatar icon="import_contacts" text-color="grey" />
          </q-item-section>
            <span> Інформація </span>
          </a>
        </li>
        <li v-if="getUser.group == 'Admin'">
          <a href="#"  @click="changePage('Admin')">
            <q-item-section avatar>
            <q-avatar icon="settings" text-color="grey" />
          </q-item-section>
            <span> Адмінпанель </span>
          </a>
        </li>
      </ul>
    </nav>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Nav_bar',
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
    changePage (page) {
      this.$store.commit('setPage', page)
    }
  }
}
</script>
