<template lang="html">
    <div class="discussion-reply" style="margin-bottom: 20px;" v-show="!isDeleted" :id="replyAnchor">
        <div class="row">
            <div class="col-md-1 col-sm-2 col-xs-2">
                <img :src="replyAvatar" alt="" class="img-circle discussion-avatar">
            </div>
            <div class="col-md-11 col-sm-10 col-xs-10" style="margin-top: 30px;">
                <a :href="profileUrl" class="discussion_center_name">
                    {{ replyCopy.user.name }}
                </a>
                <span class="discussion_center_details">
                    {{ replyCreatedAt }}
                </span>
                <div class="reply-body" :id="replyElementId" v-html="replyCopy.body" v-show="!editing"></div>
                <div class="" v-show="editing">
                    <editor :selector="selector" :textvalue="this.replyCopy.body" formname="reply-body" enabled="true" v-on:change="saveReplyEdit" v-if="editing"></editor>
                    <button type="button" name="cancel-editing" v-on:click="toggleEditing" class="discussion-control-btn">Cancel</button>
                    <button type="button" name="submit-editing" v-on:click="submitEdit" class="discussion-control-btn">Submit</button>
                </div>
                <div class="discussion-social-buttons" >
                  <div class="favorable-and-reply-link-container">
                      <favorable :showbutton="user != null" type="reply" :id="replyCopy.id" :favorites="replyCopy.favorites" v-on:favorited="handleFavorited"></favorable>
                      <quote v-if="!isIE" v-show="user && !isIE" :selector="quoteSelector" :text="this.reply.body" :id="this.reply.discussion_id" v-on:newreply="newQuote"></quote>
                      <replylink :reply="reply" :discussion="discussion"></replylink>
                    </div>
                </div>
                <div class="discussion-moderation-buttons" v-show="!editing" >
                    <reportable v-show="user" type="reply" :id="this.reply.id"></reportable>
                    <button v-show="user" type="button" name="delete" class="discussion-control-btn" v-if="canModerate() && !isIE" v-on:click="askDelete = true">Delete</button>
                    <button v-show="user" type="button" name="edit" class="discussion-control-btn" v-if="canModerate() && !isIE" v-on:click="editing = true">Edit</button>

                </div>
            </div>
        </div>


        <modal v-show="askDelete" @close="askDelete = false">
            <h3 slot="header">Delete Reply</h3>
            <span slot="body">Are you sure you wish to delete this reply? <br>*Note: This action cannot be undone.</span>
            <div slot="footer">
                <button type="button" name="cancel-relpy" class="discussion-control-btn" v-on:click="askDelete = false">Cancel</button>
                <button type="button" name="submit-reply" class="discussion-control-btn" v-on:click="deleteReply()" style="color: red;">Delete</button>
            </div>
        </modal>

        <div style="clear: both;"></div>
    </div>
</template>

<script>
import moment from 'moment';
import modal from '../Util/Modal.vue';
import editor from '../Util/Editor.vue';
import reportable from './Reportable.vue';
import quote from './Quote.vue';
import replylink from './ReplyLink.vue';
import ReplyProvider from '../../providers/ReplyProvider';
import ModerationProvider from '../../providers/ModerationProvider';

