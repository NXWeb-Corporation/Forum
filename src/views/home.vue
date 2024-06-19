<script setup>
import { ref } from 'vue';
import createpost from '../components/createpost.vue';
import stuff from '../components/homedocuments.vue';

const createnew = ref(false);
const componentkey = ref(0);

function newpost(){
  createnew.value = true;
}
function exit(){
  createnew.value = false;
  componentkey.value += 1;
}
</script>
<template>
  <div class="flex flex-row-reverse absolute end-0">
    <button class="text-black bg-blue-700 font-poppins rounded-xl w-36 h-12 m-10 mt-4" @click="newpost">New Post</button>
  </div>
  <createpost v-if="createnew" @successful="exit"></createpost>
  <stuff :key="componentkey"></stuff>
</template>