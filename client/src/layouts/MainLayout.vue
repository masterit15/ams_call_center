<template>
  <div>
<app-header />
      <app-aside />
    <main class="main-content" id="main-content">
      <transition name="slide-fade">
        <router-view />
      </transition>
    </main>
    <footer class="footer">
      <div class="cophiright">
        <!-- <p>masterit15</p> -->
      </div>
    </footer>
  </div>
</template>