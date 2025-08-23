<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
    <div id="app" class="min-h-screen flex flex-col">
        <Header />
        <main class="flex-1">
            <router-view></router-view>
        </main>
        <Footer />
    </div>
</template>

<style scoped>
/* Ensure the app takes full height */
#app {
    min-height: 100vh;
}

/* Add top padding to account for fixed header */
main {
    padding-top: 80px; /* Account for fixed header height */
}

/* Smooth scrolling for the entire page */
html {
    scroll-behavior: smooth;
}

/* Ensure proper stacking context */
#app {
    position: relative;
    z-index: 1;
}
</style>
