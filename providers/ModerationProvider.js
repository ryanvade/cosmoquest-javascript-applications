// ModerationProvider.js
// Created by Ryan Owens

import Provider from './Provider';
/**
 * ModerationProvider - Interacts with the Moderation API
 * @extends Provider
 */
class ModerationProvider extends Provider {
  constructor() {
    super();
  }

  /**
   * Can Moderate - Determines if a given user can moderate the given item
   * @param  {User} user          User to check permissions for
   * @param  {Any} [item=null]    Item to check permissions for
   * @return {Boolean}            Whether the user can moderate the item
   */
  canModerate(user, item = null) {
    if (user == null || user == undefined) {
      return false;
    }

    let hasSpecialRole = this.hasRole(user, 'SITE_ADMIN') ||
      this.hasRole(user, 'FORUM_ADMIN') ||
      this.hasRole(user, 'FORUM_MOD');

    if (item != null) {
      return item.user_id == user.id || hasSpecialRole;
    }
    return hasSpecialRole;
  }

  /**
   * Has Role - Checks if the user has the given role
   * @param  {User}  user   User to check roles for
   * @param  {String}  role Role to check for
   * @return {Boolean}      Whether the user has the role
   */
  hasRole(user, role) {
    let found = null;
    found = user.roles.find((Role) => {
      return Role.name == role;
    });
    return found != null;
  }
}

/**
 * https://webpack.js.org/api/module-methods/#export
 */
export default ModerationProvider;
