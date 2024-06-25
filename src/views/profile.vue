<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import axios from 'axios';

const route = useRoute();
const profile = ref({ username: "", time: "", description: "", edit: false });
const error = ref(null);
const editdesc = ref(false);
const desc = ref("");
const descbutton = ref("Edit");

async function data() {
  let session = window.sessionStorage.getItem("session");
  let response = await axios.post(`/api/profile/${route.params.username}`, {
    session: session
  });
  profile.value = response.data;
  desc.value = profile.value.description;
};
async function post() {
  let session = window.sessionStorage.getItem("session");
  if (session) {
    let response = await axios.post(`/api/profile/edit/${route.params.username}`, {
      user: profile.value.username,
      description: desc.value,
      session: session
    });
    if (response.data.includes("successful")) {
      editdescription()
      data();
    } else error.value = response.data;
  } else error.value = "Please login";
};
function editdescription() {
  editdesc.value = !editdesc.value;
  if (editdesc.value) descbutton.value = "Cancel";
  else descbutton.value = "Edit";
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
    <h1 class="text-5xl">{{ profile.username }}</h1>
    <h3>Joined {{ profile.time }}</h3>
  </div>
  <h1 v-if="error" class="text-red-700 text-5xl text-center pt-2">{{ error }}</h1>
  <div class="bg-nav-bg p-4 rounded-lg m-2 text-white overflow-auto relative">
    <button v-if="profile.edit" @click="editdescription" class="absolute right-5 top-1">{{ descbutton }}</button>
    <p v-if="desc === '' && !editdesc">No description yet</p>
    <div v-if="desc != '' && !editdesc" class="whitespace-pre"
      v-html="DOMPurify.sanitize(marked.parse(profile.description))"></div>
    <form v-if="editdesc" @submit.prevent="post">
      <div>
        <textarea v-model="desc" placeholder="Description"
          class="rounded-lg h-32 w-full text-lg outline-blue-500 outline-8 text-start mt-3 text-black"></textarea>
      </div>
      <button
        class="rounded-xl bg-darker-blue font-rubik text-4xl text-center text-white h-12 w-full hover:bg-darkerer-blue">Submit</button>
    </form>
  </div>
</template>