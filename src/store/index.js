import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firebase-database'
import laws from '../json/data.json'
import minepasses from '../json/minepasses.json'
import { Notify } from 'quasar'
import { groups } from '../json/groups.js'
var _ = require('lodash')
// eslint-disable-next-line import/no-absolute-path
import { config } from './firebase_config'
// Initialize database

firebase.initializeApp(config)

// Functions

function selectGroup (playerNumber) {
  var userGroup = groups[playerNumber % 10]
  return userGroup
}

function updatePlayerCount (gameID) {
  const dbRef = firebase.database().ref()
  dbRef.child('games').child(gameID).child('numberOfPlayers').get().then((snapshot) => {
    var updates = {}
    updates['/games/' + gameID + '/numberOfPlayers'] = snapshot.val() + 1
    return firebase.database().ref().update(updates)
  })
}

function updateTiming (gameID, timing) {
  const dbRef = firebase.database().ref()
  dbRef.child('games').child(gameID).child('timing').get().then((snapshot) => {
    var updates = {}
    updates['/games/' + gameID + '/timing'] = timing
    return firebase.database().ref().update(updates)
  })
}

function updatePushesNumber (gameID, group, newPushesNumber) {
  var updates = {}
  updates['games/' + gameID + '/groups/' + group + '/pushes'] = newPushesNumber
  return firebase.database().ref().update(updates)
}

function updateVotesNumber (gameID, group, newVotesNumber) {
  var updates = {}
  updates['games/' + gameID + '/groups/' + group + '/votes'] = newVotesNumber
  return firebase.database().ref().update(updates)
}

function updateVotedGroups (gameID, gameStage, law, group, length) {
  var updates = {}
  updates['games/' + gameID + '/' + gameStage + '/pushedLaws/' + law + '/groups_voted/' + length] = group
  return firebase.database().ref().update(updates)
}

function updatePhase (gameID, phase, oldPhase, pushes, votes, oldnewsLength, newnewsLength, { getters }) {
  var updates = {}
  var newPhase = phase.split('.')[1]
  var newStage = phase.split('.')[0]
  if (newPhase !== oldPhase) {
    if (newPhase === 'Voting summary') {
      updateStats(gameID, { getters }, newStage)
    }
    if (newPhase === 'Voting summary') {
      addAutoNews({ getters })
    }
    if (newPhase === 'Discussion') {
      resetVotes(gameID, pushes, votes)
    }
  }
  updates['games/' + gameID + '/gameStage'] = newStage
  updates['games/' + gameID + '/gamePhase'] = newPhase
  return firebase.database().ref().update(updates)
}

function resetVotes (gameID, pushes, votes) {
  var resetVotes = {}
  for (var group in groups) {
    resetVotes['games/' + gameID + '/groups/' + groups[group] + '/pushes'] = pushes
    resetVotes['games/' + gameID + '/groups/' + groups[group] + '/votes'] = votes
  }
  return firebase.database().ref().update(resetVotes)
}

