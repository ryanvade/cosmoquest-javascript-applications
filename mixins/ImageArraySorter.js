/**
 * Image Array Sorter - Sorts arrays of images
 *
 * Created by Ryan Owens
 *
 */
export default class ImageArraySorter {
  constructor(images) {
    this.images = images;
  }

  /**
   * Sort By Increasing Zoom - Sorts the Array by the user provided zoom
   * @return {Array}  Sorted array of images
   */
  sortByIncreasingZoom() {
    return this.images.sort((A, B) => {
      let A_zoom = parseInt(A.image_user.details.location.zoom);
      let B_zoom = parseInt(B.image_user.details.location.zoom);
      if (A_zoom < B_zoom) {
        return -1;
      } else if (B_zoom > A_zoom) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Sort By Decreasing Zoom - Sorts the Array by the user provided zoom
   * @return {Array} Sorted array of images
   */
  sortByDecreasingZoom() {
    return this.images.sort((A, B) => {
      let A_zoom = parseInt(A.image_user.details.location.zoom);
      let B_zoom = parseInt(B.image_user.details.location.zoom);
      if (A_zoom > B_zoom) {
        return -1;
      } else if (B_zoom < A_zoom) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Sort By Closest Zoom - Sorts the Array by the user provided zoom closest to the given zoom
   * @param  {Int} zoom    Zoom to get close to
   * @return {Array}      Sorted array of images
   */
  sortByClosestZoom(zoom) {
    return this.images.sort((A, B) => {
      let A_zoom = Math.abs(zoom - parseInt(A.image_user.details.location.zoom));
      let B_zoom = Math.abs(zoom - parseInt(B.image_user.details.location.zoom));
      if (A_zoom < B_zoom) {
        return -1;
      } else if (B_zoom > A_zoom) {
        return 1;
      }
      return 0;
    });
  }
}
