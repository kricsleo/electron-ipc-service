<script setup lang="ts">
import { ipc } from './ipc';

async function fooA() {
  const result = ipc.ServiceA.foo();
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${await result}`);
}
async function barA() {
  const result = ipc.ServiceA.bar();
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${await result}`);
}

async function fooB() {
  const result = ipc.ServiceB.foo();
  const resultType = result instanceof Promise ? 'Promise' : typeof result;
  window.alert(`result: ${result}, type: ${resultType}, resolved: ${await result}`);
}
async function barB() {
  const result = ipc.ServiceB.bar();
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