function updateStats (gameID, { getters }, newStage) {
  var adoptedLaws = []
  var changesList = {}
  var wellbeingChangesList = {}
  if (getters.getGame[newStage] !== undefined) {
    for (var law in getters.getGame[newStage].pushedLaws) {
      if (_.size(getters.getGame[newStage].pushedLaws[law].groups_voted) >= getters.getGame.rules.adoption_number) {
        adoptedLaws.push(law)
        for (var group in groups) {
          if (getters.getLaws[law].change[groups[group]] !== undefined) {
            if (isNaN(changesList[groups[group]])) {
              changesList[groups[group]] = getters.getLaws[law].change[groups[group]]
            } else {
              changesList[groups[group]] += getters.getLaws[law].change[groups[group]]
            }
          }
        }
        for (var wellbeing in getters.getLaws[law].change.wellbeing) {
          if (isNaN(wellbeingChangesList[wellbeing])) {
            wellbeingChangesList[wellbeing] = getters.getLaws[law].change.wellbeing[wellbeing]
          } else {
            wellbeingChangesList[wellbeing] += getters.getLaws[law].change.wellbeing[wellbeing]
          }
        }
      }
    }
  }
  var updates = {}
  updates['games/' + gameID + '/' + newStage + '/last_changes'] = changesList
  updates['games/' + gameID + '/' + newStage + '/last_changes_wellbeing'] = wellbeingChangesList
  for (var group2 in groups) {
    updates['games/' + gameID + '/groups/' + groups[group2] + '/stats'] = getters.getGame.groups[groups[group2]].stats
    for (var change2 in changesList) {
      if (groups[group2] === change2) {
        updates['games/' + gameID + '/groups/' + groups[group2] + '/stats'] += changesList[change2]
      }
    }
  }
  for (var wellbeing2 in getters.getGame.wellbeing) {
    updates['games/' + gameID + '/wellbeing/' + wellbeing2] = getters.getGame.wellbeing[wellbeing2]
    if (wellbeingChangesList[wellbeing2] !== undefined) {
      updates['games/' + gameID + '/wellbeing/' + wellbeing2] += wellbeingChangesList[wellbeing2]
    }
  }
  return firebase.database().ref().update(updates)
}

