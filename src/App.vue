<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-1">
      <div class="px-6">
        <div class="mx-auto max-w-3xl py-8">
          <RouterView />
        </div>
      </div>
    </main>

    <footer class="sticky bottom-0 border-t border-slate-900 bg-white">
      <div class="mx-auto max-w-3xl">
        <div class="mx-auto max-w-3xl py-4">
          <nav class="flex justify-between items-center space-x-2">
            <RouterLink class="text-xl py-4" to="/">Home</RouterLink>
            <RouterLink class="text-xl py-4" to="/about">About</RouterLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
