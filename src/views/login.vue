<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const username = ref('');
const password = ref('');
const header = ref("Login")
const button = ref("Sign Up")
const respond = ref(null)
var location = "login"

function toggle(idk) {
  if(idk === "Sign Up"){
    header.value = "Sign Up"
    button.value = "Login"
    location = "signup"
  }
  else{
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
  respond.value = response.data
}
</script>

<template>
  <h1>{{ header }}</h1>
  <h2 v-if="respond">{{ respond }}</h2>
  <form @submit.prevent="post">
    <input v-if="header === 'Sign Up'" v-model="email" placeholder="Email" required>
    <input v-model="username" placeholder="Username" required>
    <input v-model="password" placeholder="Password" type="password" required>
    <button type="submit">Submit</button>
  </form>
  <button @click="toggle(button)">{{ button }}</button>
</template>