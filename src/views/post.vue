<script setup>
import { ref } from 'vue';
import postdocuments from '../components/postdocuments.vue'
import createcomment from '../components/createcomment.vue'

const createnew = ref(false)
const componentkey = ref(0)

function newcomment(){
  createnew.value = true 
}
function exit(){
  createnew.value = false
  componentkey.value += 1
}
</script>

<template>
  <div class="flex flex-row-reverse">
    <button class="text-black bg-blue-700 font-poppins rounded-xl w-36 h-12 m-10" @click="newcomment">New comment</button>
  </div>
  
  <postdocuments :key="componentkey"></postdocuments>
  <createcomment @successful="exit"></createcomment>
</template>