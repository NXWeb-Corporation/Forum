<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const items = ref({main: {title: "", description: "", owner: ""}});

async function get(){
  let id = location.pathname.replace("/", '').replace("post", '')
  let response = await axios.get(`/api/data/comment${id}`)
  items.value = response.data;
};
onMounted(get)
</script>

<template>
  <div class="bg-blue-700 text-center p-5">
    <h1 class="text-white text-5xl">{{ items.main.title }}</h1>
  </div>
  <div class="bg-nav-bg p-4 rounded-lg m-2">
    <h2 class="text-white">{{ `${items.main.owner}:` }}</h2>
    <div class="text-white whitespace-pre" v-html="DOMPurify.sanitize(marked.parse(items.main.description))"></div>
  </div>
  <!-- other stuff -->
  <div v-for="item in items.json" class="bg-nav-bg p-4 rounded-lg m-2">
    <h2 class="text-white">{{ `${item.owner}:` }}</h2>
    <div class="text-white whitespace-pre" v-html="DOMPurify.sanitize(marked.parse(item.stuff))"></div>
  </div>
</template>