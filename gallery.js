// gallery.js
// Created by Ryan Owens
// 04/09/2018

// Pull in the global JS setup
require('./bootstrap');

// Pull in VueJS and Moment JS
window.Vue = require('vue');
window.moment = require('moment');

if ((document.all && !window.atob) == true) {
  document.getElementById('gallery').innerHTML = `
  <div class="IE9">
    It appears you are using an older version of Internet Explorer.
    Things have changed a lot, and in order to use this page we need you to update to a newer browser.
    </div>`;
} else {
  /**
   * App - The Gallery App
   * @type {Vue}
   */
  const app = new Vue({
    /**
     * El - The HTML Element Selector to attach the App too
     * @type {String}
     */
    el: '#gallery',
    /**
     * Data - The Apps variables
     * @type {Object}
     */
    data: {},
    /**
     * Components - Other Vue components used by the App
     * @type {Object}
     */
    components: {
      'gallery': require('./components/Gallery/Gallery.vue'),
    },
  });
}
