<template lang="html">
  <div class="category-children-list-container">
    <li class="category-children-list">
      <ul v-for="SmallCat in children" class="category-child-ul">
        <Category :name="SmallCat.name" :hex="SmallCat.color" :slug="SmallCat.slug" v-on:filterByCategory="handleFilterEvent(SmallCat)"></Category>
      </ul>
    </li>
  </div>
</template>

<script>
import Category from './Category.vue';

export default {
  /**
   * Props - Array of input values
   * @type {Array}
   */
  props: ['category'],
  /**
   * Components - Other used components
   * @type {Object}
   */
  components: {
    Category
  },
  /**
   * Data - stores the components values
   * @return {Dictionary}
   */
  data() {
    return {
      children: []
    };
  },
  /**
   * Mounted - called after the 'mounted' component lifecycle event
   * @return {void}
   */
  mounted() {
    this.children = this.category.children;
  },
  methods: {
    /**
     * Handle Filter Event - Passes along a category filter event
     * @param  {Array} cat  category name and slug
     * @return {void}
     */
    handleFilterEvent(cat) {
      this.$emit('filterByCategory', cat);
    }
  }
}
</script>

<style lang="css">
</style>
