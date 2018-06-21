<template lang="html">
    <div class="">
        <div class="" v-if="!loading">
            <div v-if="discussion.category.parent == null" class="discussion-category-name">
                / <span>{{ categoryName }}</span>
            </div>
            <div v-if="discussion.category.parent != null" class="discussion-category-name">
                / <span>{{ discussion.category.parent.name }}</span> / <span>{{ discussion.category.name }}</span>
            </div>
            <div class="discussion-navigation-buttons">
                <a href="/chatroom" class="discussion-back-all">Back to all discussions</a>
                <a :href="categoryUrl" class="discussion-back-category">More from this category</a>
            </div>

            <div class="row">
                <newitem :arr="newReplies" type="Reply" :specific="this.discussion.title"></newitem>
                <div class="col-md-1 col-sm-2 col-xs-2">
                    <img :src="avatar" alt="user-avatar" class="img-circle discussion-avatar">
                </div>
                <div class="col-md-11 col-sm-10 col-xs-10">
                    <h3 class="discussion-title">{{ this.discussion.title }}</h3>
                    <div class="discussion_center_details">
                        Posted by <a :href="profileUrl">{{ this.discussion.user.name }}</a> {{ createdAt }}
                    </div>
                    <div v-if="!editing">
                        <div class="row discussion_center_body" v-html="this.discussion.body" ></div>
                    </div>
                    <div v-if="!editing">
                            <div class="discussion-social-buttons">
                                <favorable :showbutton="user != null" type="discussion" :id="discussion.id" :favorites="discussion.favorites" v-on:favorited="handleFavorited"></favorable>
                                <button type="button" name="reply" class="discussion-control-btn" v-show="user" style="margin-left: 10px;" v-on:click="toggleReplying">Reply</button>
                                <quote :selector="quoteSelector" :text="this.discussion.body" :id="this.discussion.id" v-show="user" v-on:newreply="newQuote"></quote>
                                <followable v-if="canFollow" type="discussion" :id="this.discussion.id" v-show="user"></followable>
                                <discussionLink :discussion="discussion"></discussionLink>

                            </div>
                            <div class="discussion-moderation-buttons" >
                                <reportable type="discussion" :id="this.discussion.id"></reportable>
                                <button type="button" name="delete" v-show="canModerate" class="discussion-control-btn" v-on:click="askDelete = true">Delete</button>
                                <button type="button" name="edit" v-show="canModerate" class="discussion-control-btn" v-on:click="toggleEditing">Edit</button>
                            </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-11 col-md-offset-1" v-show="editing">
                    <editor selector="discussioneditor" :textvalue="this.discussion.body" formname="disussion-body" enabled="true" v-on:change="saveDiscussionEdit" v-if="editing"></editor>
                    <button type="button" name="cancel-editing" v-on:click="toggleEditing" class="discussion-control-btn">Cancel</button>
                    <button type="button" name="submit-editing" v-on:click="submitEdit" class="discussion-control-btn">Submit</button>
                </div>
            </div>

            <ReplyList v-if="!hideReplies" :replies="discussion.replies_paginator.data" :paginator="discussion.replies_paginator" :discussion="discussion" v-on:newreply="newQuote" @changed="update"></ReplyList>

            <modal v-show="replying && !isSpam" @close="replying = false">
                <h3 slot="header">New Reply</h3>
                <editor slot="body" selector="replyeditor" textvalue="" formname="reply-body" v-on:change="saveNewReply"></editor>
                <div slot="footer">
                  <button type="button" name="cancel-relpy" class="discussion-control-btn" v-on:click="toggleReplying()">Cancel</button>
                  <button type="button" name="submit-reply" class="discussion-control-btn" v-on:click="submitNewReply()">Submit</button>
                </div>
            </modal>

            <modal v-show="replying && isSpam" @close="replying = false">
              <h3 slot="header">Report incorrect spam detection.</h3>
              <div class="" slot="body">
                <span>Would you like to report an incorrect spam detection?</span>
                <div class="form-group">
                  <label for="" style="color: #111;">Reason</label>
                  <textarea name="name" rows="8" style="width: 100%;" v-model="reason"></textarea>
                </div>
              </div>
              <div slot="footer">
                <button type="button" name="cancel-relpy" class="discussion-control-btn" v-on:click="toggleReplying()">Cancel</button>
                <button type="button" name="submit-reply" class="discussion-control-btn" v-on:click="submitSpam()">Submit</button>
              </div>
            </modal>

            <modal v-show="askDelete" @close="askDelete = false">
                <h3 slot="header">Delete Discussion</h3>
                <span slot="body">Are you sure you wish to delete this discussion? <br>*Note: This action cannot be undone.</span>
                <div slot="footer">
                    <button type="button" name="cancel-relpy" class="discussion-control-btn" v-on:click="askDelete = false">Cancel</button>
                    <button type="button" name="submit-reply" class="discussion-control-btn" v-on:click="deleteDiscussion()" style="color: red;">Delete</button>
                </div>
            </modal>

            <div class="" style="text-align: center;" v-show="!user">
                <button type="button" class="discussion-control-btn" style="margin-right: 0px;" data-toggle="modal" data-target="#loginModal" id="login">
                    Login
                </button>  to reply.
            </div>
        </div>
        <div class="" v-if="loading">
            Loading...
        </div>
    </div>
