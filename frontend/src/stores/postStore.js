import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const postStore = defineStore('posts', {
    state: () => ({
        posts: [],
    }),
    actions: {
        async fetchPosts() {
            try {
                const res = await axios({
                    method: "GET",
                    url: 'http://localhost:3000/posts',
                    headers: {
                        "Accept": "application/json",
                    }
                });
                this.posts = res.data.data.posts;
                console.log(res.data.data.posts);

            } catch (err) {
                console.log(err.message);
            }
        },
        async likeAction(idPost){
            try{

            }catch(err){
                if(err instanceof AxiosError){
                    if(err.status==401) {
                        // memunculkan pop up login
                    }
                }
            }
        }
    }
});