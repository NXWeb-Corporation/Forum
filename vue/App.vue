<script setup>
import { onMounted, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import axios from 'axios';
import { store } from '@/assets/store';

const route = useRoute();

async function check() {
  let session = localStorage.getItem("session");
  if (session) {
    let response = await axios.post("/api/user", {
      session: session
    });
    store.username = response.data;
  } else store.username = null;
}

onMounted(() => {
  check();
  watch(() => route.path, () => {
    check();
  });
});
</script>

<template>
  <nav class="bg-nav-bg">
    <div class="flex flex-nowrap items-center justify-between p-5">
      <div class="space-x-5">
        <RouterLink class="mx-2 font-rubik text-5xl text-title-blue no-underline" to="/">Home</RouterLink>
      </div>
      <div>
        <RouterLink v-if="!store.username" class="font-poppins text-3xl text-white hover:text-darker-blue no-underline"
          to="/login">Login
        </RouterLink>
        <RouterLink v-if="store.username" class="font-poppins text-3xl text-white hover:text-darker-blue no-underline"
          :to="`/profile/${store.username}`"> {{ store.username }}
        </RouterLink>
      </div>
    </div>
  </nav>
  <RouterView />
</template>
