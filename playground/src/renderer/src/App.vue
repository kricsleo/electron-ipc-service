<script setup lang="ts">
import { ipc } from './ipc';

async function fooA() {
  const result = ipc.app.getAppVersion();
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${await result}`);
}
async function barA() {
  const result = ipc.app.search('bar');
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${JSON.stringify(await result)}`);
}

async function barB() {
  const result = ipc.util.bar();
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${await result}`);
}
</script>

<template>
  <main>
    <h1>service A</h1>
    <button @click="fooA">foo</button>
    <button @click="barA">bar</button>

    <hr>

    <h1>service B</h1>
    <button @click="barB">bar</button>
  </main>
</template>
