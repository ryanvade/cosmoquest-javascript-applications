/**
 * Detectives Image - Object that contains required information about an
 *                    Image Detective image
 *
 * Created by Ryan Owens
 *
 */
export default class DetectivesImage {

  /**
   * Detectives Image
   * @param  {Object} json JSON representation of an Image
   * @return {DetectivesImage}
   */
  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.favoritesCount = json.favoritesCount;
    this.imageUserCount = json.imageusercount;
    this.application = json.application;
    this.favorites = json.favorites;
    this.source = json.file_location;
    this.details = JSON.parse(json.details);
    this.image_user_id = json.image_user.id;
    this.image_user_details = json.image_user.details;
    this.image_user_location = json.image_user.details.location;

    this.coordinates = [-1, -1];
    this.width = -1;
    this.height = -1;

    this.img = null;
  }

  /**
   * Get ID - Returns the image's ID
   * @return {Integer} id
   */
  getId() {
    return this.id;
  }

  /**
   * Get Cooridnates - returns the images X, Y coordinates on the Map
   * @return {Array} Array with X, Y Cooridnates in pixels
   */
  getCoordinates() {
    return this.coordinates;
  }

  /**
   * Get Width - Returns the displayed width of the image
   * @return {Float} Width of the image in px
   */
  getWidth() {
    return this.width;
  }

  /**
   * Get Height - Returns the displayed height of the image
   * @return {Float} Height of the image in px
   */
  getHeight() {
    return this.height;
  }

  /**
   * Set Coordinates - Sets the X, Y coordinates of the image on a map
   * @param {Integer} x in px
   * @param {Integer} y in px
   */
  setCoordinates(x, y) {
    this.coordinates[0] = x;
    this.coordinates[1] = y;
  }

  /**
   * Set Width - Sets the displyaed width of the image
   * @param {Float} width in px
   */
  setWidth(width) {
    this.width = width;
  }

  /**
   * Set Height - Sets the displayed height of the image
   * @param {Float} height in px
   */
  setHeight(height) {
    this.height = height;
  }

  /**
   * Get User Latitude - Gets the User's marked latitude of the image
   * @return {Float} latitude
   */
  getUserLatitude() {
    return parseFloat(this.image_user_location.latitude);
  }

  /**
   * Get User Longitude - Gets the User's marked longitude of the image
   * @return {Float} longitude
   */
  getUserLongitude() {
    return parseFloat(this.image_user_location.longitude);
  }

  /**
   * Get User Zoom - Gets the User's marked Google map zoom level of the image
   * @return {int} zoom
   */
  getUserZoom() {
    return parseInt(this.image_user_location.zoom);
  }

  /**
   * Get User Scale - Gets the User's marked image scale
   * @return {int} scale
   */
  getUserScale() {
    return parseFloat(this.image_user_location.scale);
  }

  /**
   * Get User Rotation - Gets the User's marked image rotation
   * @return {int} rotation in Radians
   */
  getUserRotation() {
    return -parseInt(this.image_user_location.rotation) * (Math.PI / 180);
  }

  /**
   * Get User Cloud Cover - Gets the User's marked cloud cover for the image
   * @return {int} zoom
   */
  getUserCloudCover() {
    return parseInt(this.image_user_location.cloud_cover);
  }

  /**
   * Get Source - Returns the image's file location
   * @return {String} file location URL
   */
  getSource() {
    return this.source;
  }

  /**
   * Load - get and load an Image object
   * @param  {Function} onload optional function reference for onload
   * @return {void}
   */
  load(onload = null) {
    this.img = new Image();
    if (onload != null) {
      this.img.onload = onload;
    }
    this.img.src = this.source;
  }

  /**
   * Get Img - return the Image object
   * @return {Image|null} Image object or null
   */
  getImg() {
    return this.img;
  }
}
