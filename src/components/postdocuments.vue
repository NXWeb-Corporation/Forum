<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const items = ref({main: {title: "", description: "", owner: ""}});

async function get(){
  let id = location.pathname.replace("/", '').replace("post", '')
  let response = await axios.get(`/api/data/comment${id}`)
  items.value = response.data;
};

onMounted(get)
</script>

<template>
  <div class="bg-nav-bg p-8">
    <h1 class="text-white text-5xl">{{ items.main.owner + ": " + items.main.title }}</h1>
    <p class="text-white text-lg">{{ items.main.description }}</p>
  </div>
  <div v-for="item in items.json">
    <h1 class="text-white">{{ item.owner + ": " + item.stuff }}</h1>
  </div>
</template>