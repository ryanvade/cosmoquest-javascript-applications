// applauncher.js
// By Ryan Owens

require('./bootstrap');

if(!!document.getElementById('app-launcher'))
{
  const applauncher = new window.Vue({
    el: '#app-launcher',
    components: {
      'applauncher': require('./components/AppLauncher/AppLauncher.vue')
    }
  });
}
