<script setup lang="ts">
import { ipc } from './ipc';

async function fooA() {
  const result = ipc.a.foo();
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${await result}`);
}
async function barA() {
  const result = ipc.a.bar();
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${await result}`);
}

async function fooB() {
  const result = ipc.b.foo();
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${await result}`);
}
async function barB() {
  const result = ipc.b.bar();
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
    <button @click="fooB">foo</button>
    <button @click="barB">foo</button>
  </main>
</template>
