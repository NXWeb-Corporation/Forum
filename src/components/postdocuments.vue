<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const route = useRoute();
const items = ref({ main: { title: "", description: "", owner: "" } });
const show = ref(null);

function notdone(){
  alert("Not Done")
}
function scroll(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};
function showthing(id) {
  show.value = id;
}

async function get() {
  let response = await axios.get(`/api/data/comment/${route.params.id}`)
  items.value = response.data;
};
onMounted(get)
</script>

<template>
  <div class="bg-blue-700 text-center p-5">
    <h1 class="text-white text-5xl">{{ items.main.title }}</h1>
  </div>
  <div @mouseenter="showthing(items.main._id)" @mouseleave="showthing(null)"
    class="bg-nav-bg p-4 rounded-lg m-2 text-white overflow-auto relative">
    <h2>{{ `${items.main.owner}:` }}</h2>
    <div class="whitespace-pre" v-html="DOMPurify.sanitize(marked.parse(items.main.description))"></div>
    <span v-if="show == items.main._id" class="absolute right-5 bottom-1">
      <button @click="notdone" class="p-1"><span class="hover:text-darker-blue">Reply</span></button>
      <button @click="notdone" class="p-1"><span class="hover:text-darker-blue">Edit</span></button>
    </span>
  </div>
  <!-- other stuff -->
  <div v-for="item in items.json" :id="item._id" @mouseenter="showthing(item._id)" @mouseleave="showthing(null)"
    class="bg-nav-bg p-4 rounded-lg m-2 text-white overflow-auto relative">
    <h2>{{ `${item.owner}:` }}</h2>
    <div class="whitespace-pre" v-html="DOMPurify.sanitize(marked.parse(item.stuff))"></div>
    <span v-if="show == item._id" class="absolute right-5 bottom-1">
      <button @click="notdone" class="p-1"><span class="hover:text-darker-blue">Reply</span></button>
      <button @click="notdone" class="p-1"><span class="hover:text-darker-blue">Edit</span></button>
    </span>
  </div>
</template>