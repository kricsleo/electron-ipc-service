<script setup lang="ts">
import { ipc, toastMessages } from './ipc';

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

function broadcast() {
  ipc.notify.broadcast('Broadcast triggered by renderer!');
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

    <hr>

    <h1>Broadcast</h1>
    <button @click="broadcast">Broadcast from Main</button>

    <hr>

    <h1>Messages</h1>
    <ul>
      <li v-for="(msg, i) in toastMessages" :key="i">{{ msg }}</li>
    </ul>
    <p v-if="!toastMessages.length" style="color: #888;">No messages yet. Wait 3s for auto-broadcast or click the button above.</p>
  </main>
</template>
