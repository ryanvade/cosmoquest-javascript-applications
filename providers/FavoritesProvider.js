// FavoritesProvider.js
// Created by Ryan Owens

import Provider from './Provider';
/**
 * FavoritesProvider - Interacts with the Favorites API
 * @extends Provider
 */
class FavoritesProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * Toggle Item Favorite - Favorites or Unfavorites an Item
   * @param  {Number} id   identification of the item
   * @param  {String} type item type
   * @return {Promise}      Promise of resolution
   */
  toggleItemFavorite(id, type) {
    let origin = window.location.origin;
    let url = origin + `/api/favorite/${type}`;
    let data = {
      id: id
    };
    return this.http.post(url, data);
  }
}
/**
 * https://webpack.js.org/api/module-methods/#export
 */
export default FavoritesProvider;