export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['reply', 'discussion'],
  /**
   * Components - List of other used components
   * @type {Object}
   */
  components: {
    modal,
    editor,
    reportable,
    quote,
    replylink
  },
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      user: window.user,
      askDelete: false,
      isDeleted: false,
      editing: false,
      replyEdit: '',
      replyCopy: null,
      isIE: /*@cc_on!@*/ false || !!document.documentMode,
      replyProvider: new ReplyProvider(),
      moderationProvider: new ModerationProvider()
    };
  },
  /**
   * Created - fires after the components 'created' lifecycle event
   * @return {void}
   */
  created() {
    this.replyCopy = this.reply;
  },
  /**
   * Mounted - Fires after the components 'mounted' lifecycle event
   * @return {void}
   */
  mounted() {
    let hash = window.location.hash;
    if (hash != "" && !!parseInt(hash.substr(1)) && parseInt(hash.substr(1)) == this.reply.id) {
      let container = document.getElementById(hash.substr(1));
      if (container) {
        console.log("Scroll into view");
        container.scrollIntoView();
        container.setAttribute("class", "discussion-reply selected");
        setTimeout(() => {
          container.setAttribute("class", "discussion-reply");
        }, 3000);
      }
    }
  },
  computed: {
    /**
     * Query Selector - Calculates the reply editor html id
     * @return {String}
     */
    quoteSelector() {
      return `reply-${this.reply.id}-quote-editor`;
    },
    /**
     * Reply Element Id - Calculates the replies html id
     * @return {String}
     */
    replyElementId() {
      if (this.replyCopy) {
        return `reply-${this.replyCopy.id}`;
      }
    },
    /**
     * Reply Avatar - Calculates the URL for the reply creator avatar
     * @return {String}
     */
    replyAvatar() {
      if (this.replyCopy && this.replyCopy.user) {
        return this.replyCopy.user.gravatar_url;
      }
    },
    /**
     * Reply Created At - Formats the replies created at date
     * @return {String}
     */
    replyCreatedAt() {
      if (this.replyCopy) {
        return moment.utc(this.replyCopy.created_at).fromNow();
      }
    },
    /**
     * Profile URL - Calculates the replies creators profile url
     * @return {String}
     */
    profileUrl() {
      if (this.replyCopy && this.replyCopy.user) {
        return `/user/${this.replyCopy.user.name}`;
      }
    },
    /**
     * Selector - Calcultes the JS Element reply editor selector
     * @return {string}
     */
    selector() {
      return `reply${this.replyCopy.id}editor`;
    },
    /**
     * Reply Anchor - Calculates the Replies Link Anchor
     * @return {String}
     */
    replyAnchor() {
      return this.reply.id;
    }
  },
  methods: {
    /**
     * New Quote - Passes along the 'New Quote' event
     * @param  {Object} data new quote
     * @return {void}
     */
    newQuote(data) {
      console.log('new quote in Reply');
      this.$emit('newreply', data);
    },
    /**
     * Can Moderate - Determines if the current user can moderate the reply
     * @return {Boolean}
     */
    canModerate() {
      return this.moderationProvider.canModerate(this.user, this.reply);
    },
    /**
     * Delete Reply - Submits a Reply Delete request
     * @return {void}
     */
    deleteReply() {
      this.replyProvider.deleteReply(this.replyCopy.id).then((response) => {
        flash('Reply Deleted', 'success');
        this.$emit('deleted', this.replyCopy.id);
        this.askDelete = false;
        this.isDeleted = true;
      }).catch((error) => {
        flash(`Unable to delete the reply`, 'error');
        console.error(error);
        this.askDelete = false;
      });
    },
    /**
     * Toggle Editing - Enables/Disables the reply editing form
     * @return {void}
     */
    toggleEditing() {
      if (this.editing) {
        $(`#${this.selector}`).remove();
      }
      this.editing = !this.editing;
    },
    /**
     * Save Reply Edit - Saves the content from the reply edit form
     * @param  {String} reply edit content
     * @return {void}
     */
    saveReplyEdit(reply) {
      this.replyCopyEdit = reply;
    },
    /**
     * Submit Edit - Sends the Edit request to the server
     * @return {void}
     */
    submitEdit() {
      if (!this.replyCopyEdit || this.replyCopyEdit == "") {
        flash('A reply cannot be emtpy', 'error');
      } else {
        this.replyProvider.editReply(this.replyCopy.id, this.replyCopyEdit).then((response) => {
          this.replyCopy = response.data;
          this.toggleEditing();
          flash('Reply edited', 'success');
        }).catch((error) => {
          flash(`Unable to edit the reply`, 'error');
          this.toggleEditing();
        });
      }
    },
    /**
     * Handle Favorited - Adds or Removes a users favorite from the current reply
     * @param  {Boolean} favorited whether the current user has favorited the item
     * @return {void}
     */
    handleFavorited(favorited) {
      if (!favorited && this.reply.favorites.length > 0 && this.user) {
        let id = this.user.id;
        this.reply.favorites = this.reply.favorites.filter((item) => {
          return item.user_id != id;
        });
      } else if (favorited && this.user) {
        this.reply.favorites.push({
          created_at: new Date(),
          updated_at: new Date(),
          favorable_type: 'discussion',
          user_id: this.user.id
        });
      }
    }
  },
}
</script>

<style lang="css">
.selected {
  border: solid #999999 0.5px;
}
</style>
