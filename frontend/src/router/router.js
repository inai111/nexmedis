import SignIn from "../components/SignIn.vue";
import {createRouter, createWebHistory} from 'vue-router';
import SignUp from "../components/SignUp.vue";

const routes = [
    {
        path:'/',
        name:'Home',
        component: SignIn
    },
    {
        path:'/signin',
        name:'signin',
        component: SignIn
    },
    {
        path:'/signup',
        name:'signup',
        component: SignUp
    },
];

const router = createRouter({
    history:createWebHistory(),
    routes
});

export default router;