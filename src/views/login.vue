<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter()
const email = ref('');
const username = ref('');
const password = ref('');
const header = ref("Login")
const button = ref("Sign Up")
const respond = ref(null)
var location = "login"

function toggle(idk) {
  if (idk === "Sign Up") {
    header.value = "Sign Up"
    button.value = "Login"
    location = "signup"
  }
  else {
    header.value = "Login"
    button.value = "Sign Up"
    location = "login"
  }
}

async function post() {
  let response = await axios.post(`/${location}`, {
    email: email,
    username: username,
    password: password
  })
  if (response.data.includes("successful")) {
    router.push({ path: '/' });
    let uuid = response.data.replace("successful", '');
    window.sessionStorage.setItem("session", uuid);
  } else if (response.data.includes("created")) {
    location = "login";
    post();
  } else respond.value = response.data
};
</script>

<template>
  <div class="h-fit flex justify-center items-center flex-col m-24">
    <div class="bg-nav-bg p-2 py-0 rounded-xl">
      <div>
        <h1 class="text-5xl m-6 text-darker-blue text-center font-poppins">{{ header }}</h1>
        <h2 class="text-red-600 m-2 text-center" v-if="respond">{{ respond }}</h2>
      </div>
      <form @submit.prevent="post">
        <div>
          <input class="rounded-xl m-2 w-buttonr h-12 text-3xl outline-blue-500 outline-8 text-center"
            v-if="header === 'Sign Up'" v-model="email" placeholder="Email" required>
        </div>
        <div>
          <input class="rounded-xl m-2 w-buttonr h-12 text-3xl outline-blue-500 outline-8 text-center"
            v-model="username" placeholder="Username" required>
        </div>
        <div>
          <input class="rounded-xl m-2 w-buttonr h-12 text-3xl outline-blue-500 outline-8 text-center"
            v-model="password" placeholder="Password" type="password" required>
        </div>
        <button type="submit"
          class="rounded-xl m-2 bg-darker-blue font-rubik text-4xl text-center text-white w-buttonr h-12  hover:bg-darkerer-blue">Submit</button>
      </form>
      <button class="text-white hover:text-blue-600 m-2" @click="toggle(button)">{{ button }}</button>
    </div>
  </div>
</template>