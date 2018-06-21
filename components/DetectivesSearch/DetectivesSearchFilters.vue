<template lang="html">
  <div >
    <div v-show="!loading">
      <!-- Filters -->
      <button type="button" class="btn display-filters-button" title="Show Filters" @click="changeFiltersSize" v-if="!display">
        <span>Filters</span><i class="fa fa-angle-right fa-lg" aria-hidden="true"></i>
      </button>
      <transition name="filters">
      <aside class="detectives-search-aside" v-show="display">
        <button type="button" class="btn detectives-search-hide-filters-btn" title="Hide Filters" @click="changeFiltersSize">
          <span>Hide</span><i class="fa fa-angle-left fa-lg" aria-hidden="true"></i>
        </button>
        <div class="detectives-search-filters-show-item">

        </div>
        <ul class="detectives-search-aside-ul">
          <li>
              <span>Search for a place</span>
              <input type="text" name="" v-model="place" placeholder="place" v-on:keyup.enter="searchForPlace">
              <button type="button" class="" @click="searchForPlace">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>
          </li>
          <!-- Tags -->
          <li>
              <span>Add Tags</span>
              <input type="text" name="" v-model="tag" placeholder="tag" v-on:keyup.enter="addTag">
              <button type="button" class="" @click="addTag">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>
              <div class="tag-container">
                <span class="square-badge tag" v-for="Tag in filters.tags" :style="Tag.style">
                  {{ Tag.tag }}
                  <i class="remove glyphicon glyphicon-remove-sign glyphicon-white" v-on:click="removeTag(Tag)"></i>
                </span>
              </div>
              <button class="clear-tags-button" v-if="filters.tags.length > 1" @click="clearTags">Clear Tags</button>
          </li>

          <!-- TODO: Make into Range Slider? -->
          <li>
            <span>Lower Cloud Cover Percentage: {{ filters.cloud_cover_lower }}%</span>
            <span><input type="range" min="0" max="100" v-model="filters.cloud_cover_lower"   ></span>
          </li>
          <li>
            <span>Upper Cloud Cover Percentage: {{ filters.cloud_cover_upper }}%</span>
          <span><input type="range" min="0" max="100" v-model="filters.cloud_cover_upper"   ></span>
          </li>
          <!-- Accordian One -->
          <li>
            <div class="panel-group">
              <div class="panel panel-default">
                <h4 class="panel-title">
                  <a id="0" data-toggle="collapse" @click="handleAccordianButton">Water Features <i :class="accordianLinkClasses[0]" aria-hidden="true"></i></a>
                </h4>
              </div>
              <div :class="accordianClasses[0]">
                <transition name="filters-accordian">
                <ul class="list-group">
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.lake"   id="switch">
                    <label for="switch">
                      <span class="switch-label">Lake</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.coastline"   id="switch2">
                      <label for="switch2">
                        <span class="switch-label">Coastline</span>
                      </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.delta"   id="switch3">
                    <label for="switch3">
                        <span class="switch-label">Delta</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.cyclone"   id="switch4">
                    <label for="switch4">
                        <span class="switch-label">Cyclone</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.ocean"   id="switch5">
                    <label for="switch5">
                      <span class="switch-label">Ocean</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.river"   id="switch6">
                    <label for="switch6">
                      <span class="switch-label">River</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.island_reef"   id="switch7">
                    <label for="switch7">
                      <span class="switch-label">Island/Reef</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.snow_ice"   id="switch8">
                    <label for="switch8">
                      <span class="switch-label">Snow/Ice</span>
                    </label>
                  </li>
                </ul>
              </transition>
              </div>
            </div>
          </li>
          <!-- Accordian Two -->
          <li>
            <div class="panel-group">
              <div class="panel panel-default">
                <h4 class="panel-title">
                  <a id="1" @click="handleAccordianButton">Land Features <i :class="accordianLinkClasses[1]" aria-hidden="true"></i></a>
                </h4>
              </div>
              <div :class="accordianClasses[1]">
                <transition name="filters-accordian">
                <ul class="list-group">
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.mountain"   id="switch9">
                    <label for="switch9">
                      <span class="switch-label">Mountain</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.desert"   id="switch10">
                      <label for="switch10">
                          <span class="switch-label">Desert</span>
                      </label>
                  </li>
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.volcano"   id="switch11">
                      <label for="switch11">
                        <span class="switch-label">Volcano</span>
                      </label>
                  </li>
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.impact_crater"   id="switch12">
                      <label for="switch12">
                        <span class="switch-label">Impact Crater</span>
                      </label>
                  </li>
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.forest"   id="switch13">
                      <label for="switch13">
                        <span class="switch-label">Forest</span>
                      </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.plateau"   id="switch14">
                    <label for="switch14">
                      <span class="switch-label">Plateau</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.sand_dunes"   id="switch15">
                    <label for="switch15">
                      <span class="switch-label">Sand Dunes</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.glacier"   id="switch16">
                      <label for="switch16">
                        <span class="switch-label">Glacier</span>
                      </label>
                  </li>
                </ul>
              </transition>
              </div>
            </div>
          </li>
          <!-- Accordian Three -->
          <li>
            <div class="panel-group">
              <div class="panel panel-default">
                <h4 class="panel-title">
                  <a id="2" @click="handleAccordianButton">Additional Features <i :class="accordianLinkClasses[2]" aria-hidden="true"></i></a>
                </h4>
              </div>
              <div :class="accordianClasses[2]">
                <transition name="filters-accordian">
                <ul class="list-group">
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.agriculture"   id="switch17">
                      <label for="switch17">
                        <span class="switch-label">Agriculture</span>
                      </label>
                  </li>
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.lightning"   id="switch18">
                      <label for="switch18">
                        <span class="switch-label">Lightning</span>
                      </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.city"   id="switch19">
                    <label for="switch19">
                        <span class="switch-label">City</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.lights_at_night"   id="switch20">
                    <label for="switch20">
                      <span class="switch-label">Lights at Night</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.spacecraft"   id="switch21">
                    <label for="switch21">
                        <span class="switch-label">Spacecraft</span>
                    </label>
                  </li>
                </ul>
              </transition>
              </div>
            </div>
          </li>
          <!-- Accordian Three -->
          <li>
            <div class="panel-group">
              <div class="panel panel-default">
                <h4 class="panel-title">
                  <a id="3" @click="handleAccordianButton">Space Features <i :class="accordianLinkClasses[3]" aria-hidden="true"></i></a>
                </h4>
              </div>
              <div :class="accordianClasses[3]">
                <transition name="filters-accordian">
                <ul class="list-group">
                  <li class="list-group-item">
                      <input type="checkbox" v-model="filters.moon"  id="switch22">
                      <label for="switch22">
                        <span class="switch-label">Moon</span>
                      </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.aurora"    id="switch23">
                    <label for="switch23">
                      <span class="switch-label">Aurora</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.clouds"   id="switch24">
                    <label for="switch24">
                      <span class="switch-label">Clouds</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.stars"   id="switch25">
                    <label for="switch25">
                      <span class="switch-label">Stars</span>
                    </label>
                  </li>
                  <li class="list-group-item">
                    <input type="checkbox" v-model="filters.earth_limb"   id="switch26">
                    <label for="switch26">
                      <span class="switch-label">Earth Limb</span>
                    </label>
                  </li>
                </ul>
              </transition>
              </div>
            </div>
          </li>
        </ul>
      </aside>
    </transition>
    </div>
  </div>
