import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import '@/assets/css/stylesheet.css'
import TextField from '@/components/TextField'
import TextArea from '@/components/TextArea.vue'
import RangeSlider from '@/components/RangeSliderField.vue'
import SelectField from '@/components/SelectField.vue'
import FileField from '@/components/FileField.vue'
import TripBtn from './components/ButtonComponent.vue'
import CardComponent from './components/CardComponent.vue'
import DatePicker from './components/DatePicker.vue'
import TimePicker from './components/TimePicker.vue'
import VueLoad from './components/VueLoad.vue'
import CDialog from './components/ComfirmDialog.vue'
import GDialog from './components/GeneralDiolofg.vue'
// import FDialog from './views/Profile/components/FollowComponent.vue'
// import FRDialog from './views/Profile/components/FollowerComponent.vue'
// import store from './store'

Vue.config.productionTip = false

// Vue.component('FDialog', FDialog)
Vue.component('TripBtn', TripBtn)
Vue.component('DatePicker', DatePicker)
Vue.component('TimePicker', TimePicker)
Vue.component('TextField', TextField)
Vue.component('TextArea', TextArea)
Vue.component('RangeSliderField', RangeSlider)
Vue.component('SelectField', SelectField)
Vue.component('FileField', FileField)
Vue.component('CardComponent', CardComponent)
Vue.component('VueLoad', VueLoad)
Vue.component('CDialog', CDialog)
Vue.component('GDialog', GDialog)
// Vue.component('FRDialog', FRDialog)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
