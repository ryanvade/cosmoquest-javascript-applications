// detectivessearch.js
// By Ryan Owens

// Pull in the global JS setup
require('./bootstrap');

// Pull in VueJS and Moment JS
window.Vue = require('vue');
window.moment = require('moment');

// Pull in the Overall Detectives Search Component
import detectivessearch from './components/DetectivesSearch/DetectivesSearch.vue';

// Declare the Vue.js app
const detectivesSearch = new window.Vue({
  /**
   * El - The HTML element to display the App in
   * @type {String}
   */
  el: '#detectivesSearch',
  /**
   * Components - Internally Used Vue.js Components
   * @type {Object}
   */
  components: {
    detectivessearch
  }
});
