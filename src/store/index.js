import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firebase-database'
import laws from '../json/data.json'
import minepasses from '../json/minepasses.json'
import { Notify } from 'quasar'
import { groups } from '../json/groups.js'
var _ = require('lodash')

// Initialize database
var config = {
  apiKey: 'AIzaSyBQVmQ9C6TN07aB72G83FnJY-7e1dNxxR8',
  authDomain: 'state-building.firebaseapp.com',
  databaseURL: 'https://state-building-default-rtdb.europe-west1.firebasedatabase.app/',
  storageBucket: 'state-building.appspot.com'
}
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
              email: getters.getUserEmail
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
        var userID = getters.getUser.email.split('.').join('')
        if (getters.getUsers[userID].startQuiz === undefined) {
          var quizPage = 'startQuiz'
        } else {
          quizPage = 'endQuiz'
        }
        var updates = {}
        updates['users/' + userID + '/' + quizPage] = quiz
        return firebase.database().ref().update(updates)
      }
      // loginUser ({ commit }, login) {
      //   var loggedIn = false
      //   if (login.email === '777') {
      //     var payload = {
      //       id: 'Superadmin',
      //       username: 'Superadmin',
      //       group: 'Superadmin',
      //       gameID: login.gameID
      //     }
      //     Notify.create({
      //       message: 'Ви зайшли як Суперадмін',
      //       color: 'green'
      //     })
      //     var allGames = {}
      //     db.collection('games').get().then((querySnapshot) => {
      //       querySnapshot.forEach((doc) => {
      //         allGames[doc.id] = doc.data()
      //       })
      //     })
      //     commit('setSuperadminSet', allGames)
      //     commit('setUser', payload)
      //     commit('setPage', 'Superadmin')
      //   } else if (login.email === login.gameID + '@admin') {
      //     console.log('Admin')
      //     var payloadAdmin = {
      //       id: 'Admin',
      //       username: 'Admin',
      //       group: 'Admin',
      //       gameID: login.gameID,
      //       playerNumber: 41
      //     }
      //     Notify.create({
      //       message: 'Ви зайшли як Адмін гри #' + login.gameID,
      //       color: 'green'
      //     })
      //     commit('setUser', payloadAdmin)
      //     commit('setPage', 'Rules')
      //   } else {
      //     db.collection('games').get().then((querySnapshot) => {
      //       querySnapshot.forEach((doc) => {
      //         if (login.gameID === doc.id) {
      //           for (var group in doc.data().login_set) {
      //             for (var account in doc.data().login_set[group]) {
      //               if (account === login.email) {
      //                 loggedIn = true
      //                 var payloadUser = {
      //                   email: account,
      //                   gameID: login.gameID,
      //                   username: login.username,
      //                   group: group,
      //                   playerNumber: account.playerNumber
      //                 }
      //                 const now = new Date()
      //                 const item = {
      //                   email: login.email,
      //                   gameID: login.gameID,
      //                   username: login.username,
      //                   group: group,
      //                   playerNumber: account.playerNumber,
      //                   expiry: now.getTime() + 86400000
      //                 }
      //                 localStorage.setItem('user', JSON.stringify(item))
      //                 commit('setUser', payloadUser)
      //                 commit('setCurrentGame', doc.data())
      //                 commit('setPage', 'News')
      //               }
      //             }
      //           }
      //           if (loggedIn === false) {
      //             const allGroups = [
      //               'Admin',
      //               'Бізнес',
      //               'Чиновники',
      //               'Пенсіонери',
      //               'Митці та культурні діячі',
      //               'Співробітники правоохоронних органів і судді',
      //               'ЗМІ',
      //               'Громадські активісти',
      //               'Бюджетники',
      //               'Військовослужбовці',
      //               'Вразливі верстви населення'
      //             ]
      //             var newUserGroup = allGroups[doc.data().activePlayers % 10 + 1]
      //             var payload = {
      //               email: login.email,
      //               gameID: login.gameID,
      //               username: login.username,
      //               group: newUserGroup,
      //               playerNumber: doc.data().activePlayers + 1
      //             }
      //             loggedIn = true
      //             commit('setUser', payload)
      //             var newData = doc.data()
      //             newData.activePlayers += 1
      //             newData.login_set[newUserGroup][login.email] = {}
      //             newData.login_set[newUserGroup][login.email].name = login.username
      //             newData.login_set[newUserGroup][login.email].playerNumber = doc.data().activePlayers + 1
      //             newData.login_set[newUserGroup][login.email].start_quiz = {}
      //             newData.login_set[newUserGroup][login.email].start_quiz = { passed: false }
      //             newData.login_set[newUserGroup][login.email].start_quiz.result = ''
      //             commit('setCurrentGame', newData)
      //             commit('setPage', 'Start_quiz')
      //             var message = 'Вітаємо у грі! Ваша група - ' + newUserGroup
      //             Notify.create({
      //               message,
      //               color: 'green'
      //             })
      //             const now = new Date()
      //             const item = {
      //               email: login.email,
      //               gameID: login.gameID,
      //               username: login.username,
      //               group: newUserGroup,
      //               playerNumber: doc.data().activePlayers + 1,
      //               expiry: now.getTime() + 86400000
      //             }
      //             localStorage.setItem('user', JSON.stringify(item))
      //             db.collection('games').doc(doc.id).set(newData)
      //               .then(function () {
      //                 console.log('Loggin set updated')
      //               })
      //               .catch(function (error) {
      //                 console.error('Error updating login set: ', error)
      //               })
      //           }
      //         } else {
      //         }
      //         // for (var group in doc.data().login_set) {
      //         //   for (var account in doc.data().login_set[group]) {
      //         //     if (account === login.id) {
      //         //       loggedIn = true
      //         //       var newData = doc.data()
      //         //       newData.login_set[group][account].name = login.username
      //         //       commit('setCurrentGame', newData)
      //         //       if (newData.login_set[group][account].start_quiz.passed === true || group === 'Admin') {
      //         //         commit('setPage', 'News')
      //         //       } else {
      //         //         commit('setPage', 'Start_quiz')
      //         //       }
      //         //       var payload = {
      //         //         id: login.id,
      //         //         username: login.username,
      //         //         gameID: doc.id,
      //         //         group: group
      //         //       }
      //         //       commit('setUser', payload)
      //         //       db.collection('games').doc(doc.id).set(newData)
      //         //         .then(function () {
      //         //           console.log('Loggin set updated')
      //         //         })
      //         //         .catch(function (error) {
      //         //           console.error('Error updating login set: ', error)
      //         //         })
      //         //       var message = 'Вітаємо у грі! Ваша група - ' + group
      //         //       Notify.create({
      //         //         message,
      //         //         color: 'green'
      //         //       })
      //         //       break
      //         //     }
      //         //   }
      //         // }
      //       })
      //       if (loggedIn === false) {
      //         Notify.create({
      //           message: 'ID гри не знайдено',
      //           color: 'red'
      //         })
      //       }
      //     })
      //   }
      // },
      // getCurrentGameFirebase ({ commit, dispatch, getters }) {
      //   console.log(getters.getUser.gameID)
      //   if (getters.getUser.gameID !== '') {
      //     db.collection('games').doc(getters.getUser.gameID).get()
      //       .then(function (doc) {
      //         var newStage = doc.data()
      //         if (newStage != null && newStage.currentPage !== 'Log' && newStage.gameStage !== 0) {
      //           var nowTime = Date.now()
      //           console.log(newStage.gamePhase)
      //           newStage.timing.timeToNextRound = newStage.timing[newStage.gameStage][newStage.gamePhase] - nowTime
      //           console.log(newStage.timing.timeToNextRound)
      //           if (newStage.timing.timeToNextRound < 0) {
      //             console.log('Next phase')
      //             var stage = getters.getCurrentGame.gameStage
      //             var phase = getters.getCurrentGame.gamePhase
      //             var gameStages = ['Discussion', 'Vote pushing', 'Voting', 'Voting summary']
      //             var i = gameStages.indexOf(phase)
      //             if (stage === 0) {
      //               stage = 1
      //               phase = 'Discussion'
      //               newStage[stage] = {}
      //               newStage[stage].laws = {}
      //             } else if (phase === 'Voting summary') {
      //               phase = 'Discussion'
      //               stage += 1
      //               newStage[stage] = {}
      //               newStage[stage].laws = {}
      //               for (var group in newStage.groups) {
      //                 if (group === 'Admin') {
      //                   newStage.groups[group].pushes = 10
      //                   newStage.groups[group].votes = 10
      //                 }
      //                 newStage.groups[group].pushes = newStage.rules.pushes
      //                 newStage.groups[group].votes = newStage.rules.votes
      //               }
      //               // Checking scenarios
      //               var wellbeingList = ['Економіка', 'Політичні права', 'Якість життя', 'Безпека']
      //               for (var s = 0; s <= 5; s++) {
      //                 const randomElement = wellbeingList[Math.floor(Math.random() * wellbeingList.length)]
      //                 console.log('Checking wellbeing', randomElement)
      //                 if (newStage.wellbeing[randomElement] <= 5 || newStage.wellbeing[randomElement] >= 25) {
      //                   var randomScenario = ''
      //                   if (newStage.wellbeing[randomElement] <= 5) {
      //                     randomScenario = 'bad_' + getRandomInt(1, 3)
      //                   }
      //                   if (newStage.wellbeing[randomElement] >= 15) {
      //                     randomScenario = 'good_' + getRandomInt(1, 3)
      //                   }
      //                   var news = {
      //                     title: 'Термінові новини!',
      //                     text: getters.getLaws.scenario.wellbeing[randomElement][randomScenario].text,
      //                     author: 'Адміністрація Мартії'
      //                   }
      //                   dispatch('addNews', news)
      //                   var changesList2 = getters.getLaws.scenario.wellbeing[randomElement][randomScenario].change
      //                   for (var group4 in newStage.groups) {
      //                     for (var change4 in Object.keys(changesList2)) {
      //                       if (group4 === Object.keys(changesList2)[change4]) {
      //                         console.log('match', changesList2[group4])
      //                         newStage.groups[group4].stats += changesList2[group4]
      //                       }
      //                     }
      //                   }
      //                   break
      //                 }
      //               }
      //             } else if (phase === 'Vote pushing') {
      //               phase = gameStages[i + 1]
      //             } else if (phase === 'Voting') {
      //               phase = gameStages[i + 1]
      //               console.log('Adopting laws')
      //               newStage[stage].adopted = {}
      //               var changesList = {}
      //               var wellbeingChangesList = {}
      //               for (var law in newStage[stage].laws) {
      //                 if (newStage[stage].laws[law].rating >= getters.getCurrentGame.rules.adoption_number) {
      //                   newStage[stage].adopted[law] = newStage[stage].laws[law]
      //                   for (var group3 in newStage.groups) {
      //                     if (newStage[stage].adopted[law].change[group3] !== undefined) {
      //                       if (isNaN(changesList[group3])) {
      //                         changesList[group3] = newStage[stage].adopted[law].change[group3]
      //                       } else {
      //                         changesList[group3] += newStage[stage].adopted[law].change[group3]
      //                       }
      //                     }
      //                   }
      //                   for (var wellbeing in newStage[stage].adopted[law].change.wellbeing) {
      //                     if (isNaN(wellbeingChangesList[wellbeing])) {
      //                       wellbeingChangesList[wellbeing] = newStage[stage].adopted[law].change.wellbeing[wellbeing]
      //                     } else {
      //                       wellbeingChangesList[wellbeing] += newStage[stage].adopted[law].change.wellbeing[wellbeing]
      //                     }
      //                   }
      //                 }
      //               }
      //               newStage.last_changes = changesList
      //               newStage.last_changes_wellbeing = wellbeingChangesList
      //               for (var group2 in newStage.groups) {
      //                 for (var change2 in changesList) {
      //                   if (group2 === change2) {
      //                     console.log('Changing Group', group2)
      //                     console.log('Changing Stats', changesList[change2])
      //                     console.log('Now stats', newStage.groups[group2].stats)
      //                     newStage.groups[group2].stats += changesList[change2]
      //                     console.log('Now', newStage.groups[group2].stats)
      //                   }
      //                 }
      //               }
      //               for (var wellbeing2 in newStage.wellbeing) {
      //                 if (newStage.last_changes_wellbeing[wellbeing2] !== undefined) {
      //                   newStage.wellbeing[wellbeing2] += newStage.last_changes_wellbeing[wellbeing2]
      //                 }
      //               }
      //             } else {
      //               phase = gameStages[i + 1]
      //             }
      //             newStage.gameStage = stage
      //             newStage.gamePhase = phase
      //             console.log('Game stage changed')
      //           }
      //           commit('setCurrentGame', newStage)
      //           dispatch('setCurrentGameFirebase', newStage)
      //         }
      //         if (doc.data().gamePhase !== getters.getCurrentGame.gamePhase && getters.getCurrentGame.gamePhase !== undefined) {
      //           Notify.create({
      //             message: 'Нова фаза гри! ' + newStage.gamePhase,
      //             color: 'blue'
      //           })
      //           const audio = new Audio(require('../assets/bell.wav'))
      //           audio.play()
      //         }
      //         if (getters.getCurrentGame.news !== undefined) {
      //           if (Object.keys(getters.getCurrentGame.news).length !== Object.keys(doc.data().news).length) {
      //             Notify.create({
      //               message: 'Термінова новина! Перевірте вкладку "Новини"',
      //               color: 'blue'
      //             })
      //             const audio = new Audio(require('../assets/bell.wav'))
      //             audio.play()
      //           }
      //         }
      //         console.log(doc.data())
      //         console.log('Current game loaded')
      //         commit('setCurrentGame', doc.data())
      //       })
      //       .catch(function (error) {
      //         console.error('Error getting current game: ', error)
      //       })
      //   }
      // },
      // setCurrentGameFirebase ({ commit }, game) {
      //   db.collection('games').doc(game.gameID).set(game)
      //     .then(function () {
      //       console.log('Game set')
      //       var allGames = {}
      //       db.collection('games').get().then((querySnapshot) => {
      //         querySnapshot.forEach((doc) => {
      //           allGames[doc.id] = doc.data()
      //         })
      //       })
      //       commit('setSuperadminSet', allGames)
      //       commit('setCurrentGame', game)
      //     })
      //     .catch(function (error) {
      //       console.error('Error setting game: ', error)
      //     })
      // },
      // setQuizResults ({ commit, getters }, quiz) {
      //   db.collection('games').doc(getters.getUser.gameID).get()
      //     .then(function (doc) {
      //       console.log('Game set')
      //       var newQuiz = doc.data()
      //       newQuiz.login_set[getters.getUser.group][getters.getUser.email].start_quiz.passed = true
      //       newQuiz.login_set[getters.getUser.group][getters.getUser.email].start_quiz.result = quiz
      //       commit('setPage', 'Rules')
      //       commit('setCurrentGame', newQuiz)
      //       db.collection('games').doc(getters.getUser.gameID).set(newQuiz)
      //         .then(function () {
      //           console.log('Quiz updated')
      //         })
      //         .catch(function (error) {
      //           console.error('Error updating quiz set: ', error)
      //         })
      //     })
      //     .catch(function (error) {
      //       console.error('Error setting quiz: ', error)
      //     })
      // },
      // startGame ({ commit, dispatch, getters }) {
      //   db.collection('games').doc(getters.getUser.gameID).get()
      //     .then(function (doc) {
      //       var newStage = doc.data()
      //       var startTime = Date.now()
      //       newStage.timing = {}
      //       newStage.timing.start = startTime
      //       newStage.timing[1] = {}
      //       newStage.timing[1].Discussion = startTime + 900000
      //       newStage.timing[1]['Vote pushing'] = startTime + 1200000
      //       newStage.timing[1].Voting = startTime + 1500000
      //       newStage.timing[1]['Voting summary'] = startTime + 1800000
      //       var timeAdd = startTime + 1800000
      //       for (var ph = 2; ph < 7; ph++) {
      //         newStage.timing[ph] = {}
      //         newStage.timing[ph].Discussion = timeAdd + 600000
      //         newStage.timing[ph]['Vote pushing'] = timeAdd + 780000
      //         newStage.timing[ph].Voting = timeAdd + 960000
      //         newStage.timing[ph]['Voting summary'] = timeAdd + 1140000
      //         timeAdd += 1140000
      //       }
      //       newStage.gameStage = 1
      //       newStage.gamePhase = 'Discussion'
      //       newStage[1] = {}
      //       newStage[1].laws = {}
      //       commit('setCurrentGame', newStage)
      //       dispatch('setCurrentGameFirebase', newStage)
      //     })
      //     .catch(function (error) {
      //       console.error('Error setting timer: ', error)
      //     })
      // },
      // stopGame ({ commit, dispatch, getters }) {
      //   db.collection('games').doc(getters.getUser.gameID).get()
      //     .then(function (doc) {
      //       var newStage = doc.data()
      //       newStage.timing = {}
      //       newStage.timing.start = 0
      //       newStage.timing['1'] = {}
      //       newStage.timing['1'].Discussion = 0
      //       newStage.timing['1']['Vote pushing'] = 0
      //       newStage.timing['1'].Voting = 0
      //       newStage.timing['1']['Voting summary'] = 0
      //       newStage.gameStage = 0
      //       newStage.gamePhase = 'Registration'
      //       commit('setCurrentGame', newStage)
      //       dispatch('setCurrentGameFirebase', newStage)
      //     })
      //     .catch(function (error) {
      //       console.error('Error setting timer: ', error)
      //     })
      // },
      // setNextStageFirebase ({ commit, dispatch, getters }) {
      //   db.collection('games').doc(getters.getUser.gameID).get()
      //     .then(function (doc) {
      //       var newStage = doc.data()
      //       var stage = getters.getCurrentGame.gameStage
      //       var phase = getters.getCurrentGame.gamePhase
      //       var gameStages = ['Discussion', 'Vote pushing', 'Voting', 'Voting summary']
      //       var i = gameStages.indexOf(phase)
      //       if (stage === 0) {
      //         stage = 1
      //         phase = 'Discussion'
      //         newStage[stage] = {}
      //         newStage[stage].laws = {}
      //       } else if (phase === 'Voting summary') {
      //         phase = 'Discussion'
      //         stage += 1
      //         newStage[stage] = {}
      //         newStage[stage].laws = {}
      //         for (var group in newStage.groups) {
      //           if (group === 'Admin') {
      //             newStage.groups[group].pushes = 10
      //             newStage.groups[group].votes = 10
      //           }
      //           newStage.groups[group].pushes = newStage.rules.pushes
      //           newStage.groups[group].votes = newStage.rules.votes
      //         }
      //         // Checking scenarios
      //         var wellbeingList = ['Економіка', 'Політичні права', 'Якість життя', 'Безпека']
      //         for (var s = 0; s <= 5; s++) {
      //           const randomElement = wellbeingList[Math.floor(Math.random() * wellbeingList.length)]
      //           console.log('Checking wellbeing', randomElement)
      //           if (newStage.wellbeing[randomElement] <= 5 || newStage.wellbeing[randomElement] >= 25) {
      //             var randomScenario = ''
      //             if (newStage.wellbeing[randomElement] <= 5) {
      //               randomScenario = 'bad_' + getRandomInt(1, 3)
      //             }
      //             if (newStage.wellbeing[randomElement] >= 15) {
      //               randomScenario = 'good_' + getRandomInt(1, 3)
      //             }
      //             var news = {
      //               title: 'Термінові новини!',
      //               text: getters.getLaws.scenario.wellbeing[randomElement][randomScenario].text,
      //               author: 'Адміністрація Мартії'
      //             }
      //             dispatch('addNews', news)
      //             var changesList2 = getters.getLaws.scenario.wellbeing[randomElement][randomScenario].change
      //             for (var group4 in newStage.groups) {
      //               for (var change4 in Object.keys(changesList2)) {
      //                 if (group4 === Object.keys(changesList2)[change4]) {
      //                   console.log('match', changesList2[group4])
      //                   newStage.groups[group4].stats += changesList2[group4]
      //                 }
      //               }
      //             }
      //             break
      //           }
      //         }
      //       } else if (phase === 'Vote pushing') {
      //         phase = gameStages[i + 1]
      //       } else if (phase === 'Voting') {
      //         phase = gameStages[i + 1]
      //         console.log('Adopting laws')
      //         newStage[stage].adopted = {}
      //         var changesList = {}
      //         var wellbeingChangesList = {}
      //         for (var law in newStage[stage].laws) {
      //           if (newStage[stage].laws[law].rating >= getters.getCurrentGame.rules.adoption_number) {
      //             newStage[stage].adopted[law] = newStage[stage].laws[law]
      //             for (var group3 in newStage.groups) {
      //               if (newStage[stage].adopted[law].change[group3] !== undefined) {
      //                 if (isNaN(changesList[group3])) {
      //                   changesList[group3] = newStage[stage].adopted[law].change[group3]
      //                 } else {
      //                   changesList[group3] += newStage[stage].adopted[law].change[group3]
      //                 }
      //               }
      //             }
      //             for (var wellbeing in newStage[stage].adopted[law].change.wellbeing) {
      //               if (isNaN(wellbeingChangesList[wellbeing])) {
      //                 wellbeingChangesList[wellbeing] = newStage[stage].adopted[law].change.wellbeing[wellbeing]
      //               } else {
      //                 wellbeingChangesList[wellbeing] += newStage[stage].adopted[law].change.wellbeing[wellbeing]
      //               }
      //             }
      //           }
      //         }
      //         newStage.last_changes = changesList
      //         newStage.last_changes_wellbeing = wellbeingChangesList
      //         for (var group2 in newStage.groups) {
      //           for (var change2 in changesList) {
      //             if (group2 === change2) {
      //               console.log('Changing Group', group2)
      //               console.log('Changing Stats', changesList[change2])
      //               console.log('Now stats', newStage.groups[group2].stats)
      //               newStage.groups[group2].stats += changesList[change2]
      //               console.log('Now', newStage.groups[group2].stats)
      //             }
      //           }
      //         }
      //         for (var wellbeing2 in newStage.wellbeing) {
      //           if (newStage.last_changes_wellbeing[wellbeing2] !== undefined) {
      //             newStage.wellbeing[wellbeing2] += newStage.last_changes_wellbeing[wellbeing2]
      //           }
      //         }
      //       } else {
      //         phase = gameStages[i + 1]
      //       }
      //       newStage.gameStage = stage
      //       newStage.gamePhase = phase
      //       console.log('Game stage changed')
      //       commit('setCurrentGame', newStage)
      //       dispatch('setCurrentGameFirebase', newStage)
      //     })
      //     .catch(function (error) {
      //       console.error('Error changing game stage: ', error)
      //     })
      // },
      // pushForVoting ({ commit, dispatch, getters }, law) {
      //   db.collection('games').doc(getters.getUser.gameID).get()
      //     .then(function (doc) {
      //       var newVoting = doc.data()
      //       if (newVoting.groups[getters.getUser.group].pushes <= 0) {
      //         Notify.create({
      //           message: 'Your group have used all pushes',
      //           color: 'red'
      //         })
      //       } else {
      //         Notify.create({
      //           message: 'Law has been pushed. Pushes left: ' + (parseInt(newVoting.groups[getters.getUser.group].pushes) - 1).toString(),
      //           color: 'green'
      //         })
      //         newVoting[getters.getCurrentGame.gameStage].laws[law.text] = {}
      //         newVoting[getters.getCurrentGame.gameStage].laws[law.text].change = law.change
      //         newVoting[getters.getCurrentGame.gameStage].laws[law.text].rating = 0
      //         newVoting[getters.getCurrentGame.gameStage].laws[law.text].groups_voted = {}
      //         newVoting.groups[getters.getUser.group].pushes -= 1
      //         console.log('Vote has been pushed')
      //         commit('setCurrentGame', newVoting)
      //         dispatch('setCurrentGameFirebase', newVoting)
      //       }
      //     })
      //     .catch(function (error) {
      //       console.error('Error pushing to voting: ', error)
      //     })
      // },
      // voteFor ({ commit, dispatch, getters }, law) {
      //   db.collection('games').doc(getters.getUser.gameID).get()
      //     .then(function (doc) {
      //       var newVoting = doc.data()
      //       var groupsVotedList = []
      //       console.log(groupsVotedList)
      //       if (newVoting[getters.getCurrentGame.gameStage].laws[law].groups_voted !== undefined) {
      //         for (var l in newVoting[getters.getCurrentGame.gameStage].laws[law].groups_voted) {
      //           groupsVotedList.push(newVoting[getters.getCurrentGame.gameStage].laws[law].groups_voted[l])
      //         }
      //       }
      //       if (newVoting.groups[getters.getUser.group].votes <= 0) {
      //         Notify.create({
      //           message: 'Your group have used all votes',
      //           color: 'red'
      //         })
      //       } else if (groupsVotedList.includes(getters.getUser.group)) {
      //         Notify.create({
      //           message: 'Your group has already voted for this law',
      //           color: 'red'
      //         })
      //       } else {
      //         Notify.create({
      //           message: 'Your vote is counted. Votes left: ' + (parseInt(newVoting.groups[getters.getUser.group].votes) - 1).toString(),
      //           color: 'green'
      //         })
      //         groupsVotedList.push(getters.getUser.group)
      //         console.log(groupsVotedList)
      //         groupsVotedList.forEach(function (value, i) {
      //           newVoting[getters.getCurrentGame.gameStage].laws[law].groups_voted[i] = value
      //         })
      //         newVoting[getters.getCurrentGame.gameStage].laws[law].rating += 1
      //         newVoting.groups[getters.getUser.group].votes -= 1
      //         console.log('Voted')
      //         commit('setCurrentGame', newVoting)
      //         dispatch('setCurrentGameFirebase', newVoting)
      //       }
      //     })
      //     .catch(function (error) {
      //       console.error('Error voting: ', error)
      //     })
      // },
      // addNews ({ commit, dispatch, getters }, news) {
      //   db.collection('games').doc(getters.getUser.gameID).get()
      //     .then(function (doc) {
      //       var newState = doc.data()
      //       var currentTime = Date.now().toString()
      //       newState.news[currentTime] = {}
      //       newState.news[currentTime].title = news.title
      //       newState.news[currentTime].text = news.text
      //       newState.news[currentTime].author = news.author
      //       commit('setCurrentGame', newState)
      //       dispatch('setCurrentGameFirebase', newState)
      //     })
      //     .catch(function (error) {
      //       console.error('Error pushing to voting: ', error)
      //     })
      // }
    }
  })

  store = Store

  // Quasar default
  return Store
}

// add this line to access store wherever you need
export { store }
