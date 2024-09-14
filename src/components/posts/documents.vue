<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { store } from '@/assets/store';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const route = useRoute();
const items = ref({ title: "" });
const show = ref(null);
const error = ref(null);

function notdone() {
  alert("Not Done")
};
function scroll(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};
function showthing(id) {
  show.value = id;
};

async function get() {
  let response = await axios.get(`/api/data/comment/${route.params.id}`)
  if (response.data) {
    items.value = response.data;
  } else error.value = "Not found";
};
onMounted(get)
</script>

<template>
  <div class="bg-blue-700 text-center p-5">
    <h1 v-if="error" class="text-red-700 text-5xl">{{ error }}</h1>
    <h1 class="text-white text-5xl">{{ items.title }}</h1>
  </div>
  <div v-for="item in items.comments" :id="item._id" @mouseenter="showthing(item._id)" @mouseleave="showthing(null)"
    class="bg-nav-bg p-4 rounded-lg m-2 text-white overflow-auto break-words relative">
    <RouterLink :to="`/profile/${item.owner}`" class="hover:cursor-pointer text-2xl text-white no-underline">{{
      `${item.owner}:` }}</RouterLink>
    <div class="whitespace-pre" v-html="DOMPurify.sanitize(marked.parse(item.stuff))"></div>
    <span v-if="show == item._id" class="absolute right-5 bottom-1">
      <button v-if="store.username == item.owner" @click="notdone" class="p-1"><span
          class="hover:text-darker-blue">Edit</span></button>
      <button @click="notdone" class="p-1"><span class="hover:text-darker-blue">Reply</span></button>
    </span>
  </div>
</template>