</template>

<script>
import ReplyList from './ReplyList.vue';
import editor from '../Util/Editor.vue';
import modal from '../Util/Modal.vue';
import reportable from './Reportable.vue';
import newitem from './NewItem.vue';
import quote from './Quote.vue';
import followable from './Followable.vue';
import DiscussionProvider from '../../providers/DiscussionProvider';
import ReplyProvider from '../../providers/ReplyProvider';
import ReportProvider from '../../providers/ReportProvider';
import ModerationProvider from '../../providers/ModerationProvider';
import SocketConnectionProvider from '../../providers/SocketConnectionProvider';
import discussionLink from './DiscussionLink.vue';

export default {
  /**
   * Components - Other used components
   * @type {Object}
   */
  components: {
    ReplyList,
    editor,
    modal,
    reportable,
    newitem,
    quote,
    followable,
    discussionLink,
  },
  /**
   * Data - returns the components values
   * @return {Dictionary}
   */
  data() {
    return {
      discussion: false,
      loading: true,
      editing: false,
      user: window.user,
      replying: false,
      newReplyValue: '',
      discussionEdit: '',
      askDelete: false,
      newReplies: [],
      isSpam: false,
      reason: '',
      page: 1,
      hideReplies: false,
      regex: new RegExp('page=\d*'),
      discussionProvider: new DiscussionProvider(),
      replyProvider: new ReplyProvider(),
      reportProvider: new ReportProvider(),
      moderationProvider: new ModerationProvider(),
      socketProvider: new SocketConnectionProvider()
    };
  },
  /**
   * Created - Runs after the components 'created' lifecycle event
   * @return {void}
   */
  created() {
    let origin = window.location.origin;
    let slug = window.location.href.replace(`${origin}/chatroom/discussion/`, '');
    slug = slug.replace(window.location.search, '');
    if (this.regex.test(window.location.search)) {
      this.page = this.getParams()["page"];
    }

    this.discussionProvider.getDiscussion(slug, this.page).then((response) => {
      this.discussion = response.data;
      this.loading = false;
    }).catch((error) => {
      console.error(error);
    });

    this.socketProvider.newReplyChannel().listen('ReplyCreated', this.handleNewReplyEvent);
  },
  methods: {
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
    },
    /**
     * Reply Exists - Determines if the given reply is already on the page
     * @param  {Reply} reply  reply to check for
     * @return {Boolean}       whether the reply is on the page
     */
    replyExists(reply) {
      let found = false;
      this.discussion.replies_paginator.data.forEach((elem) => {
        if (elem.id == reply.id) {
          found = true;
        }
      });
      return found;
    },
    /**
     * New Quote - Creates a new Quote of the discussion body
     * @param  {String} body quote body content
     * @return {void}
     */
    newQuote(body) {
      this.replyProvider.createQuote(this.discussion.id, body).then((response) => {
        if (this.discussion.replies_count > this.discussion.replies_paginator.per_page) {
          console.log("Move to next Page");
        }
        this.discussion = response.data;
        flash('Reply created', 'success');
      }).catch((error) => {
        flash('Unable to reply', 'error');
      });
    },
    /**
     * Toggle Editing - Shows/Hides the Discussion Editor
     * @return {void}
     */
    toggleEditing() {
      if (this.editing) {
        $('#discussioneditor').remove();
      }
      this.editing = !this.editing;
    },
    /**
     * Save New Reply - Stores the content of the new reply form
     * @param  {String} value body content of the new reply
     * @return {void}
     */
    saveNewReply(value) {
      this.newReplyValue = value;
    },
    /**
     * Save Discussion Edit - Stors the content of the discussion edit form
     * @param  {String} value body content of the discussion edit
     * @return {void}
     */
    saveDiscussionEdit(value) {
      this.discussionEdit = value;
    },
    /**
     * Submit New Reply - Creates a new Reply to the discussion
     * @return {void}
     */
    submitNewReply() {
      if (this.isSpam) {
        return this.submitSpam();
      }
      if (!this.newReplyValue || this.newReplyValue == "") {
        flash('A Reply cannot be empty', 'error');
      } else {
        this.replyProvider.createReply(this.discussion.id, this.newReplyValue).then((response) => {
          this.discussion = response.data;
          this.toggleReplying();
          this.newReplyValue = null;
          $('#replyeditor').val('');
          flash('Reply created', 'success');
        }).catch((error) => {
          console.error(error);
          if (error.response.data.includes('spam')) {
            flash('Your reply contains spam.', 'error');
            this.discussion.replies_paginator.data.push(jqxhr.responseJSON.reply);
            this.isSpam = true;
          } else {
            flash(`Unable to reply`, 'error');
            this.toggleReplying();
          }
        });
      }
    },
    /**
     * Submit Spam - Submits a report that the Discusion is not spam
     * @return {void}
     */
    submitSpam() {
      let reason = 'spam';
      let description = this.reason;
      let type = 'reply';
      let id = this.discussion.replies_paginator.data[this.discussion.replies_paginator.data.length - 1].id;
      console.log(id);
      this.reportProvider.createReport(type, id, reason, description).then((response) => {
        flash('Report sent', 'success');
        this.toggleReplying();
      }).catch((error) => {
        this.toggleReplying();
      });
    },
    /**
     * Submit Edit - Sends an edit of the current discussion
     * @return {void}
     */
    submitEdit() {
      if (!this.discussionEdit || this.discussionEdit == "") {
        flash('A discussion cannot be emtpy', 'error');
      } else {
        this.discussionProvider.editDiscussion(this.discussion.id, this.discussionEdit).then((response) => {
          this.discussion = response.data;
          this.toggleEditing();
          flash('Discussion edited', 'success');
        }).catch((error) => {
          console.error(error);
          flash(`Unable to edit the discussion`, 'error');
          this.toggleEditing();
        });
      }
    },
    /**
     * Toggle Replying - Shows/Hides the reply creation form
     * @return {void}
     */
    toggleReplying() {
      if (this.replying) {
        // $('#replyeditor').remove();
        window.tinymce.activeEditor.setContent('');
      }
      this.replying = !this.replying;
      this.isSpam = false;
    },
    /**
     * Delete Discussion - Submits a request to delete the discussion
     * @return {void}
     */
    deleteDiscussion() {
      this.discussionProvider.deleteDiscussion(this.discussion.id).then((response) => {
        flash('Discussion Deleted', 'success');
        setTimeout(() => {
          window.location = "/chatroom";
        }, 3000);
      }).catch((error) => {
        flash(`Unable to delete the discussion`, 'error');
        this.askDelete = false;
      });
    },
    /**
     * Handle New Reply Event - Handles when a new reply is created by another user
     * @param  {SocketeIoEvent} event event to handle
     * @return {void}
     */
    handleNewReplyEvent(event) {
      let reply = event.reply;
      let discussion = event.discussion;
      let found = this.discussion.replies_paginator.data.find((rep) => {
        return rep.id == reply.id;
      });

      if (found == undefined) {
        if (this.discussion.replies_paginator.data.length < this.discussion.replies_paginator.per_page) {
          this.discussion.replies_paginator.data.push(reply);
        } else {
          this.discussionProvider.getDiscussion(this.discussion.slug).then((response) => {
            this.discussion = response.data;
          });
        }
      }
    },
    /**
     * Update - Gets the current page's replies for displaying
     * @param  {Number} page current pagination page number
     * @return {void}
     */
    update(page) {
      this.hideReplies = true;
      this.page = page;
      this.discussionProvider.getDiscussion(this.discussion.slug, this.page).then((response) => {
        this.discussion.replies_count = 0;
        this.discussion.replies_paginator = null;
        this.discussion.replies_count = response.data.replies_count;
        this.discussion.replies_paginator = response.data.replies_paginator;
        this.hideReplies = false;
      }).catch((error) => {
        console.error(error);
      });
    },
    /**
     * Handle Favorited - Adds or Removes a users favorite from the current discussion
     * @param  {Boolean} favorited whether the current user has favorited the item
     * @return {void}
     */
    handleFavorited(favorited) {
      if(!favorited && this.discussion.favorites.length > 0 && this.user) {
        let id = this.user.id;
        this.discussion.favorites = this.discussion.favorites.filter((item) => {
          return item.user_id != id;
        });
      }else if(favorited && this.user) {
        this.discussion.favorites.push({
          created_at: new Date(),
          updated_at: new Date(),
          favorable_type: 'discussion',
          user_id: this.user.id
        });
      }
    }
  },
  computed: {
    /**
     * Can Follow - Determines if the current user can follow the discussion
     * @return {Boolean} whether the current user can follow
     */
    canFollow() {
      return window.user && this.discussion.user_id != window.user.id;
    },
    /**
     * Can Moderate - Determines if the current user is a moderator
     * @return {Boolean} whether the current user can moderate
     */
    canModerate() {
      return this.moderationProvider.canModerate(window.user, this.discussion);
    },
    /**
     * Quote Selector - Calculates the discussion quote editor element id
     * @return {String}
     */
    quoteSelector() {
      return `discussion-${this.discussion.id}-quote-editor`;
    },
    /**
     * Created At - Formats the current discussions created at
     * @return {String} Formated DateTime String
     */
    createdAt() {
      if (this.discussion) {
        return moment(this.discussion.created_at).format('L');
      }
    },
    /**
     * Avatar - Returns the discussion creator's avatar url
     * @return {String} Avatar Path
     */
    avatar() {
      if (this.discussion.user.gravatar_url == "") {
        return "/images/profiles/profile_default.png"
      } else {
        return this.discussion.user.gravatar_url
      }
    },
    /**
     * Discussion Element Id - Calculates the discussion's HTML Element ID
     * @return {String}
     */
    discussionElementId() {
      if (this.discussion) {
        return `discussion-${this.discussion.id}`;
      }
    },
    /**
     * Replies - Gets the current discussions replies
     * @return {Object}
     */
    replies() {
      if (this.discussion) {
        return this.discussion.replies_paginator;
      }
    },
    /**
     * Favorites - Gets the curernt discussions favorites by users
     * @return {Array}
     */
    favorites() {
      return this.discussion.favorites;
    },
    /**
     * Category Name - Returns the discussions owning category name
     * @return {String}
     */
    categoryName() {
      return this.discussion.category.name;
    },
    /**
     * Category Slug - Returns the discussions owning category slug
     * @return {String}
     */
    categorySlug() {
      return this.discussion.category.slug;
    },
    /**
     * Category URL - Returns the url of the discussions owning category
     * @return {String}
     */
    categoryUrl() {
      return `/chatroom?category=${this.categorySlug}`;
    },
    /**
     * Profile URL - Returns the Discussions creators user profile url
     * @return {String}
     */
    profileUrl() {
      return `/user/${this.discussion.user.name}`;
    },
  },
}
</script>

<style lang="css">
</style>
