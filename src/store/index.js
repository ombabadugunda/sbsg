import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import laws from '../json/data.json'
import { Notify } from 'quasar'

let store = null

const firebaseConfig = {
  apiKey: 'AIzaSyBQVmQ9C6TN07aB72G83FnJY-7e1dNxxR8',
  authDomain: 'state-building.firebaseapp.com',
  projectId: 'state-building',
  storageBucket: 'state-building.appspot.com',
  messagingSenderId: '942409426431',
  appId: '1:942409426431:web:8170661a5c9a49678033ca',
  measurementId: 'G-L40HE024TB'
}
firebase.initializeApp(firebaseConfig)

Vue.use(Vuex)
var db = firebase.firestore()

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export default function () {
  const Store = new Vuex.Store({
    namespaced: true,
    name: 'global',
    state: {
      laws,
      allGames: {},
      currentGame: {},
      user: {
        id: 0,
        group: 'None',
        currentPage: 'Log',
        currentCategorie: 'None',
        username: '',
        gameID: ''
      }
    },
    getters: {
      getUser: state => {
        return state.user
      },
      getCurrentGame: state => {
        return state.currentGame
      },
      getLaws: state => {
        return state.laws
      },
      getSuperadminSet: state => {
        return state.allGames
      }
    },
    mutations: {
      setPage (state, page) {
        state.user.currentPage = page
      },
      setUser (state, payload) {
        state.user.id = payload.id
        state.user.username = payload.username
        state.user.group = payload.group
        state.user.gameID = payload.gameID
      },
      setCategorie (state, cat) {
        state.user.currentCategorie = cat
      },
      setGroups (state, set) {
        state.groups = set
      },
      setCurrentGame (state, set) {
        state.currentGame = set
      },
      setSuperadminSet (state, set) {
        state.allGames = set
      }
    },
    actions: {
      loginUser ({ commit }, login) {
        var loggedIn = false
        if (login.id === '777') {
          var payload = {
            id: 'Superadmin',
            username: 'Superadmin',
            group: 'Superadmin',
            gameID: ''
          }
          Notify.create({
            message: 'Ви зайшли як Суперадмін',
            color: 'green'
          })
          var allGames = {}
          db.collection('games').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.data())
              allGames[doc.id] = doc.data()
            })
          })
          commit('setSuperadminSet', allGames)
          commit('setUser', payload)
          commit('setPage', 'Superadmin')
        } else {
          db.collection('games').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              for (var group in doc.data().login_set) {
                for (var account in doc.data().login_set[group]) {
                  if (account === login.id) {
                    loggedIn = true
                    var newData = doc.data()
                    newData.login_set[group][account].name = login.username
                    commit('setCurrentGame', newData)
                    if (newData.login_set[group][account].start_quiz.passed === true || group === 'Admin') {
                      commit('setPage', 'News')
                    } else {
                      commit('setPage', 'Start_quiz')
                    }
                    var payload = {
                      id: login.id,
                      username: login.username,
                      gameID: doc.id,
                      group: group
                    }
                    commit('setUser', payload)
                    db.collection('games').doc(doc.id).set(newData)
                      .then(function () {
                        console.log('Loggin set updated')
                      })
                      .catch(function (error) {
                        console.error('Error updating login set: ', error)
                      })
                    var message = 'Вітаємо у грі! Ваша група - ' + group
                    Notify.create({
                      message,
                      color: 'green'
                    })
                    break
                  }
                }
              }
            })
            if (loggedIn === false) {
              Notify.create({
                message: 'Користувача з таким кодом не знайдено!',
                color: 'red'
              })
            }
          })
        }
      },
      getCurrentGameFirebase ({ commit, getters }) {
        console.log(getters.getUser.gameID)
        if (getters.getUser.gameID !== '') {
          db.collection('games').doc(getters.getUser.gameID).get()
            .then(function (doc) {
              if (doc.data().gamePhase !== getters.getCurrentGame.gamePhase && getters.getCurrentGame.gamePhase !== undefined) {
                Notify.create({
                  message: 'New phase! ' + doc.data().gamePhase,
                  color: 'blue'
                })
                const audio = new Audio(require('../assets/bell.wav'))
                audio.play()
              }
              if (getters.getCurrentGame.news !== undefined) {
                if (Object.keys(getters.getCurrentGame.news).length !== Object.keys(doc.data().news).length) {
                  Notify.create({
                    message: 'News has come! Check the "News" page',
                    color: 'blue'
                  })
                  const audio = new Audio(require('../assets/bell.wav'))
                  audio.play()
                }
              }
              console.log('Current game loaded')
              commit('setCurrentGame', doc.data())
            })
            .catch(function (error) {
              console.error('Error getting current game: ', error)
            })
        }
      },
      setCurrentGameFirebase ({ commit }, game) {
        db.collection('games').doc(game.gameID).set(game)
          .then(function () {
            console.log('Game set')
            var allGames = {}
            db.collection('games').get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log(doc.data())
                allGames[doc.id] = doc.data()
              })
            })
            commit('setSuperadminSet', allGames)
            commit('setCurrentGame', game)
          })
          .catch(function (error) {
            console.error('Error setting game: ', error)
          })
      },
      setQuizResults ({ commit, getters }, quiz) {
        db.collection('games').doc(getters.getUser.gameID).get()
          .then(function (doc) {
            console.log('Game set')
            var newQuiz = doc.data()
            newQuiz.login_set[getters.getUser.group][getters.getUser.id].start_quiz.passed = true
            newQuiz.login_set[getters.getUser.group][getters.getUser.id].start_quiz.result = quiz
            commit('setPage', 'News')
            commit('setCurrentGame', newQuiz)
            db.collection('games').doc(getters.getUser.gameID).set(newQuiz)
              .then(function () {
                console.log('Quiz updated')
              })
              .catch(function (error) {
                console.error('Error updating quiz set: ', error)
              })
          })
          .catch(function (error) {
            console.error('Error setting quiz: ', error)
          })
      },
      setNextStageFirebase ({ commit, dispatch, getters }) {
        db.collection('games').doc(getters.getUser.gameID).get()
          .then(function (doc) {
            var newStage = doc.data()
            var stage = getters.getCurrentGame.gameStage
            var phase = getters.getCurrentGame.gamePhase
            var gameStages = ['Discussion', 'Vote pushing', 'Voting', 'Voting summary']
            var i = gameStages.indexOf(phase)
            if (stage === 0) {
              stage = 1
              phase = 'Discussion'
              newStage[stage] = {}
              newStage[stage].laws = {}
              commit('setTimer', 10000)
            } else if (phase === 'Voting summary') {
              phase = 'Discussion'
              stage += 1
              newStage[stage] = {}
              newStage[stage].laws = {}
              for (var group in newStage.groups) {
                if (group === 'Admin') {
                  newStage.groups[group].pushes = 10
                  newStage.groups[group].votes = 10
                }
                newStage.groups[group].pushes = newStage.rules.pushes
                newStage.groups[group].votes = newStage.rules.votes
              }
              // Checking scenarios
              var wellbeingList = ['Економіка', 'Політичні права', 'Якість життя', 'Безпека']
              for (var s = 0; s <= 5; s++) {
                const randomElement = wellbeingList[Math.floor(Math.random() * wellbeingList.length)]
                console.log('Checking wellbeing', randomElement)
                if (newStage.wellbeing[randomElement] <= 5 || newStage.wellbeing[randomElement] >= 25) {
                  var randomScenario = ''
                  if (newStage.wellbeing[randomElement] <= 5) {
                    randomScenario = 'bad_' + getRandomInt(1, 3)
                  }
                  if (newStage.wellbeing[randomElement] >= 15) {
                    randomScenario = 'good_' + getRandomInt(1, 3)
                  }
                  var news = {
                    title: 'Термінові новини!',
                    text: getters.getLaws.scenario.wellbeing[randomElement][randomScenario].text,
                    author: 'Адміністрація Мартії'
                  }
                  dispatch('addNews', news)
                  var changesList2 = getters.getLaws.scenario.wellbeing[randomElement][randomScenario].change
                  for (var group4 in newStage.groups) {
                    for (var change4 in Object.keys(changesList2)) {
                      if (group4 === Object.keys(changesList2)[change4]) {
                        console.log('match', changesList2[group4])
                        newStage.groups[group4].stats += changesList2[group4]
                      }
                    }
                  }
                  break
                }
              }
            } else if (phase === 'Vote pushing') {
              phase = gameStages[i + 1]
              commit('setTimer', 3000)
            } else if (phase === 'Voting') {
              phase = gameStages[i + 1]
              console.log('Adopting laws')
              newStage[stage].adopted = {}
              var changesList = {}
              var wellbeingChangesList = {}
              for (var law in newStage[stage].laws) {
                if (newStage[stage].laws[law].rating >= getters.getCurrentGame.rules.adoption_number) {
                  newStage[stage].adopted[law] = newStage[stage].laws[law]
                  for (var group3 in newStage.groups) {
                    if (newStage[stage].adopted[law].change[group3] !== undefined) {
                      if (isNaN(changesList[group3])) {
                        changesList[group3] = newStage[stage].adopted[law].change[group3]
                      } else {
                        changesList[group3] += newStage[stage].adopted[law].change[group3]
                      }
                    }
                  }
                  for (var wellbeing in newStage[stage].adopted[law].change.wellbeing) {
                    if (isNaN(wellbeingChangesList[wellbeing])) {
                      wellbeingChangesList[wellbeing] = newStage[stage].adopted[law].change.wellbeing[wellbeing]
                    } else {
                      wellbeingChangesList[wellbeing] += newStage[stage].adopted[law].change.wellbeing[wellbeing]
                    }
                  }
                }
              }
              newStage.last_changes = changesList
              newStage.last_changes_wellbeing = wellbeingChangesList
              for (var group2 in newStage.groups) {
                for (var change2 in changesList) {
                  if (group2 === Object.keys(changesList[change2])[0]) {
                    newStage.groups[group2].stats += changesList[change2][Object.keys(changesList[change2])[0]]
                  }
                }
              }
              for (var wellbeing2 in newStage.wellbeing) {
                if (newStage.last_changes_wellbeing[wellbeing2] !== undefined) {
                  newStage.wellbeing[wellbeing2] += newStage.last_changes_wellbeing[wellbeing2]
                }
              }
            } else {
              phase = gameStages[i + 1]
            }
            newStage.gameStage = stage
            newStage.gamePhase = phase
            console.log('Game stage changed')
            commit('setCurrentGame', newStage)
            dispatch('setCurrentGameFirebase', newStage)
          })
          .catch(function (error) {
            console.error('Error changing game stage: ', error)
          })
      },
      pushForVoting ({ commit, dispatch, getters }, law) {
        db.collection('games').doc(getters.getUser.gameID).get()
          .then(function (doc) {
            var newVoting = doc.data()
            if (newVoting.groups[getters.getUser.group].pushes <= 0) {
              Notify.create({
                message: 'Your group have used all pushes',
                color: 'red'
              })
            } else {
              newVoting[getters.getCurrentGame.gameStage].laws[law.text] = {}
              newVoting[getters.getCurrentGame.gameStage].laws[law.text].change = law.change
              newVoting[getters.getCurrentGame.gameStage].laws[law.text].rating = 0
              newVoting[getters.getCurrentGame.gameStage].laws[law.text].groups_voted = {}
              newVoting.groups[getters.getUser.group].pushes -= 1
              console.log('Vote has been pushed')
              commit('setCurrentGame', newVoting)
              dispatch('setCurrentGameFirebase', newVoting)
            }
          })
          .catch(function (error) {
            console.error('Error pushing to voting: ', error)
          })
      },
      voteFor ({ commit, dispatch, getters }, law) {
        db.collection('games').doc(getters.getUser.gameID).get()
          .then(function (doc) {
            var newVoting = doc.data()
            var groupsVotedList = []
            console.log(groupsVotedList)
            if (newVoting[getters.getCurrentGame.gameStage].laws[law].groups_voted !== undefined) {
              for (var l in newVoting[getters.getCurrentGame.gameStage].laws[law].groups_voted) {
                groupsVotedList.push(newVoting[getters.getCurrentGame.gameStage].laws[law].groups_voted[l])
              }
            }
            console.log(groupsVotedList)
            if (newVoting.groups[getters.getUser.group].votes <= 0) {
              Notify.create({
                message: 'Your group have used all votes',
                color: 'red'
              })
            } else if (groupsVotedList.includes(getters.getUser.group)) {
              Notify.create({
                message: 'Your group has already voted for this law',
                color: 'red'
              })
            } else {
              groupsVotedList.push(getters.getUser.group)
              console.log(groupsVotedList)
              groupsVotedList.forEach(function (value, i) {
                newVoting[getters.getCurrentGame.gameStage].laws[law].groups_voted[i] = value
              })
              newVoting[getters.getCurrentGame.gameStage].laws[law].rating += 1
              newVoting.groups[getters.getUser.group].votes -= 1
              console.log('Voted')
              commit('setCurrentGame', newVoting)
              dispatch('setCurrentGameFirebase', newVoting)
            }
          })
          .catch(function (error) {
            console.error('Error voting: ', error)
          })
      },
      addNews ({ commit, dispatch, getters }, news) {
        db.collection('games').doc(getters.getUser.gameID).get()
          .then(function (doc) {
            var newState = doc.data()
            var currentTime = Date.now().toString()
            newState.news[currentTime] = {}
            newState.news[currentTime].title = news.title
            newState.news[currentTime].text = news.text
            newState.news[currentTime].author = news.author
            commit('setCurrentGame', newState)
            dispatch('setCurrentGameFirebase', newState)
          })
          .catch(function (error) {
            console.error('Error pushing to voting: ', error)
          })
      }
    }
  })

  // add this so that we export store
  store = Store
  // store.dispatch('getLoginSet')
  // store.dispatch('getCurrentGameFirebase')

  setInterval(() => {
    store.dispatch('getCurrentGameFirebase')
  }, 5000)

  // Quasar default
  return Store
}

// add this line to access store wherever you need
export { store }
