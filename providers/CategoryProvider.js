// CategoryProvider.js
// Created by Ryan Owens
import Provider from './Provider';

/**
 * Category Provider - Interacts with the Category API
 * @extends Provider
 */
class CategoryProvider extends Provider {
  constructor() {
      super();
  }

  /**
   * Get Categories - Retrieves all Categories
   * @return {Promise} Promise of Resolution
   */
  getCategories() {
    let url = window.location.origin;
    url = url + "/api/categories";
    return this.http.get(url);
  }
}
export default CategoryProvider;
