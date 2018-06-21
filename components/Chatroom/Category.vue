<template>
<a @click="triggerFilter()" class="category-link">
          <i v-if="hasChildren" :class="className" aria-hidden="true" :style="color"></i>
          {{name}}
        </a>
</template>

<script>
export default {
  /**
   * Props - Array of input values
   * @type {Array}
   */
  props: ['name', 'hex', 'slug', 'children'],
  computed: {
    /**
     * Returns the css classname of the fontawesome icon
     * @return {String}
     */
    className() {
      return "fa fa-square";
    },
    /**
     * Color - determines what the color of the fontawesome icon should be
     * @return {String}
     */
    color() {
      if (this.name == "all") {
        return `margin-right: 5px; color: black;`
      } else {
        return `margin-right: 5px; color: ${this.hex};`
      }
    },
    /**
     * Has Children - determines if this category has children categories
     * @return {Boolean}
     */
    hasChildren() {
      return this.children != undefined && this.children != null && this.children != [];
    }
  },
  methods: {
    /**
     * Trigger Filter - Emits an event to change the filtering category
     * @return {VueComponent} reference to the current component
     */
    triggerFilter() {
      this.$emit('filterByCategory', [this.name, this.slug]);
    },
  },
}
</script>
