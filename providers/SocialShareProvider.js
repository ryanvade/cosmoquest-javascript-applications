// SocialShareProvider.js
// Created by Ryan Owens

import Provider from './Provider';

/**
 * Social Share Provider - Interacts with Social Network Sharing Features
 * @extends Provider
 */
class SocialShareProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * Share URL On Facebook - Opens a 'Share On Facebook' Window
   * @param  {String} url               URL for sharing
   * @param  {String} [display='popup'] Type of interaction with the user
   * @return {void}
   */
  shareUrlOnFacebook(url, display = 'popup') {
    window.FB.ui({
      method: 'share',
      display: display,
      href: url
    }, (response) => {
      // Do stuff with response...
    });
  }

  /**
   * Share Picture On Faceboo - Opens a 'Share on Facebook' Window
   * @param  {String} imageUrl                 Location of the image
   * @param  {String} [hashtag="#CosmoQuestX"] Optional Hash to include with the post
   * @param  {String} [quote=""]               Optional Quote for the image
   * @param  {String} [display="popup"]        How to open the share window
   * @return {void}
   */
  sharePictureOnFacebook(imageUrl, hashtag = "#CosmoQuestX", quote = "", display = "popup") {
    window.FB.ui({
      method: 'share',
      display: display,
      hashtag: hashtag,
      quote: quote,
    }, (response) => {
      // Do stuff with response...
    });
  }

  /**
   * Share URL On Twitter - Opens a 'Share on Twitter' Window
   * @param  {String} url                 URL for Sharing
   * @param  {String} [text='']           Optional tweet content
   * @param  {String} [via='CosmoQuestX'] Optional Twitter account to reference
   * @return {void}
   */
  shareUrlOnTwitter(url, text = '', via = 'CosmoQuestX') {
    let full_url = `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${via}`;
    window.open(full_url, "_blank", "location=yes,height=570,width=520,status=yes");
  }

  /**
   * Share URL On Google Plus - Opens a 'Share on G+' Window
   * @param  {String} url URL for Sharing
   * @return {void}
   */
  shareUrlOnGooglePlus(url) {
    let full_url = `https://plus.google.com/share?url=${url}`;
    window.open(full_url, "_blank", "location=yes,height=570,width=520,status=yes");
  }
}
export default SocialShareProvider;
