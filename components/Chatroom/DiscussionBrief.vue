<template>
<li>
  <div class="discussion-center">
    <a :href="url" class="discussion_list"><h3 class="discussion_center_title">{{ discussion.title}}</h3></a>
    <span class="discussion_center_details">
          Posted by <a :href="profileUrl">{{ this.discussion.user.name }}</a> {{ formatedDate }} in {{ discussion.category.name }}
        </span>
    <div class="discussion_center_body" style="width: 500px; overflow: hidden; text-overflow: ellipsis;" v-html="bodyBrief"></div>
    <div class="reply-count">
      <i class="fa fa-comment" aria-hidden="true" style="font-weight: bold;"></i> {{ discussion.replies_count }}
    </div>
  </div>
  <div style="clear: both;"></div>
  <br>
</li>
</template>

<script>
import moment from 'moment';
export default {
  /**
   * Props - Array of input values
   * @type {Array}
   */
  props: ['discussion'],
  computed: {
    /**
     * Profile URL - Returns the Discussions creators user profile url
     * @return {String}
     */
    profileUrl() {
      return `/user/${this.discussion.user.name}`;
    },
    /**
     * Url - Returns the discussions url
     * @return {String}
     */
    url() {
      return `/chatroom/discussion/${this.discussion.slug}`
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
     * Body Brief - Calculates a brief excerpt of the discussion body
     * @return {Sting}
     */
    bodyBrief() {
      let paragraph = `<p class="discussion_center_body" style="width: 500px; overflow: hidden; text-overflow: ellipsis;">`;
      let tempBody = this.discussion.body.replace("h1", "h4");
      tempBody = tempBody.replace("h2", "h4");
      tempBody = tempBody.replace("h3", "h4");
      tempBody = tempBody.replace("<p>", paragraph);
      tempBody = tempBody.replace("<iframe", "<iframe style='max-width: 75%; height: auto; display:block; margin-top: 10px;'");
      return tempBody
    },
    /**
     * Format Date - Returns the date in a 'Time From Now' format
     * @return {String}
     */
    formatedDate() {
      return moment.utc(this.discussion.created_at).fromNow()
    },
  },
}
</script>
