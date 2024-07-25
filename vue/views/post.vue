<script setup>
import { ref } from 'vue';
import postdocuments from '@/components/posts/documents.vue';
import createcomment from '@/components/posts/createcomment.vue';

const componentkey = ref(0);

function done(){
  componentkey.value += 1
};
</script>

<template>
  <postdocuments :key="componentkey"></postdocuments>
  <createcomment @successful="done"></createcomment>
</template>