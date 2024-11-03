<script setup>
import { onMounted, watch, ref } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { store } from '@/assets/store';

const router = useRouter();
const route = useRoute();
const dropdown = ref(false);

async function check() {
  let response = await axios.get("/api/user");
  store.username = response.data;
}

async function logout() {
  let response = await axios.post('/api/logout')
  if (response.data === "successful") {
    store.username = null;
    router.push({ path: '/' });
  }
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
        <div v-if="store.username" @click="dropdown = !dropdown" class="fixed right-5 top-8 z-10">
          <h1 class="font-poppins text-3xl text-white hover:text-darker-blue hover:cursor-pointer">{{
            store.username }}
          </h1>
          <div v-if="dropdown" class="flex flex-col items-center bg-slate-800 rounded-md p-2">
            <RouterLink class="font-poppins text-2xl text-white hover:text-darker-blue no-underline"
              :to="`/profile/${store.username}`">Profile</RouterLink>
            <button @click="logout()" class="font-poppins text-2xl text-white hover:text-darker-blue">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <RouterView />
</template>
