<template>
  <div class="spinner-container">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 240px;
}
.spinner {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 5px solid #76549a;
  border-bottom: 5px solid #fcf8e8;
  animation: spin 0.5s linear infinite;
  position: relative;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
