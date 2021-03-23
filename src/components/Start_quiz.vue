<template>
  <q-page>
    <div class="news">
      <div class="container">
         <div class="subtitle">
            <h2> Перед початком гри слід пройти невелике опитування </h2>
            <div class="news__block" >
            <h3 class="news__title">Який ви політичний лідер?</h3>
            <div class="news__text">
              <p>Існує чимало систем керування державою. Але найкраща – це, звісно, ви! Бо тільки ви знаєте, як буде найкраще і для суспільства, і для кожного індивіда. Зараз це і перевіримо!</p>
            </div>
            </div>
          </div>
        <div class="news__content">
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[0] }}</h3>
            <div class="news__text">
              <q-radio v-model="answer_set[0]" val="Сильна рука! Можливо, як Маргарет Тетчер" label="Сильна рука! Можливо, як Маргарет Тетчер" /><br>
              <q-radio v-model="answer_set[0]" val="Людина-компроміс, яка не підтримує жодну політсилу" label="Людина-компроміс, яка не підтримує жодну політсилу" /><br>
              <q-radio v-model="answer_set[0]" val="Номінальна фігура, що слідкує за збереженням демократії" label="Номінальна фігура, що слідкує за збереженням демократії" /><br>
              <q-radio v-model="answer_set[0]" val="Державі взагалі не потрібна одна єдина особа–керівник" label="Державі взагалі не потрібна одна єдина особа–керівник" />
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[1] }}</h3>
            <div class="news__text">
              <div class="q-gutter-sm">
                <q-checkbox v-model="answer_set[1]" val="Бізнес" label="Бізнес" color="teal" /><br>
                <q-checkbox v-model="answer_set[1]" val="Чиновники" label="Чиновники" color="orange" /><br>
                <q-checkbox v-model="answer_set[1]" val="Вразливі верстви населення" label="Вразливі верстви населення" color="red" /><br>
                <q-checkbox v-model="answer_set[1]" val="ЗМІ" label="ЗМІ" color="cyan" /><br>
                <q-checkbox v-model="answer_set[1]" val="Співробітники правоохоронних органів і судді" label="Співробітники правоохоронних органів і судді" color="teal" /><br>
                <q-checkbox v-model="answer_set[1]" val="Громадські активісти" label="Громадські активісти" color="orange" /><br>
                <q-checkbox v-model="answer_set[1]" val="Військовослужбовці" label="Військовослужбовці" color="red" /><br>
                <q-checkbox v-model="answer_set[1]" val="Митці та культурні діячі" label="Митці та культурні діячі" color="cyan" /><br>
                <q-checkbox v-model="answer_set[1]" val="Пенсіонери" label="Пенсіонери" color="teal" /><br>
                <q-checkbox v-model="answer_set[1]" val="Бюджетники" label="Бюджетники" color="orange" />
              </div>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[2] }}</h3>
            <div class="news__text">
              <div class="q-gutter-sm">
                <q-checkbox v-model="answer_set[2]" val="Безпека" label="Безпека" color="teal" /><br>
                <q-checkbox v-model="answer_set[2]" val="Економіка" label="Економіка" color="orange" /><br>
                <q-checkbox v-model="answer_set[2]" val="Рівень життя" label="Рівень життя" color="red" /><br>
                <q-checkbox v-model="answer_set[2]" val="Політичні права" label="Політичні права" color="cyan" /><br>
              </div>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[3] }}</h3>
            <div class="news__text">
              <div class="news__text">
                <q-radio v-model="answer_set[3]" val="1" label="1" />
                <q-radio v-model="answer_set[3]" val="2" label="2" />
                <q-radio v-model="answer_set[3]" val="3" label="3" />
                <q-radio v-model="answer_set[3]" val="4" label="4" />
                <q-radio v-model="answer_set[3]" val="5" label="5" />
                <q-radio v-model="answer_set[3]" val="6" label="6" />
                <q-radio v-model="answer_set[3]" val="7" label="7" />
                <q-radio v-model="answer_set[3]" val="8" label="8" />
                <q-radio v-model="answer_set[3]" val="9" label="9" />
                <q-radio v-model="answer_set[3]" val="10" label="10" />
            </div>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[4] }}</h3>
            <div class="news__text">
              <div class="q-gutter-sm">
                <q-radio v-model="answer_set[4]" val="Якщо протести дійсно масштабні, треба йти у відставку" label="Якщо протести дійсно масштабні, треба йти у відставку" color="teal" /><br>
                <q-radio v-model="answer_set[4]" val="Прийшов час показати силу й жорстко придушити заколот" label="Прийшов час показати силу й жорстко придушити заколот" color="orange" /><br>
                <q-radio v-model="answer_set[4]" val="Пора збирати всенародний круглий стіл, аби вирішити все у діалозі" label="Пора збирати всенародний круглий стіл, аби вирішити все у діалозі" color="red" /><br>
                <q-radio v-model="answer_set[4]" val="Просто проігнорую, покричать – і розійдуться" label="Просто проігнорую, покричать – і розійдуться" color="cyan" /><br>
              </div>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[5] }}</h3>
            <div class="news__text">
              <div class="news__text">
                <q-radio v-model="answer_set[5]" val="1" label="1" />
                <q-radio v-model="answer_set[5]" val="2" label="2" />
                <q-radio v-model="answer_set[5]" val="3" label="3" />
                <q-radio v-model="answer_set[5]" val="4" label="4" />
                <q-radio v-model="answer_set[5]" val="5" label="5" />
                <q-radio v-model="answer_set[5]" val="6" label="6" />
                <q-radio v-model="answer_set[5]" val="7" label="7" />
                <q-radio v-model="answer_set[5]" val="8" label="8" />
                <q-radio v-model="answer_set[5]" val="9" label="9" />
                <q-radio v-model="answer_set[5]" val="10" label="10" />
              </div>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[6] }}</h3>
            <div class="news__text">
              <q-radio v-model="answer_set[6]" val="Друг – завжди друг. Я потай накажу закрити справу" label="Друг – завжди друг. Я потай накажу закрити справу" /><br>
              <q-radio v-model="answer_set[6]" val="Не буду робити нічого. Хай вирішує суд" label="Не буду робити нічого. Хай вирішує суд" /><br>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[7] }}</h3>
            <div class="news__text">
              <q-radio v-model="answer_set[7]" val="Буду сильним лідером" label="Буду сильним лідером" /><br>
              <q-radio v-model="answer_set[7]" val="Просто спокійно виконуватиму обов'язки" label="Просто спокійно виконуватиму обов'язки" /><br>
              <q-radio v-model="answer_set[7]" val="Стану людиною, яка об'єднає різні групи" label="Стану людиною, яка об'єднає різні групи" /><br>
              <q-radio v-model="answer_set[7]" val="Так як воно само складеться, так і буде" label="Так як воно само складеться, так і буде" /><br>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[8] }}</h3>
            <div class="news__text">
              <div class="news__text">
                <q-radio v-model="answer_set[8]" val="1" label="1" />
                <q-radio v-model="answer_set[8]" val="2" label="2" />
                <q-radio v-model="answer_set[8]" val="3" label="3" />
                <q-radio v-model="answer_set[8]" val="4" label="4" />
                <q-radio v-model="answer_set[8]" val="5" label="5" />
                <q-radio v-model="answer_set[8]" val="6" label="6" />
                <q-radio v-model="answer_set[8]" val="7" label="7" />
                <q-radio v-model="answer_set[8]" val="8" label="8" />
                <q-radio v-model="answer_set[8]" val="9" label="9" />
                <q-radio v-model="answer_set[8]" val="10" label="10" />
              </div>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[9] }}</h3>
            <div class="news__text">
              <q-radio v-model="answer_set[9]" val="Так" label="Так" /><br>
              <q-radio v-model="answer_set[9]" val="Ні" label="Ні" /><br>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[10] }}</h3>
            <div class="news__text">
              <div class="q-gutter-sm">
                <q-checkbox v-model="answer_set[10]" val="Бізнес" label="Бізнес" color="teal" /><br>
                <q-checkbox v-model="answer_set[10]" val="Чиновники" label="Чиновники" color="orange" /><br>
                <q-checkbox v-model="answer_set[10]" val="Вразливі верстви населення" label="Вразливі верстви населення" color="red" /><br>
                <q-checkbox v-model="answer_set[10]" val="ЗМІ" label="ЗМІ" color="cyan" /><br>
                <q-checkbox v-model="answer_set[10]" val="Співробітники правоохоронних органів і судді" label="Співробітники правоохоронних органів і судді" color="teal" /><br>
                <q-checkbox v-model="answer_set[10]" val="Громадські активісти" label="Громадські активісти" color="orange" /><br>
                <q-checkbox v-model="answer_set[10]" val="Військовослужбовці" label="Військовослужбовці" color="red" /><br>
                <q-checkbox v-model="answer_set[10]" val="Митці та культурні діячі" label="Митці та культурні діячі" color="cyan" /><br>
                <q-checkbox v-model="answer_set[10]" val="Пенсіонери" label="Пенсіонери" color="teal" /><br>
                <q-checkbox v-model="answer_set[10]" val="Бюджетники" label="Бюджетники" color="orange" />
              </div>
            </div>
          </div>
          <div class="news__block" >
            <h3 class="news__title">{{ question_set[11] }}</h3>
            <div class="news__text">
              <input class="login__input" type="text" v-model="answer_set[11]" name="question_13" >
            </div>
          </div>
          <div class="news__block" >
            <button class="button button--small-font button--small button--white" @click="submitQuiz()">Закінчити опитування</button>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { mapGetters } from 'vuex'
