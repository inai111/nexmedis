<template>
    <nav class="navbar navbar-expand-lg bg-body-light mb-3">
        <div class="container-fluid">
            <router-link class="navbar-brand fw-bold fs-2" :to="{ name: 'Home' }">NEXMEDIS</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link fw-bold" aria-current="page" :to="{ name: 'signin' }">Sign
                            In</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script >
export default {
  data() {
    return {}
  }
}
</script>