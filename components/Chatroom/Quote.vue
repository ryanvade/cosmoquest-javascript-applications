<template lang="html">
  <div class="quote" style="display:inline;">
      <button type="button" name="quote" class="discussion-control-btn" v-on:click="toggleQuoting()"><i class="fa fa-quote-left" aria-hidden="true"></i>Quote</button>
      <modal v-show="quoting" @close="quoting = false">
          <h3 slot="header">New Reply</h3>
          <div class="" slot="body">
              <span>Quoting...</span>
              <blockquote v-html="text"></blockquote>
              <editor :selector="selector" textvalue="" formname="reply-body" v-on:change="saveNewReply"></editor>
          </div>
          <div slot="footer">
              <button type="button" name="cancel-relpy" class="discussion-control-btn" v-on:click="toggleQuoting()">Cancel</button>
              <button type="button" name="submit-reply" class="discussion-control-btn" v-on:click="submitNewReply()">Submit</button>
          </div>
      </modal>
  </div>
</template>

<script>
import modal from '../Util/Modal.vue';
import editor from '../Util/Editor.vue';
export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['text', 'id', 'selector'],
  /**
   * Components - List of other used components
   * @type {Object}
   */
  components: {
    modal,
    editor
  },
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      quoting: false,
      newReply: '',
    };
  },
  methods: {
    /**
     * Toggle Quoting - Shows/Hides the Quote form
     * @return {void}
     */
    toggleQuoting() {
      if (this.quoting) {
        window.tinymce.activeEditor.setContent('');
      }
      this.quoting = !this.quoting;
    },
    /**
     * Submit New Reply - Sends the new Quote to the server
     * @return {void}
     */
    submitNewReply() {
      if (!this.newReply || this.newReply == "") {
        flash('A Reply cannot be empty', 'error');
      } else {
        this.$emit('newreply', `<blockquote>${this.text}</blockquote>${this.newReply}`);
        this.toggleQuoting();
      }
    },
    /**
     * Save New Reply - Saves the form body for sending to the server
     * @param  {String} reply new reply body content
     * @return {void}
     */
    saveNewReply(reply) {
      this.newReply = reply;
    }
  },
}
</script>

<style lang="css">
</style>
