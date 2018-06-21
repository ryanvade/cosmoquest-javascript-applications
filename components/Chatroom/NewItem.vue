<template lang="html">
    <a v-if="shouldDisplay" :href="url" class="load-new-items-outer">
        <span class="load-new-items" style="">
            {{ this.arr.length }} New {{ displayedType }} Click to load
        </span>
    </a>
</template>

<script>
export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['arr', 'type', 'specific'],
  computed: {
    /**
     * Should Display - Determines if the 'New Item' link should be displayed
     * @return {Boolean}
     */
    shouldDisplay() {
      return !!this.arr.length;
    },
    /**
     * Displayed Type - Calculates the new items type name
     * @return {String}
     */
    displayedType() {
      if (this.arr.length == 1) {
        return this.type;
      } else {
        if (this.type == 'Discussion') {
          return 'Discussions';
        } else if (this.type == "Reply") {
          return 'Replies';
        } else {
          return '';
        }
      }
    },
    /**
     * URL - Calculates the URL to the new item
     * @return {String}
     */
    url() {
      if (this.type == "Discussion") {
        let base = `${window.location.origin}/chatroom`;
        if (this.specific != 'all') {
          base = `${base}?category=${this.specific}`;
        }
        return base;
      } else if (this.type == 'Reply') {
        return `${window.location.origin}/chatroom/discussion/${this.specific}`;
      } else {
        return `${window.location.origin}`;
      }
    }
  }
}
</script>

<style lang="css">
</style>
