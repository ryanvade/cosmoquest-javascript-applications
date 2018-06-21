<template id="">
<div class="">
  <div class="loading" v-if="loading">
    <!--something for loading -->
  </div>
  <div class="" v-if="!loading">
    <div class="mobileInputContainer" v-if="isMobile">
      <div class="mobileEmailSent" v-if="sent">
      </div>
      <div class="mobileEmailEntry" v-if="!sent">
        <div class="">
          <div>The CosmoQuest Citizen Science Applications are not available on Mobile Devices. Would you like us to send you an email reminder to checkout this page on a desktop?</div>
        </div>
        <div class="previousEmail" v-if="previousEmail">
          A previous email was sent to {{previousEmail}}.
        </div>
        <div class="emailEntry">
          <!-- EMAIL ENTRY BOX AND BUTTON -->
          <span class="input-error" v-if="inputError" v-text="inputError"></span>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="example@example.org" v-model="email">
            <span class="input-group-btn">
              <button id="unlock" class="btn btn-default submitbtn" type="submit" @click="sendEmail">Submit</button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="buttonContainer" v-if="!isMobile">
      <button type="button" class="applaunchbutton" @click="launchTool">{{buttontext}}</button>
    </div>
  </div>
</div>
</template>

<script>
import clientStore from 'localforage';

export default {
  /**
   * Props - Array of input variables
   * @type {Array}
   */
  props: ['name', 'buttontext'],
  /**
   * Data - Returns the components variables
   * @return {Dictionary}
   */
  data() {
    return {
      email: "",
      previousEmail: false,
      url: "",
      loading: true,
      isMobile: false,
      sent: false,
      inputError: false,
    }
  },
  /**
   * Created - fires after the components 'created' lifecycle event
   * @return {void}
   */
  created() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini|Mobile/i.test(navigator.userAgent);
    this.url = window.location.href;
    this.getPreviousEmail();
  },
  methods: {
    /**
     * Launch Tool - Loads and displays the current CSB App
     * @return {void}
     */
    launchTool() {
      let tool = this.name;
      let url = (tool == "detectives") ? `/${tool}` : `/app/${tool}`;
      $("#app-holder").load(url);
    },
    /**
     * Send Email - Requests a reminder to be sent to the user
     * @return {void}
     */
    sendEmail() {
      if (this.isValidEmail(this.email)) {
        let self = this;
        let data = {
          email: this.email,
          tool: {
            name: this.name,
            url: this.url
          }
        };
        window.axios.post('/api/tool/reminder', data).then((response) => {
          self.sent = true;
          self.savePreviousEmail();
          flash("Email Sent!", "info");
        }).catch((error) => {
          flash("Sorry, unable to send the email. Please try again later.", "error");
        });
      }
    },
    /**
     * Save Previous Email - Stores the used email to the Client Store
     * @return {void}
     */
    savePreviousEmail() {
      let name = this.name;
      clientStore.setItem(`previousemail-${name}`, this.email).then((data) => {
      }).catch((err) => {
        console.error(err);
      });
    },
    /**
     * Get Previous Email - Retrieves the last email used from the Client Store
     * @return {void}
     */
    getPreviousEmail() {
      let self = this;
      let name = this.name;
      clientStore.getItem(`previousemail-${name}`, (err, value) => {
        if (err) {
          console.error(err);
          return -1;
        }
        self.previousEmail = value;
        self.loading = false;
      });
    },
    /**
     * Is Valid Email - Checks if the given string is a valid email address
     * @param  {String}  email String to check
     * @return {Boolean}       Whether the string is valid
     */
    isValidEmail(email) {
      if (email.length == 0) {
        this.inputError = "An email address is required.";
        return false;
      }

      if (!/\b[a-z0-9-_.]+@[a-z0-9-_.]+(\.[a-z0-9]+)+/i.test(email)) {
        this.inputError = "A valid email address is required.";
        return false;
      }
      this.inputError = false;
      return true;
    }
  }
}
</script>

<style>
.applaunchbutton {
  color: white;
  background: #19807F;
  padding: 10px;
  font: normal 1.1em 'Open Sans', Helvetica, Arial, sans-serif;
  margin: 14px 2px;
  border: 0px;
  border-radius: 1px;
}

.mobileInputContainer {
  max-width: 500px;
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;
}

.emailEntry {
  margin-top: 15px;
}

.submitbtn {
  color: #111;
}

.input-error {
  color: #a94442;
}

.mobileEmailSent {
  font-weight: bold;
  color: #19807F;
}
</style>