function addAutoNews ({ getters }) {
  var updates = {}
  var wellbeingList = ['Економіка', 'Політичні права', 'Якість життя', 'Безпека']
  for (var s = 0; s < 2; s++) {
    const randomElement = wellbeingList[Math.floor(Math.random() * wellbeingList.length)]
    if (getters.getGame.wellbeing[randomElement] <= 5 || getters.getGame.wellbeing[randomElement] >= 25) {
      var randomScenario = ''
      if (getters.getGame.wellbeing[randomElement] <= 5) {
        randomScenario = 'bad_' + getRandomInt(1, 3)
      }
      if (getters.getGame.wellbeing[randomElement] >= 15) {
        randomScenario = 'good_' + getRandomInt(1, 3)
      }
      var currentTime = Date.now()
      var news = {
        title: 'Термінові новини!',
        text: getters.getLaws.scenario.wellbeing[randomElement][randomScenario].text,
        author: 'Адміністрація Мартії'
      }
      updates['games/' + getters.getUser.gameID + '/news/' + currentTime] = news

      var changesList2 = getters.getLaws.scenario.wellbeing[randomElement][randomScenario].change
      for (var wellbeing2 in getters.getGame.wellbeing) {
        updates['games/' + getters.getUser.gameID + '/wellbeing/' + wellbeing2] = getters.getGame.wellbeing[wellbeing2]
        if (changesList2[wellbeing2] !== undefined) {
          updates['games/' + getters.getUser.gameID + '/wellbeing/' + wellbeing2] += changesList2[wellbeing2]
        }
      }
      return firebase.database().ref().update(updates)
    }
  }
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

let store = null
Vue.use(Vuex)
export default function () {
  const Store = new Vuex.Store({
    namespaced: true,
    name: 'global',
    state: {
      laws,
      minepasses,
      games: {},
      game: {},
      users: {},
      timeToNextRound: 0,
      currentPage: 'Log',
      gameID: '',
      useremail: '',
      oldPhase: 'Registration',
      newsLength: 1,
      logged: false,
      rounds: {
      }
    },
    getters: {
      getUser: state => {
        for (var user in state.users) {
          if (state.users[user].email === state.useremail) {
            return state.users[user]
          }
        }
      },
      getUserEmail: state => {
        return state.useremail
      },
      getLogged: state => {
        return state.logged
      },
      getOldPhase: state => {
        return state.oldPhase
      },
      getGame: state => {
        return state.games[state.gameID]
      },
      getTimer: state => {
        return state.timeToNextRound
      },
      getCurrentPage: state => {
        return state.currentPage
      },
      getUsers: state => {
        return state.users
      },
      getLaws: state => {
        return state.laws
      },
      getGames: state => {
        return state.games
      },
      getNewsLength: state => {
        return state.newsLength
      }
    },
    mutations: {
      setOldPhase (state, phase) {
        state.oldPhase = phase
      },
      setLogged (state, logged) {
        state.logged = logged
      },
      setNewsLength (state, length) {
        state.newsLength = length
      },
      setTimeToNextRound (state, timer) {
        state.timeToNextRound = timer
      },
      setUserEmail (state, useremail) {
        state.useremail = useremail
      },
      setGameID (state, gameID) {
        state.gameID = gameID
      },
      setGames (state) {
        firebase.database().ref('games')
          .on('value', event => {
            var games = {}
            event.forEach(data => {
              games[data.key] = data.val()
            })
            state.games = games
          })
      },
      setUsers (state) {
        firebase.database().ref('users')
          .on('value', event => {
            var users = {}
            event.forEach(data => {
              users[data.key] = data.val()
            })
            state.users = users
          })
      },
      setCurrentPage (state, page) {
        state.currentPage = page
      }
    },
    actions: {
      setTimeToNextRound ({ commit }, timer) {
        commit('setTimeToNextRound', timer)
      },
      setGames ({ commit }) {
        commit('setGames')
      },
      setUsers ({ commit }) {
        commit('setUsers')
      },
      setEmail ({ commit, getters }, email) {
        commit('setUserEmail', email)
        if (email === '777') {
          commit('setCurrentPage', 'Superadmin')
        }
        var userID = email.split('@')[0]
        userID = userID.split('.').join('')
        for (var user in getters.getUsers) {
          if (user === userID) {
            if (getters.getUsers[user].gameID !== '' && getters.getUsers[user].gameID !== undefined) {
              commit('setGameID', getters.getUsers[user].gameID)
              commit('setCurrentPage', 'Rules')
            }
          }
        }
      },
      setUserGame ({ commit, getters }, payload) {
        for (const game in getters.getGames) {
          if (game === payload.gameID) {
            var playerGroup = ''
            var userID = getters.getUserEmail.split('@')[0]
            userID = userID.split('.').join('')
            var playerNumber = ''
            if (payload.username === 'admin@admin') {
              playerGroup = 'Admin'
              playerNumber = 'Admin'
            } else {
              playerGroup = selectGroup(getters.getGames[game].numberOfPlayers)
              updatePlayerCount(payload.gameID)
              playerNumber = getters.getGames[game].numberOfPlayers
            }
            firebase.database().ref('users/' + userID).set({
              username: payload.username,
              gameID: payload.gameID,
              group: playerGroup,
              playerNumber: playerNumber,
              email: getters.getUserEmail,
              startQuiz: 'None'
            })
            commit('setGameID', payload.gameID)
            commit('setCurrentPage', 'Start_quiz')
            commit('setLogged', true)
            break
          }
        }
        if (!getters.getLogged) {
          Notify.create({
            message: 'ID гри не знайдено',
            color: 'red'
          })
        }
      },
      createNewGame ({ commit }, game) {
        firebase.database().ref('games/' + game.gameID).set({
          numberOfPlayers: game.numberOfPlayers,
          gameCreation: game.gameCreation,
          groups: game.groups,
          login_set: game.login_set,
          timing: game.timing,
          wellbeing: game.wellbeing,
          gamePhase: game.gamePhase,
          gameStage: game.gameStage,
          name: game.name,
          news: game.news,
          rules: game.rules,
          gameStyle: game.gameStyle
        })
      },
      startGame ({ commit, dispatch, getters }) {
        var startTime = Date.now()
        var timing = []
        var c = 60000 // с = 60000
        timing.push(startTime)
        timing.push(startTime + 15 * c)
        timing.push(startTime + 20 * c)
        timing.push(startTime + 25 * c)
        timing.push(startTime + 28 * c)
        var nextRoundTime = startTime + 28 * c
        for (var t = 1; t < 6; t++) {
          timing.push(nextRoundTime + 10 * c)
          timing.push(nextRoundTime + 13 * c)
          timing.push(nextRoundTime + 16 * c)
          timing.push(nextRoundTime + 19 * c)
          nextRoundTime += 19 * c
        }
        timing.push(nextRoundTime + 3 * c)
        timing.push(0)
        updateTiming(getters.getUser.gameID, timing)
      },
      stopGame ({ commit, dispatch, getters }) {
        var timing = []
        timing[0] = 0
        updateTiming(getters.getUser.gameID, timing)
        updatePhase(getters.getUser.gameID, '0.Registration', getters.getGame.gamePhase, getters.getGame.rules.pushes, getters.getGame.rules.votes, getters.getNewsLength, _.size(getters.getGame.news), { getters })
      },
      pushForVoting ({ commit, dispatch, getters }, law) {
        if (getters.getGame.groups[getters.getUser.group].pushes <= 0) {
          Notify.create({
            message: 'Ваша група не може більше висувати закони',
            color: 'red'
          })
        } else {
          var newPushesNumber = parseInt(getters.getGame.groups[getters.getUser.group].pushes) - 1
          Notify.create({
            message: 'Закон висунуто на голосування! Кількість законів, що може висунути ваша група:  ' + newPushesNumber,
            color: 'green'
          })
          firebase.database().ref('games/' + getters.getUser.gameID + '/' + getters.getGame.gameStage + '/pushedLaws/' + law).set({
            group: getters.getUser.group
          })
          updatePushesNumber(getters.getUser.gameID, getters.getUser.group, newPushesNumber)
        }
      },
      voteFor ({ commit, dispatch, getters }, law) {
        if (getters.getGame.groups[getters.getUser.group].votes <= 0) {
          Notify.create({
            message: 'Ваша група не може більше голосувати',
            color: 'red'
          })
        } else {
          var newVotesNumber = parseInt(getters.getGame.groups[getters.getUser.group].votes) - 1
          Notify.create({
            message: 'Проголосовано! Кількість голосів у вашої групи:  ' + newVotesNumber,
            color: 'green'
          })
          var groupsNumber = _.size(getters.getGame[getters.getGame.gameStage].pushedLaws[law].groups_voted)
          updateVotesNumber(getters.getUser.gameID, getters.getUser.group, newVotesNumber)
          updateVotedGroups(getters.getUser.gameID, getters.getGame.gameStage, law, getters.getUser.group, groupsNumber)
        }
      },
      setPhase ({ commit, dispatch, getters }, phase) {
        if (phase !== getters.getOldPhase) {
          var newPhase = phase.split('.')[1]
          Notify.create({
            message: 'Нова фаза гри! ' + newPhase,
            color: 'blue'
          })
          const audio = new Audio(require('../assets/bell.wav'))
          audio.play()
          commit('setOldPhase', phase)
        }
        if (_.size(getters.getGame.news) !== getters.getNewsLength) {
          Notify.create({
            message: 'Термінові новини! Перевірте відповідну сторінку!',
            color: 'yellow',
            textColor: 'black'
          })
          const audio = new Audio(require('../assets/news.wav'))
          audio.play()
          commit('setNewsLength', _.size(getters.getGame.news))
        }
        if (getters.getUser.group === 'Admin') {
          updatePhase(getters.getUser.gameID, phase, getters.getGame.gamePhase, getters.getGame.rules.pushes, getters.getGame.rules.votes, getters.getNewsLength, _.size(getters.getGame.news), { getters })
        }
        if (getters.getGame.gamePhase === 'Game ended') {
          commit('setCurrentPage', 'Start_quiz')
        }
      },
      setQuizResults ({ commit, dispatch, getters }, quiz) {
        commit('setCurrentPage', 'Rules')
        var userID = getters.getUser.email.split('@')[0]
        console.log(userID)
        if (getters.getUsers[userID].startQuiz === 'None') {
          var quizPage = 'startQuiz'
        } else {
          quizPage = 'endQuiz'
        }
        var updates = {}
        updates['users/' + userID + '/' + quizPage] = quiz
        return firebase.database().ref().update(updates)
      }
    }
  })

  store = Store

  // Quasar default
  return Store
}

// add this line to access store wherever you need
export { store }
