<template lang="html">
  <div class="">
    <button class="show-thumbnails-button" @click="display = !display" v-show="!display"><i class="fa fa-angle-up fa-lg" aria-hidden="true"></i></button>
    <transition name="thumbnails">
    <div class="detectives-thumbnails" v-show="display">
        <button class="hide-thumbnails-button" @click="display = !display"><i class="fa fa-angle-down fa-lg" aria-hidden="true"></i></button>
        <div class="arrow left-arrow" v-if="showArrows" v-on:click="arrowClick">
          <i class="fa fa-angle-left" aria-hidden="true" alt="Left Arrow"></i>
        </div>
        <div class="thumbnail-row" v-if="showImages">
          <img v-for="image in images" v-if="images.length > 0" :src="image.file_location" :alt="image.name" v-on:click="thumbnailClick">
        </div>
        <div class="thumbnail-row" v-if="!showImages">
          <span class="no-images-span">No Images Found</span>
        </div>
        <div class="arrow right-arrow" v-if="showArrows" v-on:click="arrowClick">
          <i class="fa fa-angle-right" aria-hidden="true" alt="Right Arrow"></i>

        </div>
    </div>
  </transition>
  </div>
</template>

<script>
import DetectivesImage from '../../mixins/DetectivesImage.js';

export default {
  /**
   * Props - Input variables to the component
   * @type {Array}
   */
  props: ['images'],
  /**
   * Data - Components used values
   * @return {Dictionary}
   */
  data() {
    return {
      display: false,
    };
  },
  /**
   * Mounted - https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
   * @return {void}
   */
  mounted() {
    window.addEventListener('keydown', (event) => {
      if (this.images.length < 2) return;
      if (event.keyCode == 37) {
        // Left arrow Click
        this.images.push(this.images.shift());
      } else if (event.keyCode == 39) {
        // Right arrow Click
        this.images.unshift(this.images.pop());
      }
    });
  },
  methods: {
    /**
     * Thumbnail Click - Emmit an event when a thubnail is clicked
     * @param  {Event} event  Standard JS Event object
     * @return {void}
     */
    thumbnailClick(event) {
      let name = event.target.alt;
      let img = this.images.find((image) => {
        return image.name == name;
      });
      this.$emit('image-click', img);
    },
    /**
     * Arrow Click - Rotate the array of thumbnails when one of the arrows is clicked
     * @param  {Event} event Standard JS Event Object
     * @return {void}
     */
    arrowClick(event) {
      if (this.images.length == 1) return;
      if (event.target.parentElement.classList.contains('left-arrow')) {
        this.images.push(this.images.shift());
      } else {
        this.images.unshift(this.images.pop());
      }
    }
  },
  computed: {
    /**
     * Loaded Images - Returns an array of loaded images
     * @return {Array}
     */
    loadedImages() {
      let arr = [];
      this.images.forEach((image, id) => {
        let img = new Image();
        img.onload = () => {
          arr.push(image);
        };
        img.src = image.file_location;
      });
      return arr;
    },
    /**
     * Show Arrows - Whether to display the rotate arrows
     * @return {Boolean}
     */
    showArrows() {
      if (this.images != undefined && this.images.length >= 6) {
        return true;
      }
      return false;
    },
    /**
     * Show Images - Whether to show the thumbnail images
     * @return {Boolean}
     */
    showImages() {
      if (this.images != undefined && this.images.length > 0) {
        return true;
      }
      return false;
    }
  }
}
</script>

<style lang="css">
</style>
