<script setup>
import { onMounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { store } from '@/assets/store.js';

const route = useRoute();
const stuff = reactive({
  profile: { username: "", time: "", description: "" },
  error: null,
  editdesc: false,
  desc: "",
  descbutton: "Edit"
});

async function data() {
  let response = await axios.get(`/api/profile/${route.params.username}`);
  if (response.data === "No account found") stuff.error = response.data;
  else {
    stuff.profile = response.data;
    stuff.desc = stuff.profile.description;
  }
};
async function post() {
  let response = await axios.post('/api/profile/edit', {
    description: stuff.desc,
  });
  if (response.data.includes("successful")) {
    stuff.error = null;
    editdescription()
    data();
  } else stuff.error = response.data;
};

function editdescription() {
  stuff.editdesc = !stuff.editdesc;
  if (stuff.editdesc) stuff.descbutton = "Cancel";
  else stuff.descbutton = "Edit";
};

onMounted(() => {
  data();
  watch(() => route.path, () => {
    data();
  });
});

</script>
<template>
  <div class="bg-blue-700 text-white text-center p-5">
    <h1 class="text-5xl">{{ stuff.profile.username }}</h1>
    <h3 class="pt-5">Joined {{ stuff.profile.time }}</h3>
  </div>
  <h1 v-if="stuff.error" class="text-red-700 text-5xl text-center pt-2">{{ stuff.error }}</h1>
  <div class="bg-nav-bg p-4 pt-6 rounded-lg m-2 text-white break-words relative">
    <button v-if="stuff.profile.username === store.username" @click="editdescription" class="absolute right-5 top-1">{{
      stuff.descbutton
      }}</button>
    <p v-if="stuff.desc === '' && !stuff.editdesc">No description yet</p>
    <div v-if="stuff.desc != '' && !stuff.editdesc"
      v-html="DOMPurify.sanitize(marked.parse(stuff.profile.description))"></div>
    <form v-if="stuff.editdesc" @submit.prevent="post">
      <div class="relative">
        <textarea v-model="stuff.desc" placeholder="Description"
          class="rounded-lg h-48 w-full text-lg outline-blue-500 outline-8 text-start mt-3 text-black resize-none pb-8" maxlength="2000"></textarea>
          <span class="text-black absolute bottom-2 right-4">{{ stuff.desc.length }} / 2000</span>
      </div>
      <button
        class="rounded-xl bg-darker-blue font-rubik text-4xl text-center text-white h-12 w-full hover:bg-darkerer-blue">Submit</button>
    </form>
  </div>
</template>