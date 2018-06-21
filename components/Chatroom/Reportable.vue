<template lang="html">
    <div class="" style="display:inline;">
        <button type="button" name="report" class="discussion-control-btn" v-on:click="toggleReporting">Report</button>

        <modal v-show="reporting" @close="toggleReporting">
            <h3 slot="header">Report</h3>
            <div class="form" slot="body">
                <div class="form-group">
                    <label for="reason" style="color: rgb(153, 153, 153);">Reason for reporting <div class="required">*</div></label>
                    <!-- <input type="text" name="reason" value="" class="form-control" v-model="reason"> -->
                    <select class="form-control" name="reason" v-model="reason">
                      <option value=""></option>
                      <option value="spam">Spam</option>
                      <option value="language">Foul Language</option>
                      <option value="innapropriate-content">Innapropriate Content</option>
                      <option value="illegal-content">Illegal Content</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="description" style="color: rgb(153, 153, 153);">Description of issue </label>
                    <textarea name="description" rows="8" cols="80" class="form-control" v-model="description"></textarea>
                </div>
            </div>
            <div slot="footer">
                <button type="button" name="cancel-relpy" class="discussion-control-btn" v-on:click="toggleReporting()">Cancel</button>
                <button type="button" name="submit-reply" class="discussion-control-btn" v-on:click="report()">Submit</button>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../Util/Modal.vue';
import ReportProvider from '../../providers/ReportProvider';

export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['type', 'id'],
  /**
   * Components - List of other used components
   * @type {Object}
   */
  components: {
    modal
  },
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      reporting: false,
      reason: '',
      description: '',
      reportProvider: new ReportProvider()
    };
  },
  methods: {
    /**
     * Toggle Reporting - Shows/Hides the Report Form
     * @return {void}
     */
    toggleReporting() {
      this.reporting = !this.reporting;
      this.reason = '';
      this.description = '';
    },
    /**
     * Report - Creates a Report
     * @return {void}
     */
    report() {
      if (this.reason == '') {
        flash('A reason is required.', 'error');
        return;
      }
      this.reportProvider.createReport(this.type, this.id, this.reason, this.description).then((response) => {
        flash('Report sent', 'success');
        this.toggleReporting();
      }).catch((error) => {
        flash(`Unable to report the ${type}`, 'error');
        this.toggleReporting();
      });
    }
  },

}
</script>

<style lang="css">
</style>
