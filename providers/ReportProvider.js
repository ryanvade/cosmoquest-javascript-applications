// ReportProvider.js
// Created by Ryan Owens

import Provider from './Provider';
/**
 * ReportProvider - Interacts with the Report API
 * @extends Provider
 */
class ReportProvider extends Provider {
  constructor() {
    super();
  }
  /**
   * Create Report - Sends data to report an item for moderation
   * @param  {String} type        name of item type being reported
   * @param  {Number} id          identification of item
   * @param  {String} reason      why the item is being reported
   * @param  {String} description details on why the item is being reported
   * @return {Promise}            Promise of resolution
   */
  createReport(type, id, reason, description) {
    let url = window.location.origin + `/api/report/${type}/${id}`;
    let data = {
      reason: reason,
      description: description
    };
    return this.http.post(url, data);
  }
}
/**
 * https://webpack.js.org/api/module-methods/#export
 */
export default ReportProvider;
