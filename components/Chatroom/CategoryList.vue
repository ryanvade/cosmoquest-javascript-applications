<template>
<div class="">
  <div class="" v-if="user">
    <button class="btn new-discussion-btn" @click="toggleNewDiscussionForm">
            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
            NEW DISCUSSION
        </button>
  </div>
  <span v-if="user && isIE">Sorry, Internet Explorer is not supported.</span>
  <div class="category-list">
    <h4>Categories</h4>
    <ul class="nav nav-pills nav-stacked">
      <li v-for="(BigCat, index) in categories">
        <Category :children="BigCat.children" :name="BigCat.name" :hex="BigCat.color" :slug="BigCat.slug" v-on:filterByCategory="handleFilterEvent(BigCat)"></Category>
        <CategoryChildrenList :category="BigCat" v-on:filterByCategory="handleFilterEvent"></CategoryChildrenList>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import Category from './Category.vue';
import CategoryChildrenList from './CategoryChildrenList.vue';

export default {
  /**
   * Props - Array of input values
   * @type {Array}
   */
  props: ['categories'],
  /**
   * Components - Other used components
   * @type {Object}
   */
  components: {
    Category,
    CategoryChildrenList
  },
  /**
   * Data - returns the componnents used values
   * @return {Dicitionary}
   */
  data() {
    return {
      url: "/api/categories",
      user: window.user,
    };
  },
  methods: {
    /**
     * Handle Filter Event - passes along a category filter event
     * @param  {Array} cat  Category name and slug
     * @return {void}
     */
    handleFilterEvent(cat) {
      this.$emit('root-filter-by-category', cat);
    },
    /**
     * Toggle New Discussion Form - Triggers the new discussion form
     * @return {void}
     */
    toggleNewDiscussionForm() {
      this.$emit('buttonclick');
    }
  },
}
</script>
