/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
// Import Bootstap
require("./bootstrap");

// Import Vue
window.Vue = require("vue");

import Gate from './Gate';
Vue.prototype.$get = new Gate(window.user);

// Import VueRouter
import VueRouter from "vue-router";
Vue.use(VueRouter);

// Define paths
const routes = [
    { path: "/dashboard", component: require("./components/Dashboard.vue").default },
    { path: "/profile", component: require("./components/Profile.vue").default },
    { path: "/developer", component: require("./components/Developer.vue").default },
    { path: "/users", component: require("./components/Users.vue").default },
    { path: "/*", component: require("./components/NotFound.vue").default },
];

// Import VForm Libary
import { Form } from "vform";
import { HasError, AlertError } from "vform/src/components/bootstrap5";

// Define VForm  Global
window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

// Import Moment Fromat Date Libary
import moment from "moment";

// Import Sweetalert2
import Swal from "sweetalert2";
window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});
window.Toast = Toast;

// Import Vue Progress Bar Global
import VueProgressBar from "vue-progressbar";
import Vue from 'vue';
Vue.use(VueProgressBar, {
    color: "rgb(143, 255, 199)",
    failedColor: "red",
    height: "3px",
    transition: {
        speed: "0.5s",
        opacity: "0.6s",
        termination: 300
    }
});

const router = new VueRouter({
    mode: "history",
    routes,
});

// global filters 
Vue.filter("capitalize", function (value) {
    if (!value) return "";
    value = value.toString();
    value = value.trim();
    return value.charAt(0).toUpperCase() + value.slice(1);
});
Vue.filter("myDate", function (value) {
    return moment(value).format("MMMM Do YYYY, h:mm:ss a");
});

window.Fire = new Vue();

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context("./", true, /\.vue$/i);
// files.keys().map(key =>
//     Vue.component(
//         key
//             .split("/")
//             .pop()
//             .split(".")[0],
//         files(key).default
//     )
// );

Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

Vue.component(
    'not-found',
    require('./components/NotFound.vue').default
);
Vue.component('pagination', require('laravel-vue-pagination').default);
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: "#app",
    router,
    data:{
        searchV:''
    },
    methods:{
        search(){
            Fire.$emit('searching');
        }
    }
});
