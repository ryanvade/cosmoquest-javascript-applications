<template lang="html">
    <div class="">
        <div class="gallery-carousel" style="">
            <div class="carousel-container" v-if="!loading">

                <div class="gallery-controls">
                    <button type="button" name="left" @click="rotateLeft" :disabled="!this.images.length"><img src="images/detectives/left-arrow.png"></button>
                    <button type="button" name="right" @click="rotateRight" :disabled="!this.images.length"><img src="images/detectives/right-arrow.png"></button>
                </div>

                <div class="no-results" v-if="!images.length || hide">
                    No results.
                </div>

                <transition-group :name="transition" tag="div" style="height: 100%;">
                    <galleryimage :key="image0" :src="image0" name="image0" clss="image-container image-rear-left" imgclss="gallery-image" v-if="images.length && !hide"></galleryimage>
                    <galleryimage :key="image1" :src="image1" name="image1" clss="image-container image-center-left" imgclss="gallery-image" v-if="images.length && !hide"></galleryimage>
                    <galleryimage :showMarks="showMarks"
                                  :key="image2"
                                  :src="image2"
                                  name="image2"
                                  clss="image-container image-center"
                                  imgclss="gallery-image"
                                  @imgclick="displayImageDetails"
                                  v-if="images.length && !hide"
                                  :marks="this.center.marks"
                                  >
                    </galleryimage>
                    <galleryimage :key="image3" :src="image3" name="image3" clss="image-container image-center-right" imgclss="gallery-image" v-if="images.length && !hide"></galleryimage>
                    <galleryimage :key="image4" :src="image4" name="image4" clss="image-container image-rear-right" imgclss="gallery-image" v-if="images.length && !hide"></galleryimage>
                </transition-group>
            </div>
            <!-- <div class="gallery-header" v-if="images.length && !loading">
                <span>Click on the center image for details</span>
            </div> -->
            <div class="" v-if="loading">
                <div class="spinner" style="margin: 10px auto 0; padding-top: 200px;">
                    <div class="bounce1" style="background-color: white;"></div>
                    <div class="bounce2" style="background-color: white;"></div>
                    <div class="bounce3" style="background-color: white;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import galleryimage from './GalleryImage.vue';
import ImageProvider from '../../providers/ImageProvider'

