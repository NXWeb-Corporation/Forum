<script setup>
import { ref } from 'vue';
import createpost from '@/components/home/createpost.vue';
import stuff from '@/components/home/documents.vue';

const createnew = ref(false);
const componentkey = ref(0);

function newpost(){
  createnew.value = true;
}
function exit(){
  createnew.value = false;
}
function successful(){
  exit();
  componentkey.value += 1;
}
</script>
<template>
  <div class="flex flex-row-reverse absolute end-0">
    <button class="text-black bg-blue-700 font-poppins rounded-xl w-36 h-12 m-10 mt-4" @click="newpost">New Post</button>
  </div>
  <createpost v-if="createnew" @exit="exit" @successful="successful"></createpost>
  <stuff :key="componentkey"></stuff>
</template>