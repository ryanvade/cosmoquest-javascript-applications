<template lang="html">
    <div class="">
        <div v-if="notificationCount < 1">
            <span>No notifications right now</span>
        </div>
        <div v-if="notificationCount >= 1">
            <h2>Notifications</h2>
            <div class="activity-feed">
                <div class="feed-item" v-for="notification in notifications" v-if="!notification.read">
                    <div class="date">{{ notification.created_at.DATE }}</div>
                    <div class="text" v-html="notification.message"></div>
                </div>
            </div>
            <button type="button" class="btn btn-primary" name="clear-notifications"
                    v-if="notifications.length >= 1" @click="clearNotifications">
                    clear notifications
            </button>
        </div>
    </div>
</template>

<script>
import clientStore from 'localforage';
export default {
    data() {
        return {
            notifications: [],
        }
    },
    computed :{
      notificationCount() {
        let count = 0;
        this.notifications.forEach((notification) => {
          if(!notification.read) count += 1;
        });
        return count;
      }
    },
    created() {
      console.log("Created Notification List");
        clientStore.getItem('notifications', (err, value) => {
            if (err) {
                console.error(err);
            }

            if (window.jQuery) {
                this.notifications = jQuery.map(value, (value, index) => {
                    return [value];
                });
            } else {
                this.notifications = $.map(value, (value, index) => {
                    return [value];
                });
            }
        });
        let name = window.user.name;
        window.socket.on(`notification:${name}`, (data) => {
            this.notifications.push(data.notification);
        });

        // Global notifications are put on the Front of the Array
        window.socket.on(`notification:global`, (data) => {
            this.notifications.unshift(data.notification);
        });
    },
    methods: {
        clearNotifications() {
            clientStore.removeItem('notifications', () => {
                console.log("Notifications cleared from client store");
            });
            this.notifications = [];
            window.events.$emit('cleared-notifications');
        }
    }
}
</script>

<style lang="css">
.activity-feed {
  padding: 15px;
}
.activity-feed .feed-item {
  position: relative;
  padding-bottom: 20px;
  padding-left: 30px;
  border-left: 2px solid #e4e8eb;
}
.activity-feed .feed-item:last-child {
  border-color: transparent;
}
.activity-feed .feed-item:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: -6px;
  width: 10px;
  height: 10px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #f37167;
}
.activity-feed .feed-item .date {
  position: relative;
  top: -5px;
  color: #8c96a3;
  text-transform: uppercase;
  font-size: 13px;
}
.activity-feed .feed-item .text {
  position: relative;
  top: -3px;
}
</style>
