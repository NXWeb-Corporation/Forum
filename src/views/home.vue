<script setup>
import { ref } from 'vue';
import createpost from '../components/createpost.vue';

const createnew = ref(false)
function newpost(){
  createnew.value = !createnew.value
}
</script>
<template>
  <div class="flex flex-row-reverse">
    <button class="text-black bg-blue-700 font-poppins rounded-xl w-36 h-12 m-10" @click="newpost">New Post</button>
  </div>
  <createpost v-if="createnew"></createpost>
</template>