export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['filters', 'hide', 'showMarks'],
  /**
   * Components - Other imported Vue components
   * @type {Object}
   */
  components: {
    galleryimage
  },
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      loading: true,
      images: [],
      center: {},
      page: 1,
      position: 0,
      totalPages: 1,
      perPage: 50,
      lastRotate: 0,
      direction: 0,
      ignoreFirstLoad: false,
      imageProvider: new ImageProvider()
    };
  },
  /**
   * Created - Runs when the 'created' lifecycle event is triggered
   * @return {void}
   */
  created() {
    if (!this.showMarks) {
      if (window.images) {
        this.ignoreFirstLoad = true;
        this.images = window.images;
        this.ignoreFirstLoad = true;
        this.totalPages = window.total_pages;
        this.ignoreFirstLoad = false;
        this.loading = false;
        this.$emit('loading', false);
      } else {
        console.log("Get Images in Created");
        this.getImages(true);
      }
    }
  },
  watch: {
    /**
     * Query - Runs when the 'Query' computed property changes
     * @return {void}
     */
    query() {
      if (!this.ignoreFirstLoad) {
        this.getImages(false);
      }
      this.position = 0;
    }
  },
  computed: {
    /**
     * Transition - Determines which CSS transition to apply
     * @return {String}
     */
    transition() {
      if (this.direction == 0)
        return 'fade';
      if (this.direction < 0)
        return 'out-left';
      if (this.direction > 0)
        return 'out-right';
    },
    /**
     * My Filters - Returns the current filters
     * @return {Object}
     */
    myFilters() {
      return this.filters;
    },
    /**
     * Query - Calculates the current image set query
     * @return {String}
     */
    query() {
      let page = this.page;
      let query = `?page=${page}&`;
      query = query + this.filters.queryString();
      query = query.slice(0, -1);
      return query;
    },
    /**
     * Determines the 'Rear Left' Image
     * @return {Object}
     */
    image0() {
      if (this.images.length < 5) return '';
      return this.images.slice(-2)[0].file_location.replace("http://", "https://");
    },
    /**
     * Determines the 'Center Left' Image
     * @return {Object}
     */
    image1() {
      if (this.images.length < 5) return '';
      return this.images.slice(-1)[0].file_location.replace("http://", "https://");
    },
    /**
     * Determines the 'Center' Image
     * @return {Object}
     */
    image2() {
      if (this.images.length == 0) return '';
      this.center = this.images[0];
      return this.images[0].file_location.replace("http://", "https://");
    },
    /**
     * Determines the 'Center Right' Image
     * @return {Object}
     */
    image3() {
      if (this.images.length < 2) return '';
      return this.images[1].file_location.replace("http://", "https://");
    },
    /**
     * Determines the 'Rear Right' Image
     * @return {Object}
     */
    image4() {
      if (this.images.length < 3) return '';
      return this.images[2].file_location.replace("http://", "https://");
    },
  },
  methods: {
    /**
     * Rotate Left - Shifts the Images array to 'rotate' the images
     * @return {void}
     */
    rotateLeft() {
      // should we rotate in the first place?
      if (this.images.length == 1) return;
      // Does pagination need to occur?
      this.direction = -1;
      if (Date.now() - this.lastRotate > 800) {
        this.lastRotate = Date.now();
        if (this.position == 0 && this.totalPages > 1) {
          this.page = (this.page == 1) ? this.totalPages : this.page -= 1;
          this.getImagesForRotation(true);
        } else {
          this.position = (this.position == 0) ? this.images.length - 1 : this.position - 1;
        }
        this.images.push(this.images.shift());
        this.$emit('rotate');
      }
    },
    /**
     * Rotate Right - Shifts the Images array to 'rotate' the images
     * @return {void}
     */
    rotateRight() {
      // should we rotate in the first place?
      if (this.images.length == 1) return;
      this.direction = 1;
      if (Date.now() - this.lastRotate > 800) {
        this.lastRotate = Date.now();
        // Does pagination need to occur?
        if (this.position + 1 == this.perPage && this.totalPages > 1) {
          this.page = (this.page == this.totalPages) ? 1 : this.page += 1;
          this.getImagesForRotation(false);
        } else {
          this.position = (this.position + 1 == this.images.length) ? 0 : this.position + 1;
        }
        this.images.unshift(this.images.pop());
        this.$emit('rotate');
      }
    },
    /**
     * Display Image Details - Emits the display details event
     * @return {void}
     */
    displayImageDetails() {
      this.$emit('displaydetails', this.center);
    },
    /**
     * Get Images For Rotation - Retrieves images after a 'rotation'
     * @param  {Boolean} left Whether the rotation was to the left
     * @return {void}
     */
    getImagesForRotation(left) {
      this.loading = true;
      this.$emit('loading', true);
      let query = this.query;
      let self = this;
      this.imageProvider.getGalleryImagesWithQuery(query).then((response) => {
        if (left) {
          // Prepend arrays
          let images = response.data.data.push.apply(response.data.data, self.images);
          self.images = images;
          // set the total number of pages
          self.totalPages = Math.round(self.images.length / response.data.per_page);
          // update the current position in the array
          self.position = response.data.data.length;
        } else {
          // append the arrays
          self.images.push.apply(self.images, response.data.data);
          // set the total number of pages
          self.totalPages = Math.round(self.images.length / response.data.per_page);
          // update the current position in the array
          self.position += 1;
        }
        self.loading = false;
        self.$emit('loading', false);
      }).catch((error) => {
        console.error(error);
        flash("Unable to load images", "error");
      });
    },
    /**
     * Get Images - Retrieves images and possibly rotates them
     * @param  {Boolean} rotate Whether to rotate the image set
     * @return {void}
     */
    getImages(rotate) {
      this.loading = true;
      this.$emit('loading', true);
      let query = this.query;
      let self = this;
      this.imageProvider.getGalleryImagesWithQuery(query).then((response) => {
        self.images = response.data.data;
        self.totalPages = Math.round(response.data.total / response.data.per_page);
        self.perPage = response.data.per_page;
        if (rotate) {
          for (var i = 0; i < self.images.length / 2; i++) {
            self.images.unshift(self.images.pop());
            self.position += 1;
          }
        }
        if (this.page > this.totalPages && this.totalPages > 0) {
          this.page = 1;
          this.position = 0;
          this.getImages(false);
        }
        self.loading = false;
        self.$emit('loading', false);
      }).catch((error) => {
        console.error(error);
        flash("Unable to load images", "error");
      });
    },
  },
}
</script>

<style lang="css">
</style>
