import { defineStore } from "pinia";

export default userStore = defineStore('user',()=>{
    const login = ref(false);

    function signIn(data){
        login = true;
    }

    function signOut(){

    }

    return {
        login,
        username:'',
        signIn,
        signOut
    }
});