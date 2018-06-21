<template lang="html">
  <div :class="clss">
    <img :id="name" :src="src" alt="" :class="imgclss" @click="$emit('imgclick')" v-show="loaded">
      <canvas v-if="isCenter" v-show="showCanvas"
              :width="canvasWidth"
              :height="canvasHeight"
              class="gallery-canvas"
              :id="name + '-canvas'"
              >
      </canvas>
  </div>
</template>

<script>
import MarkDrawer from '../../mixins/MarkDrawer.js';

export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['src', 'clss', 'imgclss', 'name', 'showMarks', 'marks'],
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      loaded: false,
      canvasHeight: 0,
      canvasWidth: 0,
      icons: {}
    }
  },
  /**
   * Mounted - Runs when the 'mounted' lifecycle event is triggered
   * @return {void}
   */
  mounted() {
    let self = this;
    let img = document.getElementById(this.name);
    img.onload = () => {
      self.loaded = true;
      self.canvasHeight = img.naturalHeight;
      self.canvasWidth = img.naturalWidth;
    };
    if (img.complete) {
      self.loaded = true;
    }

    this.icons.featureImage = new Image();
    this.icons.featureImage.src = "/images/applications/markers/marker.png";

    this.icons.featureSelectedImage = new Image();
    this.icons.featureSelectedImage.src = "/images/applications/markers/marker-selected.png";

    this.icons.boulderImage = new Image();
    this.icons.boulderImage.src = "/images/applications/markers/marker-streak.png";

    this.icons.sunImage = new Image();
    this.icons.sunImage.src = "/images/applications/sun.png";
  },
  /**
   * Updated - Runs when the 'updated' lifecycle event is triggered
   * @return {void}
   */
  updated() {
    if (this.showMarks && this.name == "image2" && this.marks && this.marks.length > 0) {
      let img = document.getElementById("image2");
      this.canvasHeight = img.height;
      this.canvasWidth = img.width;
      document.getElementById(this.name + "-canvas").getContext("2d").clearRect(0, 0, img.width, img.height);
      this.drawMarks(document.getElementById(this.name + "-canvas"));
    }
    this.loaded = true;
  },
  methods: {
    /**
     * Draw Marks - Given a Canvas, Draw the marks of the current image
     * @param  {Element} canv HTML5 Canvas Element
     * @return {void}
     */
    drawMarks(canv) {
      if (!canv) return;
      let ctx = canv.getContext("2d");
      ctx.clearRect(0, 0, canv.width, canv.height);
      (new MarkDrawer(ctx, this.icons)).draw(this.marks);
    }
  },
  computed: {
    /**
     * Show Canvas - Calculates whether to show the canvas
     * @return {Boolean}
     */
    showCanvas() {
      return this.showMarks && this.showMarks == true;
    },
    /**
     * Is Center - Determines if the current image is in the center of the carousel
     * @return {Boolean}
     */
    isCenter() {
      return this.name === "image2";
    },
    /**
     * Image Class - Calculates the CSS class of the current image
     * @return {String}
     */
    imageClass() {
      this.updateMeta();
      switch (this.class) {
        case 'center':
          return 'gallery-image-center';
          break;
        case 'center-left':
          return 'gallery-image-center-left';
          break;
        case 'rear-left':
          return 'gallery-image-rear-left';
          break;
        case 'center-right':
          return 'gallery-image-center-right';
          break;
        case 'rear-right':
          return 'gallery-image-rear-right';
          break;
        default:
          return '';
      }
    }
  },
}
</script>

<style lang="css">
</style>
