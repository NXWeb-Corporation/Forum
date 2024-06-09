<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const items = ref([]);

async function getstuff(){
  let response = await axios.get("/api/data")
  items.value = response.data;
}

async function poststuff(id){
  let response = await axios.post("/api/data", {
    id: id
  });
  items.value = response.data;
}
onMounted(getstuff)
</script>
<template>
  <div v-for="item in items">
    <h1 @click="poststuff(item._id)" class="text-white">{{ item.title }}</h1>
  </div>
</template>