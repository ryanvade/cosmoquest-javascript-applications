<template lang="html">
  <div class="favorable">
    <transition name="slide">
    <div class="favorable-tooltip-wrapper" v-if="showtooltip && showbutton">
      <span class="favorable-tooltip">Favorite the {{ type }}</span>
    </div>
    <div class="favorable-tooltip-wrapper" v-if="showtooltip && !showbutton">
      <span class="favorable-tooltip">{{type }} favorites</span>
    </div>
  </transition>
      <button type="button" name="button" @click="favorite" class="favorable-btn" v-if="showbutton" v-on:mouseover="displaytooltip">
          <span v-if="!favorited" style="font-weight: bold;"><i class="fa fa-star-o favorable-icon" aria-hidden="true" >&nbsp;</i>{{ favoritesCount }}</span>
          <span v-if="favorited" style="font-weight: bold;"><i class="fa fa-star favorable-icon" aria-hidden="true" >&nbsp;</i>{{ favoritesCount }}</span>
      </button>
      <span v-if="!showbutton" style="font-weight: bold;" class="favorable-btn"><i class="fa fa-star-o favorable-icon" aria-hidden="true" >&nbsp;</i>{{ favoritesCount }}</span>
  </div>
</template>

<script>
import FavoritesProvider from '../../providers/FavoritesProvider';
import SocketConnectionProvider from '../../providers/SocketConnectionProvider';
export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['type', 'id', 'favorites', 'showbutton', 'favorites_count'],
  /**
   * Data - Returns the components used values
   * @return {Dictionary}
   */
  data() {
    return {
      favorited: false,
      liveUpdate: false,
      showtooltip: false,
      favoritesProvider: new FavoritesProvider(),
      socketProvider: new SocketConnectionProvider()
    };
  },
  /**
   * Mounted - Runs after the components 'mounted' lifecycle event
   * @return {void}
   */
  mounted() {
    if (this.favorites) {
      this.favorited = this.checkIfFavorited();
      this.liveUpdate = true;
    } else if (this.favorites_count) {
      this.favorited = false; // TODO
    }
  },
  /**
   * Created - Runs after the components 'created' lifecycle event
   * @return {void}
   */
  created() {
    if (this.liveUpdate) {
      this.socketProvider.chatroomChannel().listen(`favorited:${this.type}:${this.id}`, (data) => {
        this.favorites = data.favorable.favorites;
        console.log(data);
        if (window.user) {
          let favorited = false;
          data.favorable.favorites.forEach((elem) => {
            if (elem.user_id == window.user.id) {
              favorited = true;
            }
          });
          this.favorited = favorited;
        }
      });
    }
  },
  computed: {
    /**
     * Favorites Count - Returns the number of users who have favorited the item
     * @return {Number}
     */
    favoritesCount() {
      if (this.favorites && !this.favorites_count) {
        return this.favorites.length;
      } else if (this.favorites_count) {
        return this.favorites_count;
      } else {
        return 0;
      }
    }
  },
  methods: {
    /**
     * Display Tool Tip - Toggles the favorable tooltip
     * @return {void}
     */
    displaytooltip() {
      this.showtooltip = true;
      let self = this;
      setTimeout(() => {
        self.showtooltip = false;
      }, 2000);
    },
    /**
     * Check if Favorited - Determines if the current user has favorited the item
     * @return {Boolean}
     */
    checkIfFavorited() {
      if (user == null) {
        return false;
      } else {
        let result = false;
        this.favorites.forEach((el) => {
          if (el.user_id == user.id)
            result = true;
        });
        return result;
      }
    },
    /**
     * Favorite - Allows the user to Favorite/Unfavorite the item
     * @return {void}
     */
    favorite() {
      this.favorited = !this.favorited;
      this.$emit('favorited', this.favorited);
      this.toggleFavorite();
    },
    /**
     * Toggle Favorite - Sends the Favorite/Unfavorite request to the server
     * @return {void}
     */
    toggleFavorite() {
      let resultCount = this.favoritesCount;
      let type = this.type;
      this.favoritesProvider.toggleItemFavorite(this.id, type).then((response) => {
        flash(`Favorited the ${type}`, 'success');
      }).catch((error) => {
        flash(`Unable to favorite ${type}`, 'error');
        console.log(error);
      });
    }
  },
}
</script>

<style lang="css">
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}

.slide-enter-active  {
  opacity: 1;
}

.slide-leave-active {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active { transition: opacity 300ms }
</style>
