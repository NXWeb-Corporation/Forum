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
  <div v-for="item in items" @click="go(item._id)" class="bg-nav-bg m-4 p-2 rounded-lg text-white w-3/4">
    <h3>{{ `${item.owner}:` }}</h3>
    <h1>{{ item.title }}</h1>
  </div>
</template>