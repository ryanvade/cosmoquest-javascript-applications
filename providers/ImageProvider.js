// ImageProvider.js
// Created by Ryan Owens

import Provider from './Provider';

/**
 * Image Provider - Interacts with the Image API
 * @extends Provider
 */
class ImageProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * Get Users for Image - Fetches the Users who have marked an image
   * @param  {Number} id identification for the image
   * @return {Promise}    Promise of resolution
   */
  getUsersForImage(id) {
    let url = window.location.origin;
    url = url + "/api/gallery/users?image_id=" + id;
    return this.http.get(url);
  }

  /**
   * Get Gallery Images with Query - Get the Gallery images matching the query
   * @param  {String} query API Query String
   * @return {Promise}      Promise of resolution
   */
  getGalleryImagesWithQuery(query) {
    let url = window.location.origin;
    url = url + `/api/gallery/images${query}`;
    return this.http.get(url);
  }

  /**
   * Get Detectives Search Images with Query - Get the Detectives Search images matching the query
   * @param  {String} query API Query String
   * @return {Promise}      Promise of resolution
   */
  getDetectivesSearchImagesWithQuery(query) {
    let url = window.location.origin;
    if(query.charAt(0) != '?') {
      query = '?' + query;
    }
    url = url + `/api/detectives/images${query}`;
    return this.http.get(url);
  }
}
export default ImageProvider;
