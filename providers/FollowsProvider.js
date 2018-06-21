// FollowsProvider.js
// Created by Ryan Owens

import Provider from './Provider';
/**
 * FollowsProvider - Interacts with the follows api
 * @extends Provider
 */
class FollowsProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * Follow - Allows a user to follow an item
   * @param  {Number} id   identification of the item
   * @param  {String} type item type
   * @return {Promise}      Promise of resolution
   */
  follow(id, type) {
    let origin = window.location.origin;
    let url = origin + `/api/follow/${type}`;
    let data = {
      id: id
    };
    return this.http.post(url, data);
  }
}
export default FollowsProvider;
