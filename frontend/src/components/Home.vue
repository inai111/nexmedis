<script>
import axios from 'axios';
// import { userStore } from '../stores/userStore';
import { postStore } from '../stores/postStore';
import { ref } from 'vue';
import Navbar from './Navbar.vue';

export default {
    data() {
        // const userS = userStore();
        const postS = postStore();
        const posts = postS.posts;
        console.log(posts.value)

        return {
            postS, posts
        }
    },
    components:{
        Navbar
    },
    mounted() {
        this.postS.fetchPosts();
    },
    methods: {
        submitLogin() {
            axios({
                method: "POST",
                url: 'http://localhost:3000/login',
                data: {
                    username: this.username,
                    password: this.password
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
            })
                .then((response) => {
                    this.error = false;
                    this.message = response.data.message ?? '';
                })
                .catch((error) => {
                    let res = error.response;
                    this.error = true;
                    this.message = res.data.message;
                    this.errors = res.data.errors ?? [];
                });
        }
    }
}


</script>

<template>
    <div class="container my-3">
        <Navbar />
        <div class="row gap-3">
            <div class="col-12">
                <div class="card border-0 shadow">
                    <div class="card-body">
                        <div class="mb-2" style="height:50px">
                            <div class="d-flex gap-2 align-items-center">
                                <img src="https://pbs.twimg.com/media/EjYkG5GXYAANdYH?format=jpg&name=medium"
                                    class="rounded-circle" style="height:50px;width:50px;object-fit:cover;" alt="">
                                <div><strong>ssmtbgss</strong></div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <p>asdasd asdasd asdasd asdasdasdasd asdasdasdasd asdasdasdasd asdasdasdasd asdasdasdasd
                                asdasdasdasd asdasdasdasd asdasd</p>
                        </div>
                        <!-- <div class="border" style="height:400px"></div> -->
                        <div class="d-flex gap-2 mt-1">
                            <button class="btn border-0 p-0 align-items-center" style="display:inline-flex">
                                <i class="fa-regular fa-thumbs-up" style="font-size:25px;width:40px;"></i>
                                200000
                            </button>
                            <button class="btn border-0 p-0 align-items-center" style="display:inline-flex;">
                                <i class="fa-regular fa-comment" style="font-size:25px;width:40px"></i>
                                200000000
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card border-0 shadow">
                    <div class="card-body">
                        <div class="mb-2" style="height:50px">
                            <div class="d-flex gap-2 align-items-center">
                                <img src="https://pbs.twimg.com/media/EjYkG5GXYAANdYH?format=jpg&name=medium"
                                    class="rounded-circle" style="height:50px;width:50px;object-fit:cover;" alt="">
                                <div><strong>ssmtbgss</strong></div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <p>asdasd asdasd asdasd asdasdasdasd asdasdasdasd asdasdasdasd asdasdasdasd asdasdasdasd
                                asdasdasdasd asdasdasdasd asdasd</p>
                        </div>
                        <!-- <div class="border" style="height:400px"></div> -->
                        <div class="d-flex gap-2 mt-1">
                            <button class="btn border-0 p-0">
                                <i class="fa-regular fa-thumbs-up" style="font-size:25px;width:40px;"></i>
                            </button>
                            <button class="btn border-0 p-0">
                                <i class="fa-regular fa-comment" style="font-size:25px;width:40px"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pad-up {
    padding-top: 20vh;
}

.heigh-full {
    height: 30vh;
}
</style>