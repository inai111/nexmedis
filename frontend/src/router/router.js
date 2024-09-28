import SignIn from "../components/SignIn.vue";
import {createRouter, createWebHistory} from 'vue-router';
import SignUp from "../components/SignUp.vue";
import Home from "../components/Home.vue"

const routes = [
    {
        path:'/',
        name:'Home',
        component: Home
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

router.beforeEach((to, from, next)=>{
    console.log(`; ${document.cookie}`)
    next();
})

export default router;