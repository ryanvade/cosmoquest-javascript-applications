// ClipboardManager.js
// By Ryan Owens

/**
 * Clipboard Manager - Handles copying to the clipboard
 */
class ClipboardManager {
  constructor() {
    this.element = null;
  }

  /**
   * Set Element - Changes which HTML element to get data from
   * @param {String} elementId Identifier of the HTML element to copy
   * @return {ClipboardManager} Reference to the current manager
   */
  setElement(elementId) {
    this.element = document.getElementById(elementId);
    return this;
  }

  /**
   * Copy - Attempts to copy the element content to the clipboard
   * @return {ClipboardManager} Reference to the current manager
   */
  copy() {
    this.element.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      flash("Copied to clipboard", "success");
    } catch (err) {
      console.error('Could not copy to clipboard');
    }
    return this;
  }
}
export default ClipboardManager;
