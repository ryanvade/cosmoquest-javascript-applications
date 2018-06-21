// AppProvider.js
// Created by Ryan Owens

import Provider from './Provider';

/**
 * App Provider - Interacts with the App API
 * @extends Provider
 */
class AppProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * Get Gallery Apps - Fetches the Apps available for the Gallery Filters
   * @return {Promise} Promise of resolution
   */
  getGalleryApps() {
    let url = window.location.origin;
    url = url + "/api/gallery/apps"
    return this.http.get(url);
  }
}
export default AppProvider;
