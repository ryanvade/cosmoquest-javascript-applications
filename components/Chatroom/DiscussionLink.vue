<template lang="html">
  <div class="discussion-link">
    <button type="button" class="link" @click="showCopy = !showCopy">
      <i class="fa fa-share" aria-hidden="true"></i>
      <strong>Share</strong>
    </button>
    <div class="discussion-link-menu" v-if="showCopy">
      <div class="share-span">
        Share
        <span class="">
          <button type="button" class="share-close" name="button" @click="showCopy = !showCopy">
            <i aria-hidden="true" class="fa fa-times"></i>
          </button>
        </span>
      </div>
      <div class="social-share-box">
        <button type="button" name="button" @click="shareOnFacebook" class="facebook-share">
          <i class="fa fa-2x fa-facebook-official" aria-hidden="true"></i>
        </button>
        <button type="button" name="button" @click="shareOnTwitter" class="twitter-share">
          <i class="fa fa-2x fa-twitter" aria-hidden="true"></i>
        </button>
        <button type="button" name="button" @click="shareOnGPlus" class="google-share">
          <i class="fa fa-2x fa-google-plus" aria-hidden="true"></i>
        </button>
      </div>
      <hr>
      <div class="url-span">
        <input type="text" :id="urlID" :value="url" readonly="readonly" class="share-url">
      </div>
      <hr>
      <div class="copy-span">
        <button type="button" name="button" class="copy-button" @click="copyToClipboard">
          <strong>Copy</strong>
        </button>
        <!-- <img src = "share_button.png" id = "share_button"> -->
      </div>
    </div>
  </div>
</template>

<script>
import SocialShareProvider from '../../providers/SocialShareProvider';
import ClipboardManager from '../../mixins/ClipboardManager';
export default {
  /**
   * Props - Array of input values
   * @type {Array}
   */
  props: ['discussion'],
  /**
   * Data - Components used values
   * @return {Dictionary}
   */
  data() {
    return {
      url: null,
      showCopy: false,
      shareProvider: new SocialShareProvider(),
      clipboard: new ClipboardManager()
    }
  },
  /**
   * Mounted - Runs after the components 'mounted' lifecycle event
   * @return {[type]} [description]
   */
  mounted() {
    this.url = window.location.origin + window.location.pathname + window.location.search;
  },
  methods: {
    /**
     * Share on Facebook - Opens a 'Share on Facebook' window
     * @return {void}
     */
    shareOnFacebook() {
      this.shareProvider.shareUrlOnFacebook(this.url);
    },
    /**
     * Share on Twitter - Opens a 'Share on Twitter' window
     * @return {void}
     */
    shareOnTwitter() {
      this.shareProvider.shareUrlOnTwitter(this.url, this.discussion.title);
    },
    /**
     * Share on GPlus - Opens a 'Share on Google+' window
     * @return {void}
     */
    shareOnGPlus() {
      this.shareProvider.shareUrlOnGooglePlus(this.url);
    },
    /**
     * Copy To Clipboard - Copies the Link URL to the clipboard
     * @return {void}
     */
    copyToClipboard() {
      this.clipboard.setElement(this.urlID).copy();
    }
  },
  computed: {
    /**
     * URL Id - Returns the Share Link URL Box Element ID
     * @return {String}
     */
    urlID() {
      if(!this.discussion) {
        return "";
      }
      return "url:discussion:" + this.discussion.id;
    }
  }
}
</script>

<style lang="css">
</style>
