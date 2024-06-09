<script setup>
import { ref } from 'vue';
import axios from 'axios';

const title = ref('');
const description = ref('');
const respond = ref(null)
const emits = defineEmits(['successful']);

async function post() {
  let session = window.sessionStorage.getItem("session")
  let response = await axios.post("/api/newpost", {
    title: title,
    description: description,
    session: session
  })
  if (response.data.includes("successful")) {
    emits("successful");
  } else respond.value = response.data
}
</script>
<template>
  <div class="h-half flex justify-center items-center flex-col m-24">
    <div class="bg-nav-bg p-2 py-0 rounded-xl">
      <div class="text-5xl m-6 text-darker-blue text-center font-poppins">Create a post</div>
      <h2 class="text-red-600 m-2 text-center" v-if="respond">{{ respond }}</h2>
      <form @submit.prevent="post">
        <div>
          <input required v-model="title" class="rounded-xl m-2 w-buttonr h-12 text-3xl outline-blue-500 outline-8 text-start indent-1"
            placeholder="Title">
        </div>
        <div>
          <textarea required v-model="description" class="rounded-lg m-2 w-buttonr h-64 text-lg outline-blue-500 outline-8 text-start"
            placeholder="Description"></textarea>
        </div>
        <button
          class="rounded-xl m-2 bg-darker-blue font-rubik text-4xl text-center text-white w-buttonr h-12  hover:bg-darkerer-blue">Submit</button>
      </form>
    </div>
  </div>
</template>