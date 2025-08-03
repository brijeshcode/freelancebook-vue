<template>
  <div id="app">
    <!-- Your existing app content -->
    <RouterView />
    <!-- Add Notivue component - this handles all notifications -->
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Notivue, Notification } from 'notivue'
import { useThemeStore } from '@/stores/themeStore'
import { onMounted } from 'vue'
const themeStore = useThemeStore()
onMounted(() => {
  themeStore.initializeDarkMode()
})
</script>

<style>
/* Your existing styles */

/* Custom notification styles for freelancer management theme */
:root {
  --nv-root-bg: #ffffff;
  --nv-root-fg: #374151;
  --nv-root-border: #d1d5db;
  
  --nv-success-bg: #ecfdf5;
  --nv-success-fg: #047857;
  --nv-success-border: #10b981;
  
  --nv-error-bg: #fef2f2;
  --nv-error-fg: #dc2626;
  --nv-error-border: #ef4444;
  
  --nv-warning-bg: #fffbeb;
  --nv-warning-fg: #d97706;
  --nv-warning-border: #f59e0b;
  
  --nv-info-bg: #eff6ff;
  --nv-info-fg: #2563eb;
  --nv-info-border: #3b82f6;
}
</style>