import * as _ from 'lodash'

export default {
  name: 'Quiz',
  data () {
    return {
      question_set: [
        '1. Яким має бути ідеальний керівник держави?',
        '2. Інтереси яких груп населення держава має захищати в першу чергу? Позначте будь-яку кількість.',
        '3. Що для вас є найважливішим пріоритетом?',
        '4. А наскільки взагалі важливо враховувати інтереси абсолютно всіх груп населення під час прийняття рішень? 1 - Не важливо, 10 - Треба враховувати інтереси кожної групи',
        '5. Уявімо, що країну чомусь охоплюють протести проти вашої влади. Що робити?',
        '6. А чи взагалі варто обговорювати державні рішення з різними групами? 1 - Можна без цього, лідеру краще знати, 10 - Завжди і з усіма',
        '7. Вітаємо, ви президент! І раптом ваш найближчий соратник попався на хабарі. Що будете робити? Тільки чесно!',
        '8. Припустимо, ви опинилися на Марсі серед перших колоністів. Яку роль візьмете на себе?',
        '9. А наскільки важливо для громадян знати свої права та обов’язки? 1 - Це не надто важливо. Влада все забезпечить, 10 - Це найважливіше',
        '10. Чи можна порушити закон, якщо так буде краще для держави?',
        '11. З якою з цих груп ви б ніколи не стали працювати разом?',
        '12. І наостанок порадьте нам: у чому лежить ключ до успіху країни?'
      ],
      answer_set: ['', [], [], '', '', '', '', '', '', '', [], '']
    }
  },
  components: {
  },
  methods: {
    submitQuiz () {
      var quiz = _.zipObject(this.question_set, this.answer_set)
      console.log(quiz)
      this.$store.dispatch('setQuizResults', quiz)
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentGame',
      'getLaws'
    ])
  }
}
</script>
