<template lang="html">
  <div>
    <div class="detectives-search-wrapper">
      <div class="" v-if="loading" style="height: 100vh; padding-top: 25vh;">
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      </div>
      <!-- Left Column -->
      <filters :loading="loading" :map="map" :display="displayFilters" v-on:place="setPlace" v-on:filters="setFilters" v-on:hidden="displayFilters = !displayFilters"></filters>
      <!-- Right Column -->
      <div :class="mapClass" v-show="!loading" @click="handleMapClick">
          <canvas id="canvas" :width="canvasWidth" :height="canvasHeight" :style="canvasStyle"></canvas>
          <div id="map" style="width: 100%; height: 100%;"></div>
          <thumbnails :images="images" v-on:image-click="goToImage"></thumbnails>
        </div>
      </div>
      <modal v-if="showHere" v-on:close="showHere = false">
        <div slot="header">
          <h3>What is Here?</h3>
        </div>
        <div slot="body">
          <ul>
            <li v-for="item in here">
              {{ item.formatted_address }}
           </li>
          </ul>
        </div>
        <div slot="footer">
          <button class="modal-default-button" v-on:click="showHere = false">
            Close
          </button>
        </div>
      </modal>
  </div>
</template>

<script>
import ImageArraySorter from '../../mixins/ImageArraySorter';
import GoogleMapHelpers from '../../mixins/GoogleMapHelpers';
import ImageProvider from '../../providers/ImageProvider';
import ImagePlacer from '../../mixins/ImagePlacer';
import _ from 'lodash';

