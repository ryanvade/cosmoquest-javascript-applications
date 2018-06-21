// Chatroom.js
// Created by Ryan Owens
// 03/06/2018

// Pull in the global JS setup
require('./bootstrap');

// Pull in VueJS and Moment JS
window.Vue = require('vue');
window.moment = require('moment');

// Glogal Components
Vue.component('paginator', require('./components/Chatroom/Paginator.vue'));
Vue.component('tinymce', require('./components/Util/Editor.vue'));
Vue.component('favorable', require('./components/Util/Favorable.vue'));

// Import the Category Provider for the App
import CategoryProvider from './providers/CategoryProvider';

/**
 * App - The Chatroom App
 * @type {Vue}
 */
const app = new Vue({
  /**
   * El - The HTML Element Selector to attach the App too
   * @type {String}
   */
  el: '#chatroom',
  /**
   * Data - The Apps variables
   * @type {Object}
   */
  data: {
    description: null,
    pageEditor: null,
    showNewDiscussionForm: false,
    categories: [],
    filterCategory: null,
    discussion: null,
    categoryProvider: new CategoryProvider()
  },
  /**
   * Components - Other Vue components used by the App
   * @type {Object}
   */
  components: {
    'category-list': require('./components/Chatroom/CategoryList.vue'),
    'discussion-list': require('./components/Chatroom/DiscussionList.vue'),
    'new-discussion-form': require('./components/Chatroom/NewDiscussionForm.vue'),
    'discussion': require('./components/Chatroom/Discussion.vue'),
  },
  watch: {
    /**
     * Categories - Updates the filter when categories change
     * @return {void}
     */
    categories() {
      if (window.location.search != "") {
        this.handleQueryString(window.location.search);
      }
    },
  },
  /**
   * Created - Runs when the Apps 'created' lifecycle event is triggered
   * @return {[type]} [description]
   */
  created() {
    this.fetchCategories();
  },
  methods: {
    /**
     * Toggle New Discussion Form - Shows/Hides the Show New Discussion Form
     * @return {void}
     */
    toggleNewDiscussionForm() {
      this.showNewDiscussionForm = !this.showNewDiscussionForm;
    },
    /**
     * Fetch Categories - Gets the Chatroom Categories
     * @return {void}
     */
    fetchCategories() {
      this.categoryProvider.getCategories().then((response) => {
        let cats = response.data;
        cats.unshift({
          name: "all",
          slug: "all",
          id: 0,
          children: []
        });
        this.categories = cats;
      }).catch((error) => {
        console.error(error);
        flash('Unable to load categories', 'error');
      });
    },
    /**
     * Handle Filter Event - Changes the window URL when the filter changes
     * @param  {Object} cat New Category filter
     * @return {void}
     */
    handleFilterEvent(cat) {
      this.filterCategory = (cat == "all") ? '' : cat;
      // this.fetchDiscussion();
      if (cat == "all" || cat.name == "all") {
        window.history.pushState({}, "", '/chatroom');
      } else {
        window.history.pushState({}, "", `/chatroom?category=${cat.slug}`);
      }
    },
    /**
     * Handle Query String - Gets the current filter category and triggers the event
     * @param  {String} str query string
     * @return {void}
     */
    handleQueryString(str) {
      let catSlug = this.parseQuery('category', str);
      if (catSlug != null) {
        let category = this.categories.find((cat) => {
          return cat.slug == catSlug;
        });
        if (category) {
          this.handleFilterEvent(category);
        }
      }
    },
    /**
     * Parse Query - Gets a particular paramater from the window query string
     * @param  {String} name paramater to look for
     * @param  {String} str  string to search through
     * @return {String | null}      value of the paramater if it exists
     */
    parseQuery(name, str) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(str);
      if (results == null) {
        return null;
      } else {
        return decodeURI(results[1]) || 0;
      }
    },
  },
});