</template>

<script>
import PlacesProvider from '../../providers/PlacesProvider';
import DetectivesFilters from '../../mixins/DetectivesFilters';

export default {
  /**
   * Props - Input variables to the component
   * @type {Array}
   */
  props: ['loading', 'map', 'display'],
  /**
  * Data - Components used values
  * @return {Dictionary}
  */
  data() {
    return {
      filtersClass: '',
      place: "",
      tag: "",
      accordianClasses: [
        "panel-collapse collapse",
        "panel-collapse collapse",
        "panel-collapse collapse",
        "panel-collapse collapse"
      ],
      accordianLinkClasses: [
        "fa fa-plus",
        "fa fa-plus",
        "fa fa-plus",
        "fa fa-plus"
      ],
      filters: new DetectivesFilters(),
    };
  },
  /**
   * Mounted - https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
   * @return {void}
   */
  mounted() {
    window.addEventListener('keydown', (event) => {
      if (event.target.tagName.toUpperCase() != 'INPUT') {
        if (event.key.toLowerCase() == 'f') {
          this.changeFiltersSize();
        }
      }
    });
  },
  computed: {
    /**
     * Filter String - Used to watch the filters
     *                 Created because Vue does not 'deep' watch variables
     * @return {String} string representation of the filters object
     */
    filtersString() {
      return this.filters.query();
    },
    /**
     * Column Class - computes the class for the left column
     * @return {String} class name
     */
    columnClass() {
      if (!this.display) {
        return '';
      } else {
        return 'left-column';
      }
    }
  },
  watch: {
    /**
     * Filter String Watcher - Watches the filters and alerts the Parent
     * @emits {Filters} Emits 'Filters' event to parent component
     * @return {Void}
     */
    filtersString() {
      this.$emit('filters', this.filters);
    },
  },
  methods: {
    /**
     * Search For Place - Use the Google Places API to search for a User Inputed Place
     * @emits  {Place} Emits 'Place' event to parent component
     * @return {Void}
     */
    searchForPlace() {
      let provider = new PlacesProvider(this.map);
      let self = this;
      let coords = provider.search(this.place).then((results) => {
        self.$emit('place', new google.maps.LatLng(results.lat(), results.lng()));
      });
    },
    /**
     * Change Filters Size - Hides the filters column
     * @return {Void}
     */
    changeFiltersSize() {
      this.$emit('hidden');
    },
    /**
     * Handle Accordian Button - Hides and Displays Filter Accordians
     * @param  {Event} event  Click Event
     * @return {Void}
     */
    handleAccordianButton(event) {
      let id = parseInt(event.target.id);
      let currentState = this.accordianClasses[id];
      this.accordianLinkClasses = [
        "fa fa-plus",
        "fa fa-plus",
        "fa fa-plus",
        "fa fa-plus"
      ];
      this.accordianClasses = [
        "panel-collapse collapse",
        "panel-collapse collapse",
        "panel-collapse collapse",
        "panel-collapse collapse"
      ];
      if (currentState != "panel-collapse") {
        this.accordianClasses[id] = "panel-collapse";
        this.accordianLinkClasses[id] = "fa fa-minus";
      }
    },
    /**
     * Add Tag - Uses the tag input to add custom search tags
     * @return {void}
     */
    addTag() {
      if (this.tag.length < 1) return;
      let length = (this.tag.length * 12); // 12 px Font size by default
      // let colorStyle = this.tagStyles[Math.floor(Math.random() * (12 - 0 + 1))];
      let Tag = {
        tag: this.tag,
        style: length + 'px;'
      };
      this.filters.tags.push(Tag);
      this.tag = "";
    },
    /**
     * Remove Tag - Removes a given tag from the array of custom search tags
     * @param  {String} tag
     * @return {void}
     */
    removeTag(tag) {
      this.filters.tags = this.filters.tags.filter((t) => {
        return t.tag !== tag.tag
      });
    },
    /**
     * Clear Tags - Removes all custom search tags
     * @return {void}
     */
    clearTags() {
      this.filters.tags = [];
    }
  }
}
</script>

<style lang="css">
</style>
