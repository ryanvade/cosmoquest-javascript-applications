// DiscussionProvider.js
// Created by Ryan Owens

import Provider from './Provider';
/**
 * DiscussionProvider - Interacts with the Discussion API
 * @extends Provider
 */
class DiscussionProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * Get Discussion - Retrieves a discussion by its Slug
   * @param  {String} slug     slug of the discussion
   * @param  {Number} [page=1] page number for replies pagination
   * @return {Promise}         Promise of resolution
   */
  getDiscussion(slug, page = 1) {
    let origin = window.location.origin;
    let url = origin + `/api/discussion/${slug}?page=${page}`;
    return this.http.get(url);
  }

  /**
   * Get Discussions - Returns all discussions in the category
   * @param  {String} [category=null] Category Slug
   * @param  {Number} [page=1]        Curent pagination page number
   * @return {Promise}                Promise of resolution
   */
  getDiscussions(category = null, page = 1) {
    let origin = window.location.origin;
    let url = "";
    if(category != null) {
      url = origin + `/api/discussions?category=${category}&page=${page}`;
    }else {
      url = origin + `/api/discussions?page=${page}`;
    }
    return this.http.get(url);
  }

  /**
   * Delete Discussion - Deletes a discussion given its ID
   * @param  {Number} id identification of the discussion
   * @return {Promise}   Promise of resolution
   */
  deleteDiscussion(id) {
    let url = window.location.origin + "/api/discussion";
    let data = {
      id: id
    };
    return this.http({
      method: 'delete',
      url: url,
      data: data
    });
  }

  /**
   * Edit Discussion - Sends updated information for a discussion
   * @param  {Number} id   identification of the discussion
   * @param  {String} body new discussion body content
   * @return {Promise}     Promise of resolution
   */
  editDiscussion(id, body) {
    let url = window.location.origin + "/api/discussion";
    let data = {
      id: id,
      body: body
    };
    return this.http.patch(url, data);
  }

  /**
   * Create Discussion - Sends data for new discussion
   * @param  {String} category name of category to add the discussion to
   * @param  {String} title    title of the discussion
   * @param  {String} body     new discussion body content
   * @return {Promise}         Promise of Resolution
   */
  createDiscussion(category, title, body) {
    let url = window.location.origin + "/api/chatroom/discussion";
    let data = {
      title: title,
      category: category,
      body: body,
    };
    return this.http.post(url, data);
  }
}

/**
 * https://webpack.js.org/api/module-methods/#export
 */
export default DiscussionProvider;
