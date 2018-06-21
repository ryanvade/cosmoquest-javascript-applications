<template>
<div class="">
  <div class="discussion-list">
    <newitem :arr="newDiscussions" type="Discussion" :specific="specific"></newitem>
    <h1>
          {{ currentFilter }}
        </h1>
    <ul class="discussions">
      <discussionbrief v-for="disc in discussions" v-if="!disc.spam" :key="disc.id" :discussion="disc"></discussionbrief>
    </ul>
    <paginator :dataset="dataSet" @changed="update"></paginator>
  </div>
  <div class="text-center">
  </div>
</div>
</template>

<script>
import discussionbrief from './DiscussionBrief.vue';
import DiscussionProvider from '../../providers/DiscussionProvider';
import SocketConnectionProvider from '../../providers/SocketConnectionProvider';
import newitem from './NewItem.vue';

export default {
  /**
   * Props - Array of input values
   * @type {Array}
   */
  props: ['filter'],
  /**
   * Components - List of used components
   * @type {Object}
   */
  components: {
    discussionbrief,
    newitem,
  },
  /**
   * Data - Components used values
   * @return {Dictionary}
   */
  data() {
    return {
      page: 1,
      discussions: [],
      dataSet: null,
      newDiscussions: [],
      discussionProvider: new DiscussionProvider(),
      socketProvider: new SocketConnectionProvider()
    };
  },
  computed: {
    /**
     * Specific - Returns the name of the category currently being used to filter
     * @return {String}
     */
    specific() {
      if (this.filter) {
        return this.filter.name;
      } else {
        return 'all';
      }
    },
    /**
     * Current Filter - Gets a nice name for the current category filter
     * @return {String}
     */
    currentFilter() {
      if (this.filter == null || this.filter.name == "all") {
        return `All Discussions`;
      } else {
        return `Discussions in ${this.filter.name}`;
      }
    }
  },
  /**
   * Created - Runs after the components 'Created' lifecycle hook
   * @return {void}
   */
  mounted() {
    // GET the categories
    this.getCurrentPageNumber();
    this.update(this.page);
    this.socketProvider.newDiscussionChannel().listen('newdiscussion', (data) => {
      if (!this.filter || this.filter.name == 'all' || this.filter.name == data.discussion.category.name) {
        this.newDiscussions.push(data.discussion);
      }
    });
  },
  watch: {
    /**
     * Filter - Watches for when the category filter changes
     * @param  {Any} value  new value for the filter
     * @return {void}
     */
    filter(value) {
      this.getCurrentPageNumber();
      this.update(this.page);
    },
  },
  methods: {
    /**
     * Update - Retrieves the current pagination pages discussions
     * @param  {Number} page current page number
     * @return {void}
     */
    update(page) {
      let filter = (this.filter && this.filter.name != "all")? this.filter.slug: null;
      this.discussionProvider.getDiscussions(filter, page).then((response) => {
        this.dataSet = response.data;
        this.discussions = response.data.data;
      }).catch((error) => {
        console.error(error);
        flash("Unable to load Discussions", "error");
      });
    },
    /**
     * Apply Filter - Filters through data and returns only values with a category_id of value.id
     * @param  {Object} value Category to filter for
     * @param  {Array} data   Array to filter through
     * @return {Array}       Array of filtered items
     */
    applyFilter(value, data) {
      if (value != null && value.name != 'all' && data != null) {
        return data.filter((el) => {
          return el.category_id == value.id;
        });
      } else {
        return data;
      }
    },
    /**
     * Get Current Page Number - Sets the current pagination page number
     * @return {void}
     */
    getCurrentPageNumber() {
      let params = this.getParams();
      if(params.hasOwnProperty("page")) {
        this.page = params["page"];
      }else {
        this.page = 1;
      }
    },
    /**
     * Get Params - Filters through the windows URL query search paramaters
     * @return {Dictionary}
     */
    getParams() {
      let query = window.location.search;
      return (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
        let [key, value] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
      }, {});
    }
  },
}
</script>
