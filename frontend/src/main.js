import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import router from './router/router.js';


const pinia = createPinia();

createApp(App)
.use(router)
.use(pinia)
.mount('#app')
