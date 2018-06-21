<template lang="html">
    <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">

            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">

            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
              <button class="modal-default-button" v-on:click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
}
</script>

<style lang="css">
.modal-enter-active, .modal-leave-active {
  transition: opacity .5s
}
.modal-enter, .modal-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
