<template>
<ul class="pagination">
  <li v-show="prevUrl">
    <a href="#" aria-label="Previous" rel="prev" @click.prevent="update(false)" class="chatroom-paginator">
                <span aria-hidden="true" class="chatroom-paginator">Previous</span>
            </a>
  </li>
  <li v-show="nextUrl">
    <a href="#" aria-label="Next" rel="next" @click.prevent="update(true)" class="chatroom-paginator">
                <span aria-hidden="true" class="chatroom-paginator">Next</span>
            </a>
  </li>
</ul>
</template>

<script>
export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['dataset'],
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      page: 1,
      prevUrl: false,
      nextUrl: false
    }
  },
  /**
   * Mounted - Runs after the components 'mounted' lifecycle event
   * @return {void}
   */
  mounted() {
    if (this.dataset) {
      this.page = this.dataset.current_page;
      this.prevUrl = this.dataset.prev_page_url;
      this.nextUrl = this.dataset.next_page_url;
    }
  },
  watch: {
    /**
     * Dataset - Watches for changes to the input dataset and modifies internal variables
     * @return {void}
     */
    dataset() {
      this.page = this.dataset.current_page;
      this.prevUrl = this.dataset.prev_page_url;
      this.nextUrl = this.dataset.next_page_url;
    },
  },

  computed: {
    /**
     * Should Paginate - Determines whether to display pagination links
     * @return {Boolean}
     */
    shouldPaginate() {
      return !!this.prevUrl || !!this.nextUrl;
    }
  },

  methods: {
    /**
     * Update - Changes the current page index and broadcasts a change
     * @param  {Boolean} next whether to move to the next page
     * @return {void}
     */
    update(next) {
      if (next) {
        this.page++;
      } else {
        this.page--;
      }
      this.broadcast().updateUrl();
    },
    /**
     * Broadcast - Alert parent components of pagination change
     * @return {VueComponent} reference to this component
     */
    broadcast() {
      return this.$emit('changed', this.page);
    },
    /**
     * Update URL - Changes the Browser URL to reflect the new page
     * @return {void}
     */
    updateUrl() {
      history.pushState(null, null, '?page=' + this.page);
    }
  }
}
</script>
