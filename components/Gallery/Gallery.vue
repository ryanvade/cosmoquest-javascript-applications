<template lang="html">
  <div class="">
    <div class="" v-if="loading" style="height: 100vh; padding-top: 25vh;">
      <div class="spinner">
              <div class="bounce1"></div>
              <div class="bounce2"></div>
              <div class="bounce3"></div>
            </div>
    </div>
    <div class="tool-info-note" v-if="smallScreen" >
        <span>You need to use a larger screen for the CosmoQuest Gallery.</span>
    </div>
    <div :class="galleryClass" v-if="!loading && !smallScreen">
      <div class="gallery-top-bar">
        <span style="font-size: 16px; color: #999999; margin-top: 10px; width: 90%;">CosmoQuest Image Gallery</span>
        <div class="gallery-box-controls">
          <img class="gallery-fullscreen-button" title="Toggle Fullscreen" @click="toggleFullscreen" src="/images/detectives/fullscreen-button.png">
          <img class="gallery-close-button" title="Close Gallery" :src="closeButton" v-on:mouseover="closeButton = closeButtonRed" v-on:mouseout="closeButton = closeButtonGray">
        </div>
      </div>
      <gallerycarousel :hide="filters.hideImages"
                       :filters="filters"
                       @displaydetails="getAndDisplayDetails"
                       @rotate="() => {displayDetails = false;showMarks = false; showEmbed = false;}"
                       @loading="handleCarouselLoading"
                       :showMarks="showMarks"
                       >
     </gallerycarousel>

 <div class="gallery-control-panel-wrapper">
     <div class="gallery-control-panel">
         <div class="gallery-description-header">
             <button class="gallery-button" v-if="displayDetails" @click="() => {displayDetails = false;showMarks = false; showEmbed = false;}">Go back</button>
             <div class="image-fav-counter" v-if="displayDetails">
                 <favorable type="image"
                 :id="image.id"
                 :showbutton="user"
                 :favorites="image.favorites"
                 :favorites_count="image.favorites_count"
                 v-on:favorited="toggleImageFavorite"
                 >
             </favorable>
             <!-- <button class="image-embed-button" @click="showEmbed = !showEmbed">
               <i class="fa fa-share" aria-hidden="true"></i><strong> Share</strong>
             </button> -->
             <ShareImageLink :image="image" title="CosmoQuest Image Gallery"></ShareImageLink>
         </div>
     </div>

     <div class="gallery-description-pane" v-if="displayDetails">
         <div class="col-1">
             <p><strong>Title:</strong><span>{{ image.name }}</span></p>
             <p><strong>Application:</strong><span>{{ imageApp }}</span></p>
             <p><strong>Completion Status:</strong><span>{{ completionStatus }}</span></p>
             <p>
               <button class="gallery-button" @click="getAndDisplayImageUsers">
                 <strong v-if="!showUsers">Show image users</strong>
                 <strong v-if="showUsers">Hide image users</strong>
               </button>
             </p>
             <p>
               <button class="gallery-button"
               @click="showMarks = !showMarks"
               :disabled="image.marks.length < 1"
               :title="showMarksButtonTitle">
               <strong v-if="!showMarks">Show image marks</strong>
               <strong v-if="showMarks">Hide image marks</strong>
             </button>
           </p>
         </div>
         <div class="col-2">
           <!-- <div class="gallery-share-box" v-if="showEmbed">
             <div class="box-level">
               <strong>Share</strong>
               <button type="button" name="closeEmbed" @click="showEmbed = false" class="embed-close-button">
                 <i class="fa fa-times" aria-hidden="true"></i>
               </button>
             </div>
             <input type="text" class="image-embed-code" :value="embedCode" id="embedCode" readonly></input>
             <button class="image-embed-copy-button" title="Copy to clipboard" @click="copyToClipboard">
               Copy
             </button>
           </div> -->


             <div class="image-description" v-if="!showUsers">
                 <p class="gallery-image-description" v-html="imageDetails"></p>
             </div>
             <div class="image-description" v-if="showUsers">
               <strong v-if="image.users.length < 1">No users have completed this image.</strong>
               <div class="gallery-image-users" v-if="image.users.length > 0">
                 <strong>Users who have completed this image.</strong>
                 <ul class="gallery-image-user-ul">
                   <li v-for="user in image.users" class="gallery-image-user-li">
                     <a :href="profileUrl(user)">{{ user }}</a></li>
                 </ul>
               </div>
             </div>
         </div>
     </div>


     <div class="gallery-header" v-if="!displayDetails">
         <span style="font-size: 20px;">Click on the center image for details</span>
     </div>
     <span class="title" v-if="!displayDetails">Filters</span>
     <div class="gallery-filters" v-if="!displayDetails">
         <div class="filter-group-labels">
             <span class="filter-name">Projects</span>
             <span class="filter-name">Other</span>
         </div>

         <div class="filter-groups">
             <div class="filter-row">
                 <div class="filter-switch">
                     <input id="cq-toggle-1" :disabled="disabled" class="cq-toggle toggle-round" :value="filters.apps['vesta_mappers']" type="checkbox" v-model="filters.selected_apps" v-on:change="checkFilters">
                     <label for="cq-toggle-1"></label>
                     <span>Vesta Mappers</span>
                 </div>
                 <div class="filter-switch">
                     <input id="cq-toggle-2" :disabled="disabled" class="cq-toggle toggle-round" :value="filters.apps['moon_mappers']" type="checkbox" v-model="filters.selected_apps" v-on:change="checkFilters">
                     <label for="cq-toggle-2"></label>
                     <span>Moon Mappers</span>
                 </div>
                 <div class="filter-switch">
                     <input id="cq-toggle-3" :disabled="disabled" class="cq-toggle toggle-round" :value="filters.apps['mercury_mappers']" type="checkbox" v-model="filters.selected_apps" v-on:change="checkFilters">
                     <label for="cq-toggle-3"></label>
                     <span>Mercury Mappers</span>
                 </div>
             </div>

             <div class="filter-row">
                 <div class="filter-switch">
                     <input id="cq-toggle-5" :disabled="disabled" class="cq-toggle toggle-round"  :value="filters.apps['mars_mappers']" type="checkbox" v-model="filters.selected_apps" v-on:change="checkFilters">
                     <label for="cq-toggle-5"></label>
                     <span>Mars Mappers</span>
                 </div>
                 <div class="filter-switch">
                     <input id="cq-toggle-6" :disabled="disabled" class="cq-toggle toggle-round" :value="filters.apps['image_detectives']" type="checkbox" v-model="filters.selected_apps" v-on:change="checkFilters">
                     <label for="cq-toggle-6"></label>
                     <span>Image Detective</span>
                 </div>
                 <div class="filter-switch">
                     <input id="all-projects" :disabled="disabled" class="cq-toggle toggle-round" type="checkbox" v-model="filters.all_apps" v-on:change="checkFilters">
                     <label for="all-projects"></label>
                     <span>All Projects</span>
                 </div>

             </div>

             <div class="filter-row" style="margin-top: 20px;">
                 <div class="filter-switch">
                     <input id="cq-toggle-8" :disabled="disabled" class="cq-toggle toggle-round" type="checkbox" :value="1" v-model="filters.finished" v-on:change="checkFilters">
                     <label for="cq-toggle-8"></label>
                     <span>Completed</span>
                 </div>
         </div>
     </div>
     <div class="order-groups">
         <div class="order-by">
             <label>Order By</label>
             <select v-model="filters.orderBy" v-on:change="checkFilters" :disabled="disabled">
                 <option value="Everyone">All</option>
                 <option value="Mine" v-if="user">My completed images</option>
                 <option value="Most_Favorited">Most Favorited</option>
                 <option value="Least_Favorited">Least Favorited</option>
             </select>
         </div>
         <div class="order-by">
             <label>Date</label>
             <select v-model="filters.date" v-on:change="checkFilters" :disabled="disabled">
                 <option value="Recent">Recent</option>
                 <option value="Oldest">Oldest</option>
                 <!-- <option value="Most Favorite">Most Favorite</option> -->
             </select>
         </div>
     </div>
 </div>