export default {
  /**
   * Components - List of used components
   * @type {Object}
   */
  components: {
    'filters': require('./DetectivesSearchFilters.vue'),
    'thumbnails': require('./DetectivesSearchThumbnails.vue'),
    'modal': require('../Util/Modal.vue')
  },
  /**
   * Data - Components used values
   * @return {Dictionary}
   */
  data() {
    return {
      map: null,
      canvas: null,
      noImagesDiv: null,
      zoomAlertDiv: null,
      showThumbnails: false,
      closestZoom: -1,
      canvasWidth: '100',
      canvasHeight: '200',
      canvasStyle: '',
      loading: false,
      lat: 38.63,
      lng: -90.19,
      north: 38.85974743531055,
      south: 38.121309539814106,
      east: -89.168271484375,
      west: -91.211728515625,
      zoom: 10,
      filters: null,
      images: [],
      canvasOpacity: 1.0,
      mapClass: 'right-column',
      here: [],
      showHere: false,
      displayFilters: false,
      imageProvider: new ImageProvider(),
      mapHelper: new GoogleMapHelpers()
    };
  },
  watch: {
    /**
     * Query Watcher - Get new images when the Filters + Location query changes
     * @return {void}
     */
    query() {
      this.getImages();
    },
    /**
     * Show Thumbnails - Hide or Display the thumbnail row
     * @return {void}
     */
    showThumbnails() {
      let btn = document.getElementById('show-thumbnails-button');
      if (this.showThumbnails) {
        btn.title = "Hide Thumbnails";
        btn.innerHTML = `<i class="fa fa-angle-down fa-lg" aria-hidden="true"></i>`;
      } else {
        btn.title = "Show Thumbnails";
        btn.innerHTML = `<i class="fa fa-angle-up fa-lg" aria-hidden="true"></i>`;
      }
    }
  },
  /**
   * Mounted - https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
   * @return {void}
   */
  mounted() {
    this.mapHelper.createGoogleMap()
      .then(this.initMap)
      .catch(this.mapHelper.displayMapLoadError);
    this.canvas = document.getElementById("canvas");
  },
  methods: {
    /**
     * Init Map - Initializes the Google Map
     * @return {void}
     */
    initMap() {
      // Get users current location
      var center = new google.maps.LatLng(this.lat, this.lng);
      let options = {
        center: center,
        zoom: this.zoom,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
      };
      this.map = new google.maps.Map(document.getElementById("map"), options);
      setTimeout(() => {
        this.loading = false;
        this.mapHelper.updateMapSize(this.map);
      }, 2000);
      this.addListeners();
      this.setCanvasSize(false);
      this.getImages();
      this.drawOpacityButtons();
      this.drawWhatsHereButton();
      this.addInfoBox();
    },
    /**
     * Set Canvas Size - Gets the Google Map size and sets the canvas size to match
     * @param  {Boolean} hidden Whether the filters are hidden
     * @return {void}
     */
    setCanvasSize(hidden) {
      if (hidden) {
        this.mapClass = 'right-column-wide';
      } else {
        this.mapClass = 'right-column';
      }
      setTimeout(() => {
        let width = window.getComputedStyle(document.getElementById('map')).width;
        let height = window.getComputedStyle(document.getElementById('map')).height;
        let opacity = this.canvasOpacity;
        this.canvasStyle = `position:absolute;width:${width};height:${height};z-index:1;pointer-events:none;opacity:${opacity};`;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.mapHelper.updateMapSize(this.map);
      }, 1000);
    },
    /**
     * Set Place - Sets the Google Map Center to a Latitude and Longitude
     * @param {google.map.LatLng} latlng LatitudeLongitude Object
     */
    setPlace(latlng) {
      this.showHere = false;
      this.showThumbnails = false;
      this.here = [];
      this.lat = latlng.lat();
      this.lng = latlng.lng();
      this.map.setCenter(latlng);
    },
    /**
     * Sets the Filters object from the Filters Component
     * @param {Object} filters all filters
     */
    setFilters(filters) {
      this.filters = filters;
    },
    /**
     * Get Images - Performs an AJAX request for images and sorts them
     * @return {void}
     */
    getImages(query = null) {
      let self = this;
      _.defer(function(self) {
        let ctx = self.canvas.getContext("2d");
        self.drawNoImagesFound = false;
        self.drawZoomAlert = false;
        let used_query = self.query;
        if(query != null) {
          used_query = query;
        }
        console.log(used_query);
        self.imageProvider.getDetectivesSearchImagesWithQuery(used_query).then((response) => {
          // sort by Image Zoom
          self.images = (new ImageArraySorter(response.data.data)).sortByIncreasingZoom();
          // attempt to draw images
          let hasDrawnImages = (new ImagePlacer(self.canvas, self.map)).place(self.images);
          // determine if alerts should be drawn
          self.drawAlerts(hasDrawnImages);
        }).catch((error) => {
          console.error(error);
        });
      }, self);
    },
    /**
     * Draw Alerts - Enables/Disables image helper alerts
     * @param  {Boolean} hasDrawnImages whether any images have been placed
     * @return {void}
     */
    drawAlerts(hasDrawnImages) {
      // if there are any images
      this.drawNoImagesFound = false;
      this.drawZoomAlert = false;
      this.mapHelper.clearAlerts(this.map);
      if (this.images.length <= 0) {
        this.mapHelper.setAlert(this.map, this.noImagesDiv);
      } else if (!hasDrawnImages) {
        this.mapHelper.setAlert(this.map, this.zoomAlertDiv);
      }
    },
    /**
     * Add Info Box - Display an information dialog on the Map
     * @return {void}
     */
    addInfoBox() {
      let div = document.createElement('div');
      div.id = "no-images-div";
      div.className = 'canvasInfoContainer';
      div.style.visibility = "hidden";
      let span = document.createElement('span');
      span.className = 'canvasInfo';
      span.innerHTML = 'No images in this region.';
      div.appendChild(span);
      div.index = 1;
      div.style.visibility = "hidden";
      this.noImagesDiv = div;

      div = document.createElement('div');
      div.id = "zoom-alert-div";
      div.className = 'canvasInfoContainer';
      div.style.visibility = "hidden";
      let button = document.createElement('button');
      button.className = "btn-link";
      button.id = "closest-zoom-button";
      button.innerHTML = "Click Here to view them.";
      span = document.createElement('span');
      span.className = "canvasInfo";
      span.innerHTML = "Images found in this region.";
      span.appendChild(button);
      // span.innerHTML = span.innerHTML + " to view them.";
      div.appendChild(span);
      div.index = 1;
      div.style.visibility = "hidden";
      this.zoomAlertDiv = div;

      let self = this;
      google.maps.event.addDomListener(button, 'click', () => {
        self.mapHelper.goToClosestZoom(self.map, self.images);
      });
    },
    /**
     * Draw Show Thumbnails Button - Display the show thumbnails button on the map
     * @return {void}
     */
    drawShowThumbnailButton() {
      let div = document.createElement('div');
      let btn = document.createElement('button');
      btn.id = "show-thumbnails-button";
      btn.className = "show-thumbnails-button";
      btn.title = "Show Thumbnails";
      btn.innerHTML = `<i class="fa fa-angle-up fa-lg" aria-hidden="true"></i>`;
      div.appendChild(btn);
      div.index = 1;
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(div);
      // Add listener to the button
      let self = this;
      google.maps.event.addDomListener(btn, 'click', () => {
        self.showThumbnails = !self.showThumbnails;
      });
    },
    /**
     * Draw Opacity Buttons - Adds opacity Increment/Decrement buttons
     * @return {Void}
     */
    drawOpacityButtons() {
      let div = document.createElement('div');

      let decrementButton = document.createElement('button');
      decrementButton.className = 'decrement-button';
      decrementButton.title = 'Decrease Opacity';
      decrementButton.innerHTML = 'Decrease Opacity';
      div.appendChild(decrementButton);

      let incrementButton = document.createElement('button');
      incrementButton.className = 'increment-button';
      incrementButton.title = 'Increase Opacity';
      incrementButton.innerHTML = 'Increase Opacity';
      div.appendChild(incrementButton);
      div.index = 1;

      this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(div);

      // Add listeners to the buttons
      let self = this;
      google.maps.event.addDomListener(decrementButton, 'click', () => {
        decrementButton.disabled = false;
        incrementButton.disabled = false;
        self.canvasOpacity = self.canvasOpacity - 0.1;
        if (self.canvasOpacity < 0.0) {
          self.canvasOpacity = 0.0;
          decrementButton.disabled = true;
        }
        self.canvas.style.opacity = self.canvasOpacity;
      });

      google.maps.event.addDomListener(incrementButton, 'click', () => {
        incrementButton.disabled = false;
        decrementButton.disabled = false;
        self.canvasOpacity = self.canvasOpacity + 0.1;
        if (self.canvasOpacity > 1.0) {
          self.canvasOpacity = 1.0;
          incrementButton.disabled = true;
        }
        self.canvas.style.opacity = self.canvasOpacity;
      });
    },
    /**
     * Draw Show Filters Button - Display the show filters button on the map
     * @return {void}
     */
    drawShowFiltersButton() {
      let div = document.createElement('div');
      let displayFiltersButton = document.createElement('button');
      displayFiltersButton.className = 'display-filters-button';
      displayFiltersButton.title = 'Display Filters';
      displayFiltersButton.innerHTML = '<span>Filters</span><i class="fa fa-angle-right fa-lg" aria-hidden="true"></i>';
      div.appendChild(displayFiltersButton);

      this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(div);


      google.maps.event.addDomListener(displayFiltersButton, 'click', () => {
        this.displayFilters = !this.displayFilters;
      });
    },
    /**
     * Draw Whats Here Button - Display the what is here button on the map
     * @return {void}
     */
    drawWhatsHereButton() {
      let div = document.createElement('div');
      let whatsHereButton = document.createElement('button');
      whatsHereButton.className = 'whats-here-button';
      whatsHereButton.title = 'View details about the current map center';
      whatsHereButton.innerHTML = 'Whats Here?';
      div.appendChild(whatsHereButton);

      div.index = 1;
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(div);

      let self = this;
      google.maps.event.addDomListener(whatsHereButton, 'click', () => {
        self.here = [];
        let geocoder = new google.maps.Geocoder;
        let center = self.map.getCenter();
        let accepted_types = [
          'locality',
          'sublocality',
          'country',
          'political',
          'administrative_area_level_1',
          'administrative_area_level_2'
        ];
        geocoder.geocode({
          'location': center
        }, (results, status) => {
          if (status === 'OK') {
            results.forEach((result) => {
              let types = result.types;
              let intersect = _.intersection(accepted_types, types);
              if (intersect.length > 0) {
                self.here.push(result);
              }
            });
            self.here = _.uniq(self.here, (item) => {
              return item.formatted_address;
            });
            self.showHere = self.here.length > 0;
            if (self.showHere) {
              this.showThumbnails = false;
            }
          }
        });
      });
    },
    /**
     * Add Listeners - Attaches event listners to the Google map
     * @return {void}
     */
    addListeners() {
      this.map.addListener('drag', () => {
        this.clearCanvas();
        this.showHere = false;
        this.here = [];
      });

      this.map.addListener('zoom_changed', () => {
        this.clearCanvas();
        this.showHere = false;
        this.here = [];
      });

      this.map.addListener('idle', () => {
        this.zoom = this.map.getZoom();
        let center = this.map.getCenter();
        this.lat = center.lat();
        this.lng = center.lng();

        let bounds = this.map.getBounds();
        this.north = bounds.getNorthEast().lat();
        this.south = bounds.getSouthWest().lat();
        this.east = bounds.getNorthEast().lng();
        this.west = bounds.getSouthWest().lng();
      });
    },
    /**
     * Clear Canvas - Removes all marks from the HTML5 Canvas
     * @return {void}
     */
    clearCanvas() {
      let ctx = self.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    /**
     * Go To Image - Sets the map location and zoom to that of a given image
     * @param  {Object} image
     * @return {void}
     */
    goToImage(image) {
      this.showThumbnails = false;
      let zoom = parseInt(image.image_user.details.location.zoom);
      let lat = image.image_user.details.location.latitude;
      let lng = image.image_user.details.location.longitude;
      this.mapHelper.goTo(this.map, lat, lng, zoom);
    },
    /**
     * Handle Map Click - Determmine what to do if a click occurs on the map
     * @param  {Event} event  Standard JS Event object
     * @return {void}
     */
    handleMapClick(event) {
      // if it is not the show filters button
      if (event.target.className != 'display-filters-button' && (event.target.tagName != "SPAN" && event.target.parentElement.className != "display-filters-button")) {
        this.displayFilters = false;
      }
    }
  },
  computed: {
    /**
     * Query - Calculates the Query string for the Detectives Search
     * @return {String}
     */
    query() {
      if (this.filters == null) {
        return `?nsew=${this.north},${this.south},${this.east},${this.west}`;
      }
      let latlngzoom = `nsew=${this.north},${this.south},${this.east},${this.west}`;
      let filters = this.filters.query();
      return `${latlngzoom}${filters}`;
    }
  }
}
</script>

<style lang="css">
  /* MOVED to _detectives_search.scss */
</style>
