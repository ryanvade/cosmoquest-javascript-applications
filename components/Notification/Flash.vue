<template>
<transition name="slide-fade">
  <div :class="className" role="alert" v-if="show">
    <div class="" style="width: 100%; display: block; overflow: hidden;">
      <button v-on:click="hide" style="background-color: transparent; border: none; float: right;">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
    </div>
    <div class="" style="display: flex; align-items: center;">
      <div style="font-size: 2em; display: flex; padding-right: 5px; martin-top: 2px;">
        <span :class="glyphicon" aria-hidden="true"></span>
      </div>
      <div style="font-size: 2em;">
        {{ body }}
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['message', 'type'],
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      body: '',
      show: false,
      className: '',
      glyphicon: '',
    }
  },
  /**
   * Created - Runs when the 'created' lifecycle event is triggered
   * @return {void}
   */
  created() {
    if (this.message && this.type) {
      this.flash(this.message, this.type);
    }

    window.events.$on(
      'flash-success', message => this.flash(message, 'success')
    );

    window.events.$on(
      'flash-error', message => this.flash(message, 'error')
    );

    window.events.$on(
      'flash-info', message => this.flash(message, 'info')
    );

    window.events.$on(
      'flash-warning', message => this.flash(message, 'warning')
    );
  },

  methods: {
    /**
     * Flash - Displays a message of the given type
     * @param  {String} message content of message
     * @param  {String} type    message class type
     * @return {void}
     */
    flash(message, type) {
      this.body = message;
      this.show = true;
      type = type.toLowerCase();
      this.className = `alert ${type}-alert alert-flash`;
      switch (type) {
        case 'error':
          this.glyphicon = 'glyphicon glyphicon-exclamation-sign';
          break;
        case 'warning':
          this.glyphicon = 'glyphicon glyphicon-warning-sign';
          break;
        case 'info':
          this.glyphicon = 'glyphicon glyphicon-info-sign';
          break;
        case 'success':
          this.glyphicon = 'glyphicon glyphicon-ok-sign';
          break;
        default:
          this.glyphicon = 'glyphicon glyphicon-star';
          break;
      }

      setTimeout(() => {
        this.show = false;
      }, 5000);
    },
    /**
     * Hide - Disables the flash message
     * @return {void}
     */
    hide() {
      this.show = false;
    }
  }
};
</script>

<style>
.slide-fade-enter-active {
  transition: all .4s ease;
}

.slide-fade-leave-active {
  /*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
  transform: translateX(10px);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */

  {
  transform: translateX(10px);
  opacity: 0;
}

.close-button {
  padding-left: 5px;
}
</style>
