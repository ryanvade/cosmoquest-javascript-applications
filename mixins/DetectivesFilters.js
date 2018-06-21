// DetectivesFilters.js
// By Ryan Owens

/**
 * Detectives Filters - Stores and modifies the images filters
 */
class DetectivesFilters {
  constructor() {
    this.cloud_cover_lower = 0;
    this.cloud_cover_upper = 100;
    this.lake = false;
    this.coastline = false;
    this.delta = false;
    this.cyclone = false;
    this.ocean = false;
    this.river = false;
    this.island_reef = false;
    this.snow_ice = false;
    this.mountain = false;
    this.desert = false;
    this.volcano = false;
    this.impact_crater = false;
    this.forest = false;
    this.plateau = false;
    this.sand_dunes = false;
    this.glacier = false;
    this.agriculture = false;
    this.lightning = false;
    this.city = false;
    this.lights_at_night = false;
    this.spacecraft = false;
    this.moon = false;
    this.aurora = false;
    this.clouds = false;
    this.stars = false;
    this.earth_limb = false;
    this.tags = [];
  }

  /**
   * Query - Generates a query string for the image filters
   * @return {String} query string
   */
  query() {
    let filters = ``;
    for (var key in this) {
      if (this.hasOwnProperty(key) && !Array.isArray(this[key])) {
        if (key == 'cloud_cover_lower') {
          let lower = this[key];
          let upper = this['cloud_cover_upper']
          filters = filters + `&cloud_cover=${lower},${upper}`;
        } else if (key == 'cloud_cover_upper') {
          // Do nothing
        } else if (this[key] == true) {
          filters = filters + `&${key}=1`;
        }
      }
    }
    let tags = this.tags;
    if (tags.length > 0) {
      filters = filters + `&custom_tags=`;
      tags.forEach((tag) => {
          let name = tag.tag;
          filters = filters + `${name},`
        });
      }
      return filters;
    }
  }
  export default DetectivesFilters;
