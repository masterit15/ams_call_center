<template>
  <div class="not_found">
    <div class="container">
          <h1>404</h1>
          <h2>Станицы не существеет</h2>
          <router-link class="backhome" to="/">Вернутся на главную</router-link>
        </div>
  </div>
</template>

<style>
.not_found{
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
}
.not_found h1{
  font-size: 7rem;
  color: rgb(209, 63, 63);
}
.not_found h2{
  font-size: 2rem;
  color: rgb(209, 63, 63);
}
.not_found .backhome{
  font-size: 1.5rem;
  color: rgb(21, 88, 83);
}
</style>