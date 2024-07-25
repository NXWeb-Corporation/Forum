<script setup>
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import axios from 'axios';

const router = useRouter();

const stuff = reactive({
  email: '',
  username: '',
  password: '',
  header: 'Login',
  button: 'Sign Up',
  respond: null
});

var select = "login"

function toggle(idk) {
  let isSignUp = idk === "Sign Up";
  stuff.header = isSignUp ? "Sign Up" : "Login";
  stuff.button = isSignUp ? "Login" : "Sign Up";
  select = isSignUp ? "signup" : "login";
}

async function post() {
  let response = await axios.post(`/api/${select}`, {
    email: stuff.email,
    username: stuff.username,
    password: stuff.password
  })
  if (response.data.includes("successful")) {
    let uuid = response.data.replace("successful", '');
    localStorage.setItem("session", uuid);
    router.push({ path: '/' });
  } else if (response.data.includes("created")) {
    select = "login";
    post();
  } else stuff.respond = response.data
};
</script>

<template>
  <div class="h-fit flex justify-center items-center flex-col m-24">
    <div class="bg-nav-bg p-2 py-0 rounded-xl">
      <div>
        <h1 class="text-5xl m-6 text-darker-blue text-center font-poppins">{{ stuff.header }}</h1>
        <h2 class="text-red-600 m-2 text-center" v-if="stuff.respond">{{ stuff.respond }}</h2>
      </div>
      <form @submit.prevent="post">
        <div>
          <input class="rounded-xl m-2 w-buttonr h-12 text-3xl outline-blue-500 outline-8 text-center"
            v-if="stuff.header === 'Sign Up'" v-model="stuff.email" placeholder="Email" required>
        </div>
        <div>
          <input class="rounded-xl m-2 w-buttonr h-12 text-3xl outline-blue-500 outline-8 text-center"
            v-model="stuff.username" placeholder="Username" required>
        </div>
        <div>
          <input class="rounded-xl m-2 w-buttonr h-12 text-3xl outline-blue-500 outline-8 text-center"
            v-model="stuff.password" placeholder="Password" type="password" required>
        </div>
        <button type="submit"
          class="rounded-xl m-2 bg-darker-blue font-rubik text-4xl text-center text-white w-buttonr h-12  hover:bg-darkerer-blue">Submit</button>
      </form>
      <button class="text-white hover:text-blue-600 m-2" @click="toggle(stuff.button)">{{ stuff.button }}</button>
    </div>
  </div>
</template>