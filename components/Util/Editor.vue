<template>
<textarea :id="selector" class="form-control" :name="formname" required>{{ textvalue }}</textarea>
</template>

<script>
import tinymce from 'tinymce';

export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['selector', 'textvalue', 'enabled', 'formname'],
  watch: {
    /**
     * Value - Triggers the change event when the editor changes
     * @return {void}
     */
    value() {
      this.$emit(`change`, this.value);
    },
  },
  /**
   * Data - Returns the components used values
   * @return {Dictionary}
   */
  data() {
    return {
      value: "",
    };
  },
  /**
   * Mounted - Runs after the components 'mounted' lifecycle event
   * @return {void}
   */
  mounted: function() {
    let self = this;
    tinymce.init({
      selector: `#${this.selector}`,
      menubar: false,
      branding: false,
      plugins: 'link image media emoticons',
      image_caption: true,
      browser_spellcheck: true,
      //   toolbar: 'bold italic underline | bullist numlist',
      toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent |  emoticons',
      setup(editor) {
        // editor.settings.readonly = (this.enabled == 'false');
        editor.on('keyup', () => {
          self.value = editor.getContent();
        });
        editor.on('NodeChange', () => {
          self.value = editor.getContent();
        });
      }
    });
  },
}
</script>
