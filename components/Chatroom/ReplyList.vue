<template lang="html">
    <div class="">
        <ul class="replies-list">
            <li v-for="reply in replies" v-if="!reply.spam">
                <Reply :reply="reply" :discussion="discussion" v-on:deleted="removeReply()" v-on:newreply="newQuote"></Reply>
            </li>
        </ul>
        <Paginator :dataset="paginator" @changed="update"></Paginator>
    </div>
</template>

<script>
import Reply from './Reply.vue';
import Paginator from './Paginator.vue';

export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['replies', 'paginator', 'discussion'],
  /**
   * Components - List of other used components
   * @type {Object}
   */
  components: {
    Reply,
    Paginator
  },
  methods: {
    /**
     * New Quote - Passes the 'New Reply' event
     * @param  {Object} data new reply
     * @return {void}
     */
    newQuote(data) {
      this.$emit('newreply', data);
    },
    /**
     * Remove Reply - Removes a reply from the reply list
     * @param  {Number} replyId id of the reply to remove
     * @return {void}
     */
    removeReply(replyId) {
      let index = this.replies.find((rep) => {
        return rep.id == replyId;
      });
      if (index) {
        this.replies.splice(index, 1);
      }

      let paginatorIndex = this.paginator.data.find((rep) => {
        return rep.id == replyId;
      });
      if (paginatorIndex) {
        this.paginator.data.splice(paginatorIndex, 1);
      }
    },
    /**
     * Update - Passes the Pagination change event
     * @param  {Number} page new page number
     * @return {void}
     */
    update(page) {
      this.$emit('changed', page);
    }
  },
}
</script>

<style lang="css">
</style>
