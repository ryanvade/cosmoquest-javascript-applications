<template lang="html">
    <div class="" style="display:inline;" v-if="!loading">
        <button type="button" name="follow" class="discussion-control-btn" v-if="!followed" v-on:click="toggleFollow()">Follow</button>
        <button type="button" name="follow" class="discussion-control-btn" v-if="followed" v-on:click="toggleFollow()">Unfollow</button>
    </div>
</template>

<script>
import FollowsProvider from '../../providers/FollowsProvider';

export default {
  /**
   * Props - Array of input values
   * @type {Array}
   */
  props: ['type', 'id'],
  /**
   * Data - returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      followed: false,
      loading: true,
      followsProvider: new FollowsProvider()
    };
  },
  /**
   * Created - Runs after the components 'created' lifecycle event
   * @return {void}
   */
  created() {
    // Load data
    window.user.follows.forEach((elem) => {
      if (elem.user_id == window.user.id) {
        this.followed = true;
      }
    });
    this.loading = false;
  },
  methods: {
    /**
     * Toggle Follow - Sends the Follow/Unfollow request to the server
     * @return {void}
     */
    toggleFollow() {
      this.followsProvider.follow(this.id, this.type).then((response) => {
        this.followed = response.data.followed;
        if (this.followed) {
          flash("Follow submitted successfully", "success");
        } else {
          flash("Unfollow submitted successfully", "info");
        }
      }).catch((error) => {
        console.log(error);
        flash("Unable to follow the " + this.type, 'error');
      });
    }
  },
}
</script>

<style lang="css">
</style>
