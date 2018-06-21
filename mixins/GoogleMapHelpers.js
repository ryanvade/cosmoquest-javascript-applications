// GoogleMapHelpers.js
// By Ryan Owens
import ImageArraySorter from './ImageArraySorter';

class GoogleMapHelpers {
  constructor() {}

  /**
   * Create Google Map - Loads the Google Map APIs on the page
   * @return {Promise} promise to generate a map
   */
  createGoogleMap() {
    return new Promise((resolve, reject) => {
      let gmap = document.createElement('script');
      // Gets API Key from .env file: https://laravel.com/docs/5.5/mix#environment-variables
      const API_KEY = process.env.MIX_GOOGLE_MAPS_API_KEY;
      gmap.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      gmap.type = 'text/javascript';
      gmap.onload = resolve;
      gmap.onerror = reject;
      document.body.appendChild(gmap);
    });
  }

  /**
   * Get Bounds Zoom Level - Computes the Zoom level for a map bounds
   * @param  {google.map.LatLngBounds} bounds Map Bounds
   * @param  {Array}                   mapDim Map Dimensions in pixels
   * @return {Integer}                        Zoom Level
   */
  getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = {
      height: 256,
      width: 256
    };
    var ZOOM_MAX = 21;

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (this.latRad(ne.lat()) - this.latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = this.zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = this.zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  }

  /**
   * LatRad - Converet Latitude into a radius
   * @param  {Float} lat latitude
   * @return {Int}       radius
   */
  latRad(lat) {
    var sin = Math.sin(lat * Math.PI / 180);
    var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  /**
   * Zoom - Get the zoom level for a map location
   * @param  {Int} mapPx
   * @param  {Int} worldPx
   * @param  {Int} fraction
   * @return {Int}
   */
  zoom(mapPx, worldPx, fraction) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  /**
   * Go To Closest Zoom - Sorts the array of images and sets the zoom to the closest one
   * @return {void}
   */
  goToClosestZoom(map, images) {
    let imagesSortedByClosestZoom = (new ImageArraySorter(images)).sortByClosestZoom(map.getZoom());
    let closestZoom = parseInt(imagesSortedByClosestZoom[0].image_user.details.location.zoom);
    let lat = imagesSortedByClosestZoom[0].image_user.details.location.latitude;
    let lng = imagesSortedByClosestZoom[0].image_user.details.location.longitude;
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(closestZoom);
  }

  /**
   * Update Map Size - Resizes the Google Map
   * @param  {google.map} map
   * @return {void}
   */
  updateMapSize(map) {
    google.maps.event.trigger(map, 'resize');
  }

  /**
   * Display Map Load Error - If the Google map does not load, display an error
   * @return {void}
   */
  displayMapLoadError() {
    window.flash('Unable to load map', 'error');
    console.error("Dispaly Map Load Errors");
  }

  /**
   * Clear Alerts - Removes divs from the Top Center of the map
   * @param  {google.map} map
   * @return {void}
   */
  clearAlerts(map) {
    map.controls[google.maps.ControlPosition.TOP_CENTER].clear();
  }

  /**
   * Set Alert - Adds an alert div to the Top Center of the map
   * @param  {google.map} map
   * @param  {element} div
   * @return {void}
   */
  setAlert(map, div) {
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(div);
  }

  /**
   * Go To - Set the center of the map to a location
   * @param  {google.map} map
   * @param  {int}        lat latitude
   * @param  {int}        lng longitude
   * @param  {int}        zoom level of zoom
   * @return {void}
   */
  goTo(map, lat, lng, zoom) {
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(zoom);
  }
}
export default GoogleMapHelpers;
