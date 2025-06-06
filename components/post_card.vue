<script setup lang="ts">
import { PostModel } from '~/models/post_models'

defineProps<{
  post: PostModel
}>()
</script>

<template>
  <div class="rounded-xl shadow bg-white dark:bg-zinc-900 p-4 mb-4">
    <!-- Header -->
    <div class="flex items-center mb-2">
      <img :src="post.avatarUrl || '/default-avatar.png'" class="w-10 h-10 rounded-full mr-3" />
      <div class="flex-1">
        <div class="flex items-center space-x-1 font-semibold text-sm">
          <span>{{ post.username }}</span>
          <span v-if="post.isVerified" class="text-blue-500">✔️</span>
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ post.createdAt.toLocaleDateString() }}</div>
      </div>
    </div>

    <!-- Content -->
    <p v-if="post.postDescription" class="text-sm mb-2">{{ post.postDescription }}</p>
    <img v-if="post.imageUrl" :src="post.imageUrl" class="rounded-lg w-full" />

    <!-- Actions -->
    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
      <span>❤️ {{ post.likes }}</span>
      <span>💬 {{ post.comments }}</span>
      <span>🔄 {{ post.shares }}</span>
    </div>
  </div>
</template>
