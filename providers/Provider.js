// Provider.js
// Created by Ryan Owens

/**
 * Provider - Interface for API Interaction classes
 */
class Provider {
  constructor() {
    this.http = window.axios;
  }
}
/**
 * https://webpack.js.org/api/module-methods/#export
 */
export default Provider;
