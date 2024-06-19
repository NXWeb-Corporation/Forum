<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
const router = useRouter();
let urlParams = new URLSearchParams(window.location.search);
if(urlParams.get("redirect")){
  router.push({ path: urlParams.get("redirect") });
}

</script>

<template>
  <nav class="bg-nav-bg">
    <div class="flex flex-nowrap items-center justify-between p-5">
      <div class="space-x-5">
        <RouterLink class="mx-2 font-rubik text-5xl text-title-blue" to="/">Home</RouterLink>
        <RouterLink class="font-poppins text-3xl text-white hover:text-darker-blue" to="/login">Login</RouterLink>
      </div>
      <div>
        <!-- <img class="size-14 cursor-pointer" @click="this.$emit('switch','settings')" src="/pics/settings.png"> -->
      </div>
    </div>
  </nav>
  <RouterView />
</template>