</div>
 </div>
</div>
  </div>
</template>

<script>
import ImageDetailsParser from '../../mixins/ImageDetailsParser';
import AppProvider from '../../providers/AppProvider';
import ImageProvider from '../../providers/ImageProvider';
import gallerycarousel from './GalleryCarousel.vue';
import favorable from '../Util/Favorable.vue';
import GalleryFilters from '../../mixins/GalleryFilters';
import ClipboardManager from '../../mixins/ClipboardManager';
import ShareImageLink from '../Util/ShareImageLink';

export default {
  /**
   * Components - Other imported Vue components
   * @type {Object}
   */
  components: {
    gallerycarousel,
    favorable,
    ShareImageLink
  },
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      closeButtonGray: "/images/detectives/x-button-gray.png",
      closeButtonRed: "/images/detectives/x-button-red.png",
      closeButton: "/images/detectives/x-button-gray.png",
      displayDetails: false,
      ip: null,
      image: {},
      loading: true,
      disabled: true,
      fullscreen: false,
      galleryClass: "gallery-box",
      showEmbed: false,
      showMarks: false,
      showUsers: false,
      user: window.user,
      showDetailsImmediately: false,
      filters: new GalleryFilters(),
      appProvider: new AppProvider(),
      imageProvider: new ImageProvider(),
      clipboard: new ClipboardManager()
    };
  },
  /**
   * Created - Runs when the 'created' lifecycle event is triggered
   * @return {void}
   */
  created() {
    let self = this;
    this.appProvider.getGalleryApps().then((response) => {
      self.filters.apps = response.data;
      let keys = Object.keys(response.data);
      keys.forEach((key) => {
        self.filters.selected_apps.push(response.data[key]);
      });
      if (window.image) {
        this.image = window.image;
        this.filters.selected_apps = [window.application.id];
        this.filters.all_apps = false;
        this.showDetailsImmediately = true;
      }
      this.filters.orderBy = "Everyone"
      this.filters.date = "Recent";
      this.filters.recent = "1";
      this.filters.oldest = false;
      if (self.filters.selected_apps != null) {
        if (window.location.pathname === "/gallery")
          $(document.body).animate({
            backgroundColor: 'rgba(0,0,0,.5)'
          }, 2000);
        setTimeout(() => {
          self.loading = false;
        }, 2000);
      }
    }).catch((error) => {
      console.error(error);
      flash("Unable to load the gallery", "error");
    });
  },
  computed: {
    /**
     * Show Marks Button Title - Calculates the 'Show Mark Button' title
     * @return {String}
     */
    showMarksButtonTitle() {
      if (!this.image || !this.image.marks || this.image.marks.length < 1) {
        return 'No marks to display';
      }
      return '';
    },
    /**
     * Small Screen - Determines if the user is using a small screen
     * @return {Boolean}
     */
    smallScreen() {
      return screen.width < 1000 && screen.height < 7000;
    },
    /**
     * Completion Status - Determines if the image has been completed
     * @return {String}
     */
    completionStatus() {
      return (this.image.done) ? "Completed" : "Not Completed";
    },
    /**
     * Image App - Determines the image's Application Name
     * @return {String}
     */
    imageApp() {
      for (var key in this.filters.apps) {
        if (this.filters.apps.hasOwnProperty(key)) {
          if (this.filters.apps[key] == this.image.application_id) {
            return key;
          }
        }
      }
      return '';
    },
    /**
     * Image Details - Calculates the Image Details String
     * @return {String}
     */
    imageDetails() {
      if (this.ip == null) {
        return "";
      }
      return this.ip.getDetailsString();
    }
  },
  methods: {
    /**
     * Profile URL - Calculates a users profile URL
     * @param  {String} user Username
     * @return {String}      Profile URL
     */
    profileUrl(user) {
      return `/user/${user}`;
    },
    /**
     * Get and Display Image Users - Retrieves and displays the users who have
     *                               completed an image
     * @return {void}
     */
    getAndDisplayImageUsers() {
      if (!this.showUsers) {
        let self = this;
        this.imageProvider.getUsersForImage(this.image.id).then((response) => {
          self.image.users = response.data;
          self.showUsers = !self.showUsers;
        }).catch((error) => {
          console.error(error);
          flash("Unable to get users for image", "error");
        });
      } else {
        this.showUsers = !this.showUsers;
      }
    },
    /**
     * Toggle Image Favorite - Changes the Favorited display
     * @param  {Boolean} favorited Whether the current user has favorited the image
     * @return {void}
     */
    toggleImageFavorite(favorited) {
      if (!favorited) {
        let user = this.user;
        this.image.favorites.splice(this.image.favorites.findIndex((el) => {
          return el.user_id == user.id;
        }), 1);
      } else {
        this.image.favorites.push({
          user_id: this.user.id
        });
      }
    },
    /**
     * Handle Carousel Loading - Runs when the Carousel enters or leaves loading
     * @param  {Boolean} loading Whether the carousel is loading
     * @return {void}
     */
    handleCarouselLoading(loading) {
      this.disabled = loading;
    },
    /**
     * Check Filters - Runs when the image filters change
     * @param  {Event} event User event triggering the change
     * @return {void}
     */
    checkFilters(event) {
      this.filters.check(event, this.user);
    },
    /**
     * Get App ID For Name - Determines the ID of an app
     * @param  {String} name        Apps Name
     * @return {String | Number}    ID of the Application
     */
    getAppIdForName(name) {
      if (this.filters.apps.hasOwnProperty(name)) {
        return this.filters.apps[name];
      }
      return '';
    },
    /**
     * Get and Display Details - Runs the Details Parser
     * @param  {Object} image Which image to get details for
     * @return {void}
     */
    getAndDisplayDetails(image) {
      this.displayDetails = !this.displayDetails;
      this.showUsers = false;
      this.showMarks = false;
      this.showEmbed = false;
      this.image = image;
      this.ip = new ImageDetailsParser(this.image);
    },
    /**
     * Toggle FullScreen - Changes the display state of the Gallery
     * @return {void}
     */
    toggleFullscreen() {
      this.loading = true;
      this.showUsers = false;
      if (this.fullscreen) {
        this.galleryClass = "gallery-box";
      } else {
        this.galleryClass = "gallery-box gallery-box-full";
      }
      this.fullscreen = !this.fullscreen;
      setTimeout(() => {
        this.loading = false;
      }, 200);
    }
  },
}
</script>

<style lang="css">

</style>
