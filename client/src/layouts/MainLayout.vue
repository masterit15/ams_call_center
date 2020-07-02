<template>
  <div>
<app-header />
      <app-aside />
    <main class="main-content" id="main-content">
      <transition name="slide-fade">
        <router-view />
      </transition>
    </main>
    <app-footer/>
  </div>
</template>
