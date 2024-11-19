<template>
  <h1 class="text-4xl font-bold">Hello, World!</h1>

  <main>
    <RouterView />
  </main>

  <footer>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </footer>
</template>
