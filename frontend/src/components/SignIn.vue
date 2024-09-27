<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            message: '',
            error: false,
            errors: []
        }
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
                    this.message = response.data.message??'';
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
    <div class="row justify-content-center heigh-full pad-up">
        <div class="col-lg-7">
            <div class="card shadows">
                <div class="card-body">
                    <div class="py-3 px-4">
                        <h1>Sign In</h1>
                        <template v-if="message">
                            <div class="alert alert-dismissible fade show"
                            :class="{'alert-warning':error,'alert-success':!error}" role="alert">
                                {{ message }}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close"></button>
                            </div>
                        </template>

                        <form @submit.prevent="submitLogin">
                            <div class="mb-3 form-group">
                                <label for="username">
                                    <strong>Username</strong>
                                </label>
                                <input type="text" v-model="username" class="form-control" id="username"
                                :class="{'is-invalid':errors['username']}">
                                <template v-if="errors['username']">
                                    <div class="invalid-feedback">
                                        {{ errors['username'][0] }}
                                    </div>
                                </template>
                            </div>
                            <div class="mb-3 form-group">
                                <label for="password">
                                    <strong>Password</strong>
                                </label>
                                <input type="password" v-model="password" class="form-control" id="password"
                                :class="{'is-invalid':errors['password']}">
                                <template v-if="errors['password']">
                                    <div class="invalid-feedback">
                                        {{ errors['password'][0] }}
                                    </div>
                                </template>
                            </div>
                            <div class="mb-3">
                                <button class="btn-primary btn fw-bold" type="submit">Sign In</button>
                            </div>
                            <div class="mb-1">
                                <router-link :to="{name:'signup'}">Create new account</router-link>
                            </div>
                        </form>
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