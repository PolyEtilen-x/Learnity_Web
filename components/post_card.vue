<script setup lang="ts">
import { useAppStyles } from '~/composables/useAppStyles'
import { type PostModel } from '~/models/post_models'

const props = defineProps<{
  post: PostModel
}>()

const emit = defineEmits<{
  like: []
  comment: []
  share: []
}>()

const { colors, textStyles, backgrounds } = useAppStyles()

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} ngày trước`
  if (hours > 0) return `${hours} giờ trước`
  if (minutes > 0) return `${minutes} phút trước`
  return 'Vừa xong'
}

const handleLike = () => {
  emit('like')
}

const handleComment = () => {
  emit('comment')
}

const handleShare = () => {
  emit('share')
}
</script>

<template>
  <div class="post-card" :style="{ backgroundColor: backgrounds.secondary }">
    <div class="post-header">
      <div class="post-author">
        <img
          :src="post.avatarUrl || '/default-avatar.png'"
          :alt="post.username"
          class="author-avatar"
        />
        <div class="author-info">
          <div class="author-name">
            <span :style="textStyles.subtitle()">{{ post.username }}</span>
            <span v-if="post.isVerified" class="verified-icon">
              <Icon icon="mdi:check-circle" width="16" height="16" color="#3B82F6" />
            </span>
          </div>
          <p v-if="post.sharedByUid" class="shared-info" :style="textStyles.caption()">
            Được chia sẻ bởi {{ post.sharedByUid }}
          </p>
          <p :style="textStyles.caption()">{{ formatTimeAgo(post.createdAt) }}</p>
        </div>
      </div>
      <button class="post-menu">
        <Icon icon="mdi:dots-horizontal" width="20" height="20" />
      </button>
    </div>

    <!-- Post Content -->
    <div class="post-content">
      <p v-if="post.postDescription" :style="textStyles.body()">
        {{ post.postDescription }}
      </p>
      <p v-if="post.content" :style="textStyles.body()">
        {{ post.content }}
      </p>
      <img v-if="post.imageUrl" :src="post.imageUrl" class="post-image" />
    </div>

    <!-- Post Actions -->
    <div class="post-actions">
      <button 
        class="action-button"
        :class="{ 'liked': post.isLiked }"
        @click="handleLike"
      >
        <Icon 
          :icon="post.isLiked ? 'mdi:heart' : 'mdi:heart-outline'" 
          width="20" 
          height="20" 
          :color="post.isLiked ? '#EF4444' : '#6B7280'"
        />
        <span :style="{ color: post.isLiked ? '#EF4444' : '#6B7280' }">
          {{ post.likes || 0 }}
        </span>
      </button>
      <button class="action-button" @click="handleComment">
        <Icon icon="mdi:comment-outline" width="20" height="20" />
        <span>{{ post.comments || 0 }}</span>
      </button>
      <button class="action-button" @click="handleShare">
        <Icon icon="mdi:share-variant-outline" width="20" height="20" />
        <span>{{ post.shares || 0 }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #E5E5E5;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.post-author {
  display: flex;
  gap: 12px;
  align-items: center;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  display: flex;
  align-items: center;
  gap: 4px;
}

.verified-icon {
  display: inline-flex;
  align-items: center;
}

.shared-info {
  color: #6b7280;
  margin: 2px 0;
}

.post-menu {
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.post-menu:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.post-content {
  margin-bottom: 16px;
}

.post-content p {
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.post-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 8px;
}

.post-actions {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.action-button.liked {
  animation: heartBeat 0.6s ease-in-out;
}

.action-button.liked:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.2);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.2);
  }
  70% {
    transform: scale(1);
  }
}
</style>