<script setup>
import LeftSidebar from "./LeftSidebar.vue"

</script>

<template>
  <div class="layout__default">
    <div class="nav__sidebar">
      <LeftSidebar />
    </div>
    <div class="main__container">
      <div class="page__container">
        <div class="scrollbar">
          <div class="page">
            <div class="page-contents">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout__default {
  width: 100%;
  max-width: 100%;
  background-color: var(--color-dark);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.main__container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.page__container {
  height: calc(100vh - 2rem);
  width: calc(100% - 1rem);
  background-color: var(--color-white);
  border-radius: 0.35rem;
  padding: 0.5rem 0;
  overflow: hidden;
}

.page-contents {
  padding: 1rem;
}

.page__inner {
  overflow: hidden;
  padding: 0;
}

// nav sidebar
.nav__sidebar {
  width: 4rem;
}

.main__container {
  width: calc(100% - 4rem);
}

/* custom scroll bar */
.scrollbar {
  scrollbar-width: thin;
  overflow-y: auto;
  height: 100%;
}
.scrollbar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.041);
  -webkit-box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.041);
  border-radius: 10px;
}

.scrollbar::-webkit-scrollbar {
  width: 12px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 16px rgba(228, 217, 217, 0.041);
  -webkit-box-shadow: inset 0 0 16px rgba(228, 217, 217, 0.041);
  background-color: #dadce0;
}
</style>
