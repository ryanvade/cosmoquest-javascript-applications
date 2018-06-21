// SocketConnectionProvider.js
// Created by Ryan Owens

import Provider from './Provider';

/**
 * SocketConnectionProvider - Interacts with the global WebSocket connection
 * @extends Provider
 */
class SocketConnectionProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * New Reply Channel - Retrives the New Reply Channel
   * @return {SocketIoChannel} Channel
   */
  newReplyChannel() {
    return window.Echo.channel('newreply');
  }

  /**
   * New Discussion Channel - Retrives the New Discussion Channel
   * @return {SocketIoChannel} Channel
   */
  newDiscussionChannel() {
    return window.Echo.channel('newdiscussion');
  }

  /**
   * User Channel - Retrives the private notification channel for a user
   * @param  {User} user                User to retrieve the channel for
   * @return {SocketIoPrivateChannel}   Channel
   */
  userChannel(user) {
    return window.Echo.private('Csb.User.' + user.id);
  }

  /**
   * Chatroom Channel - Retrives the Chatroom Channel
   * @return {SocketIoChannel} Channel
   */
  chatroomChannel() {
    return window.Echo.channel('chatroom');
  }
}
/**
 * https://webpack.js.org/api/module-methods/#export
 */
export default SocketConnectionProvider;
