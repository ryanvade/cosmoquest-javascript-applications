<template lang="html">
        <modal v-show="" @close="">
            <h3 slot="header" v-if="!spam">New Discussion</h3>

            <span slot="body" v-if="!spam">
                <form class="form" action="/chatroom/discussion" method="POST" id="new-discussion-form">
                    <div class="form-group">
                        <label for="" style="color: #999999;">Title <div class="required">*</div></label>
                        <input class="form-control" type="text" name="title" value="" required v-model="title">
                    </div>
                    <div class="form-group">
                        <label for="" style="color: #999999">Category <div class="required">*</div></label>
                        <select class="form-control" name="" required v-model="category" >
                            <option value=""></option>
                            <option v-for="category in categories" v-if="category.name != 'all'" :value="category.name">{{ category.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="" style="color: #999999;">Body <div class="required">*</div></label>
                        <editor selector="newdiscussioneditor" textvalue="" formname="body" v-on:change="updateBody"></editor>
                    </div>
                </form>
            </span>
            <div slot="footer" v-if="!spam">
                <button type="button" name="cancel" class="discussion-control-btn" v-on:click="closeForm">Cancel</button>
                <button type="button" name="submit" class="discussion-control-btn" v-on:click="submitForm">Submit</button>
            </div>

            <h3 slot="header" v-if="spam">Report incorrect spam detection.</h3>
            <span slot="body" v-if="spam">
              <span>
                <span>Would you like to report an incorrect spam detection?</span>
                <div class="form-group">
                  <label for="" style="color: #111;">Reason</label>
                  <textarea name="name" rows="8" style="width: 100%;" v-model="reason"></textarea>
                </div>
              </span>
            </span>
            <div slot="footer" v-if="spam">
              <button type="button" name="cancel-relpy" class="discussion-control-btn" v-on:click="closeForm">Cancel</button>
              <button type="button" name="submit-reply" class="discussion-control-btn" v-on:click="submitSpam">Submit</button>
            </div>
        </modal>
</template>

<script>
import modal from '../Util/Modal.vue';
import editor from '../Util/Editor.vue';
import ReportProvider from '../../providers/ReportProvider';
import DiscussionProvider from '../../providers/DiscussionProvider';

export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['categories', 'filter'],
  /**
   * Components - list of other used components
   * @type {Object}
   */
  components: {
    modal,
    editor
  },
  /**
   * Data - returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      title: "",
      category: "",
      body: "",
      emptyTitle: false,
      emptyCategory: false,
      emptyBody: false,
      loading: false,
      spam: false,
      spamId: false,
      reason: '',
      reportProvider: new ReportProvider(),
      discussionProvider: new DiscussionProvider()
    };
  },
  watch: {
    /**
     * Filter - Watches the current category filter and changes the form
     * @return {void}
     */
    filter() {
      if (this.filter) {
        this.category = this.filter.name;
      } else {
        this.category = "";
      }
    }
  },
  computed: {
    /**
     * Filter Name - Calculates the current category filter name
     * @return {void}
     */
    filterName() {
      if (this.filter == null) {
        return '';
      } else {
        return this.filter.name
      }
    },
  },
  methods: {
    /**
     * Select - Returns whether a filter is selected
     * @param  {String} name category filter name
     * @return {String}
     */
    select(name) {
      if (name == this.filterName) {
        return 'selected';
      } else {
        return;
      }
    },
    /**
     * Update Body - Store the form body for submitting to the server
     * @param  {String} body new discussion body
     * @return {void}
     */
    updateBody(body) {
      this.body = body;
    },
    /**
     * Close Form - Triggers the New Discussion Form Close
     * @return {void}
     */
    closeForm() {
      this.spam = false;
      this.spamId = false;
      this.$emit('close');
    },
    /**
     * Submit Spam - Submits a request for the discussion not to be considered spam
     * @return {void}
     */
    submitSpam() {
      let reason = 'spam';
      let description = this.reason;
      let type = 'discussion';
      let id = this.spamId;
      this.reportProvider.createReport(type, id, reason, description).then((response) => {
        flash('Report Sent', 'success');
        this.closeForm();
      }).catch((error) => {
        this.closeForm();
      });
    },
    /**
     * Valid Form - Returns whether the current form is valid
     * @return {Boolean}
     */
    validForm() {
      this.emptyTitle = (this.title == "") ? true : false;
      this.emptyCategory = (this.category == "") ? true : false;
      this.emptyBody = (this.body == "") ? true : false;
      return !this.emptyTitle && !this.emptyCategory && !this.emptyBody;
    },
    /**
     * Submit Form - Sends the New Discussion to the server
     * @return {void}
     */
    submitForm() {
      if (this.validForm()) {
        this.discussionProvider.createDiscussion(this.category, this.title, this.body).then((response) => {
          console.log(response);
          if (response.data.status == "success") {
            flash("Discussion Created Successfully", "success");
            let host = window.location.host;
            let url = response.data.url;
            window.location = `https://${host}${url}`;
          } else {
            flash(response.statusText, 'error');
          }
        }).catch((error) => {
          if (error.message.includes('spam')) {
            flash('Your Discussion contains spam.', 'error');
            this.spam = true;
            this.spamId = error.data.discussion.id;
          } else {
            flash("Unable to create the discussion.", 'error');
          }
        });
      } else {
        flash("Please fill out all fields", 'warning');
      }
    }
  }
}
</script>

<style lang="css">
</style>
