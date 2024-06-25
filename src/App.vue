<script setup>
import { onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const urlParams = new URLSearchParams(window.location.search);
const user = ref({ username: "Loading" });


if (urlParams.get("redirect")) {
  router.push({ path: urlParams.get("redirect") });
}

async function check() {
  let session = window.sessionStorage.getItem("session");
  if (session) {
    let response = await axios.post("/api/user", {
      session: session
    });
    user.value = response.data;
  } else user.value = null;
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
        <RouterLink v-if="!user" class="font-poppins text-3xl text-white hover:text-darker-blue no-underline"
          to="/login">Login
        </RouterLink>
        <RouterLink v-if="user" class="font-poppins text-3xl text-white hover:text-darker-blue no-underline"
          :to="`/profile/${user.username}`"> {{ user.username }}
        </RouterLink>
      </div>
    </div>
  </nav>
  <RouterView />
</template>
