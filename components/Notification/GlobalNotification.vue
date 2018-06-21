<template lang="">
<div>
    <div class="global-notification-outer" v-if="display && currentNotification">
        <button type="button" @click="dismiss" class="global-notification-close">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </button>
        <div class="global-notification" v-html="currentNotification.message">
        </div>
    </div>
</div>
</template>

<script>
import clientStore from 'localforage';
export default {
    data() {
        return {
            lastUpdate: -1,
            currentNotification: false,
            dismissedNotifications: [],
            display: false,
        }
    },
    created() {
        let self = this;
        // if past 1 hour since last update, get global notification from server
        clientStore.getItem('globalNotifcationLastUpdate', (err, value) => {
            if (err) {
                console.error(err);
                return -1;
            }

            self.lastUpdate = value;
            if (value == null) {
                // get from server
                self.getNotificationFromServer();
            } else {
                // get from client store
                self.getNotificationFromStorage();
            }

            if (!this.currentNotification && this.currentNotification == null) return; // done
            // check if the user has already dismissed the notification, if so don't
            clientStore.getItem('dismissedNotifications', (err, value) => {
                if (err) {
                    console.error(err);
                    return -1;
                }
                self.dismissedNotifications = (value == null) ? [] : value;
                if (this.hasSeenNotification(this.currentNotification)) {
                    // don't display it
                    this.display = false;
                } else {
                    // display it
                    this.display = true;
                }
            });
        });
        if (!window.socket) {
            window.socket = io(`${window.location.origin}:3000`, {
                secure: true
            });
            window.socket.on('connect', function(socket) {
                console.log('Connected to server');
            });
        }
        window.socket.on(`globalnotification`, (data) => {
            self.display = false;
            self.currentNotification = data.notification;
            console.log("Current Notification Message " + self.currentNotification.message);
            clientStore.setItem('currentGlobalNotification', data.notification)
            .then(() => {
                console.log("Set Global Notification in Client Storage");
            }).catch((err) => {
                console.error(err);
            });
            if (self.hasSeenNotification(self.currentNotification)) {
                // don't display it
                self.display = false;
            } else {
                // display it
                self.display = true;
            }
        });
    },
    methods: {
        getNotificationFromServer() {
            let self = this;
            let JQ = (window.jQuery) ? jQuery : $;
            JQ.getJSON("/api/notifications/global", (data) => {
              if(data.length > 0)
              {
                this.currentNotification = data[0];
                this.lastUpdate = new Date();
                console.log("Notification from server: " + data);
                clientStore.setItem('currentGlobalNotification', data).then(() => {
                  console.log("Set Global Notification in Client Storage");
                }).catch((err) => {
                  console.error(err);
                });
              }
            }).fail(() => {
                console.error("Unable to get Global Notification from Servere")
            });

            this.lastUpdate = new Date();
            clientStore.setItem('globalNotifcationLastUpdate', this.lastUpdate).then(() => {
                console.log("Set Global Notification Last Udate in Client Store");
            }).catch((err) => {
                console.error(err);
            });

        },
        getNotificationFromStorage() {
            let currentTime = new Date();
            let self = this;
            if (currentTime - this.lastUpdate > 3600000) {
                this.getNotificationFromServer();
            } else {
                clientStore.getItem('currentGlobalNotification', (err, value) => {
                    if (err) {
                        console.error(err);
                        return -1;
                    }
                    self.currentNotification = (value != null && value.length > 0)? value[0] : false;
                });
            }
        },
        hasSeenNotification(currentNotification) {
            let seen = false;
            this.dismissedNotifications.forEach((notification) => {
                if (currentNotification && notification.id == currentNotification.id) {
                    seen = true;
                }
            });
            return seen;
        },
        dismiss() {
            this.dismissedNotifications.push(this.currentNotification);
            this.display = false;
            this.currentNotification = false;
            clientStore.setItem('dismissedNotifications', this.dismissedNotifications).then(() => {
                console.log("updated dismissed notifications in client store");
            });
            console.log(this.dismissedNotifications);
        }
    }
}
</script>

<style lang="css">
    .global-notification-outer {
        position: fixed;
        bottom: 20px;
        left: 30%;
        min-width: 40%;
        height: 50px;
        color: white;
        background-color: #222;
        z-index: 9004;
    }

    .global-notification {
        margin-left: 25%;
        margin-right: 25%;
        text-align: center;
        margin-top: 15px;
    }

    .global-notification-close {
        position: relative;
        float: right;
        margin-right: 15px;
        margin-top: 10px;
        background-color: transparent;
        border: none;
    }

</style>
