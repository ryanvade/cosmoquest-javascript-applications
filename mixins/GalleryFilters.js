// GalleryFilters.js
// Created by Ryan Owens

/**
 * Gallery Filters - Stores the state for the Gallery App Image Filters
 */
class GalleryFilters {
  /**
   * Inits the Filters
   */
  constructor() {
    this.user = false;
    this.apps = [];
    this.selected_apps = [];
    this.app = false;
    this.favorited = false;
    this.favoritedBy = false;
    this.finished = false;
    this.craters = false;
    this.recent = false;
    this.oldest = false;
    this.all_apps = true;
    this.orderBy = "";
    this.date = "";
    this.hideImages = false;
  }

  /**
   * Check - Updates the filters based on changes from the User
   * @param  {Event} event  User event triggering the change
   * @param  {Object} user  User who triggered the change
   * @return {void}
   */
  check(event, user) {
    var self = this;
    // If All Projects has been unchecked...
    if (event.target.id === "all-projects" && !this.all_apps) {
      this.selected_apps = [];
    }
    // If All Projects has been checked...
    if (event.target.id === "all-projects" && this.all_apps) {
      this.selected_apps = []; // clear
      let keys = Object.keys(this.apps);
      keys.forEach((key) => {
        self.selected_apps.push(this.apps[key]);
      });
    }

    if (this.selected_apps.length < 1 && !this.all_apps) {
      this.hideImages = true;
    } else {
      this.hideImages = false;
    }

    if (this.selected_apps.length < Object.keys(this.apps).length) {
      this.all_apps = false;
    } else {
      this.all_apps = true;
    }

    this.user = false;
    this.favorited = false;

    switch (this.orderBy) {
      case "Mine":
        this.user = user.id;
        break;
      case "Everyone":
        this.user = false;
        break;
      case "Most_Favorited":
        this.favorited = "most";
        break;
      case "Least_Favorited":
        this.favorited = "least";
        break;
      default:
        this.orderBy = "Mine"
        this.user = user.id;
    }

    switch (this.date) {
      case "Recent":
        this.recent = "1";
        this.oldest = false;
        break;
      case "Oldest":
        this.recent = false;
        this.oldest = "1";
        break;
      default:
        this.recent = "1";
        this.oldest = false;
    }
  }

  /**
   * Query String - Generates the query string for the values of the filters
   * @return {String}
   */
  queryString() {
    let query = "";
    for (var key in this) {
      if (this.hasOwnProperty(key) && this[key] != false && key != "apps") {
        let value = this[key];
        if (value === true) value = '1';
        let sent_key = (key == "selected_apps") ? "apps" : key;
        query = query.concat(`${sent_key}=${value}&`);
      }
    }
    return query;
  }
}

export default GalleryFilters;
