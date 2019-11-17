import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import VueCharts from 'vue-chartjs'
import axios from 'axios';

Vue.config.productionTip = false
window.axios = axios;

Vue.component('line-chart', {
  extends: VueCharts.Line,
  mixins: [VueCharts.mixins.reactiveProp],
  props: ['chartData'],
  mounted() {
    let options = { responsive: true};
    this.renderChart(this.chartData, options)
  },
  
})
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
