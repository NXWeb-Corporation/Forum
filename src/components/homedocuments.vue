<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const items = ref([]);

async function getstuff(){
  let response = await axios.get("/api/data/post")
  items.value = response.data;
};

function go(id){
  router.push({ path: `/post/${id}` });
};

onMounted(getstuff);
</script>
<template>
  <div v-for="item in items">
    <h1 @click="go(item._id)" class="text-white">{{ item.owner + ": " + item.title }}</h1>
  </div>
</template>