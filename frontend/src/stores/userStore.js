import { defineStore } from "pinia";

export default userStore = defineStore('user',()=>{
    return {
        login:false,
        username:'',
    }
});