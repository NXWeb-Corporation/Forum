<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const route = useRoute();
const items = ref({ main: { title: "", description: "", owner: "" } });
const show = ref(null);

function scroll(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};
function showthing(id) {
  show.value = id;
}
function reply(id) {
  console.log(id);
};

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
    class="bg-nav-bg p-4 rounded-lg m-2 text-white">
    <h2>{{ `${items.main.owner}:` }}</h2>
    <div class="whitespace-pre" v-html="DOMPurify.sanitize(marked.parse(items.main.description))"></div>
    <span v-if="show == items.main._id">
      <button @click="(reply(items.main._id))" class="p-0.5"><span class="hover:text-darker-blue">reply</span></button>
      <button class="p-0.5"><span class="hover:text-darker-blue">edit</span></button>
    </span>
  </div>
  <!-- other stuff -->
  <div v-for="item in items.json" :id="item._id" @mouseenter="showthing(item._id)" @mouseleave="showthing(null)"
    class="bg-nav-bg p-4 rounded-lg m-2 text-white">
    <h2>{{ `${item.owner}:` }}</h2>
    <div class="whitespace-pre" v-html="DOMPurify.sanitize(marked.parse(item.stuff))"></div>
    <span v-if="show == item._id">
      <button @click="(reply(item._id))" class="p-0.5"><span class="hover:text-darker-blue">reply</span></button>
      <button class="p-0.5"><span class="hover:text-darker-blue">edit</span></button>
    </span>
  </div>
</template>