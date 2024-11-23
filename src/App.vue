<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-1">
      <div class="px-6">
        <div class="mx-auto max-w-3xl py-8">
          <RouterView />
        </div>
      </div>
    </main>

    <footer class="sticky bottom-0 border-t-2 border-slate-900 bg-white">
      <div class="px-6">
        <div class="mx-auto max-w-3xl">
          <div class="mx-auto max-w-3xl py-4">
            <nav class="flex justify-evenly items-center space-x-2">
              <RouterLink class="text-lg px-3 py-4 sm:text-xl" to="/"
                >Home
              </RouterLink>
              <RouterLink class="text-lg px-3 py-4 sm:text-xl" to="/settings"
                >Settings
              </RouterLink>
              <RouterLink class="text-lg px-3 py-4 sm:text-xl" to="/about"
                >About
              </RouterLink>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
