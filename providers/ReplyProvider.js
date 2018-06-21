// ReplyProvider.js
// Created by Ryan Owens

import Provider from './Provider';
/**
 * ReplyProvider - Interacts with the Reply API
 * @extends Provider
 */
class ReplyProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * Create Quote - Sends data for a new Reply Quote
   * @param  {Number} id   identification of the discussion
   * @param  {String} body content of new quote body
   * @return {Promise}     Promise of resolution
   */
  createQuote(id, body) {
    let url = window.location.origin + "/api/reply";
    let data = {
      body: body,
      id: id
    };
    return this.http.post(url, data);
  }

  /**
   * Create Reply - Sends data for a new Reply
   * @param  {Number} id   identification of the discussion
   * @param  {String} body content of new reply body
   * @return {Promise}     Promise of resolution
   */
  createReply(id, body) {
    let url = window.location.origin + "/api/reply";
    let data = {
      id: id,
      body: body
    };
    return this.http.post(url, data);
  }

  /**
   * Delete Reply - Deletes a reply given its id
   * @param  {Number} id identification of the reply
   * @return {Promise}   Promise of resolution
   */
  deleteReply(id) {
    let url = window.location.origin + "/api/reply";
    let data = {
      id: id
    };
    return this.http({
      method: 'delete',
      url: url,
      data:data
    });
  }

  /**
   * Edit Reply - Send data for editing a reply
   * @param  {Number} id   identification of the reply
   * @param  {String} body new content of reply
   * @return {Promise}     Promise of resolution
   */
  editReply(id, body) {
    let url = window.location.origin + "/api/reply";
    let data = {
      id: id,
      body: body
    };
    return this.http.patch(url, data);
  }
}
/**
 * https://webpack.js.org/api/module-methods/#export
 */
export default ReplyProvider;
