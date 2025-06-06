<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useFirestore } from 'vuefire'
import { useAppStyles } from '~/composables/useAppStyles'
import { useAlert } from '~/composables/useAlert'
import  SidebarNavigation  from '~/components/SidebarNavigation.vue'

// Auth & Firebase
const auth = useFirebaseAuth()
const user = useCurrentUser()
const db = useFirestore()
const { colors, textStyles, backgrounds } = useAppStyles()
const { success, error: showError } = useAlert()

// State
const posts = ref([])
const loading = ref(true)
const currentUser = ref(null)
const selectedTab = ref('for-you') // 'for-you' hoặc 'following'
const showCreatePost = ref(false)
const newPostContent = ref('')
const sidebarCollapsed = ref(false)

// Navigation items
const navItems = [
  { icon: 'mdi:home', label: 'Trang chủ', key: 'home', active: true },
  { icon: 'mdi:magnify', label: 'Tìm kiếm', key: 'search' },
  { icon: 'mdi:compass-outline', label: 'Khám phá', key: 'explore' },
  { icon: 'mdi:play-box-outline', label: 'Reels', key: 'reels' },
  { icon: 'mdi:message-outline', label: 'Tin nhắn', key: 'messages' },
  { icon: 'mdi:heart-outline', label: 'Thông báo', key: 'notifications' },
  { icon: 'mdi:plus-box-outline', label: 'Tạo', key: 'create' },
  { icon: 'mdi:account-circle-outline', label: 'Hồ sơ', key: 'profile' }
]

// Computed
const isLoggedIn = computed(() => !!user.value)

// Methods
const loadCurrentUser = async () => {
  if (!user.value) return
  
  try {
    const userDoc = await getDocs(query(collection(db, 'users')))
    const userData = userDoc.docs.find(doc => doc.id === user.value.uid)
    if (userData) {
      currentUser.value = {
        uid: user.value.uid,
        username: userData.data().username || '',
        displayName: userData.data().displayName || user.value.displayName || '',
        avatarUrl: userData.data().avatarUrl || user.value.photoURL || ''
      }
    }
  } catch (error) {
    console.error('Error loading user:', error)
  }
}

const loadPosts = async () => {
  loading.value = true
  try {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
    const postsSnapshot = await getDocs(postsQuery)
    
    posts.value = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }))
  } catch (error) {
    console.error('Error loading posts:', error)
    showError('Không thể tải bài viết')
  } finally {
    loading.value = false
  }
}

const createPost = async () => {
  if (!newPostContent.value.trim() || !user.value) return
  
  try {
    await addDoc(collection(db, 'posts'), {
      content: newPostContent.value,
      authorId: user.value.uid,
      authorName: currentUser.value?.displayName || 'Người dùng',
      authorAvatar: currentUser.value?.avatarUrl || '',
      createdAt: serverTimestamp(),
      likes: 0,
      comments: 0,
      shares: 0
    })
    
    newPostContent.value = ''
    showCreatePost.value = false
    success('Đăng bài thành công!')
    await loadPosts()
  } catch (error) {
    console.error('Error creating post:', error)
    showError('Không thể đăng bài')
  }
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    success('Đăng xuất thành công')
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
    showError('Đăng xuất thất bại')
  }
}

const handleNavClick = (key) => {
  if (key === 'create') {
    showCreatePost.value = true
  } else if (key === 'messages') {
    // Navigate to chat page
    console.log('Navigate to chat')
  }
  // Update active state
  navItems.forEach(item => item.active = item.key === key)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (days > 0) return `${days} ngày trước`
  if (hours > 0) return `${hours} giờ trước`
  if (minutes > 0) return `${minutes} phút trước`
  return 'Vừa xong'
}

// Lifecycle
onMounted(async () => {
  if (!isLoggedIn.value) {
    await navigateTo('/login')
    return
  }
  
  await loadCurrentUser()
  await loadPosts()
})
</script>

<template>
    <div class="home-container" :style="{ backgroundColor: backgrounds.main }">
    <SidebarNavigation
      :currentUser="currentUser"
      :handleLogout="handleLogout"
      :handleNavClick="handleNavClick"
      :sidebarCollapsed="sidebarCollapsed"
      :toggleSidebar="toggleSidebar"
    />

    <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <header class="main-header" :style="{ backgroundColor: backgrounds.main }">
        <div class="header-content">
          <!-- Tab Navigation -->
          <div class="tab-navigation">
            <button 
              @click="selectedTab = 'for-you'"
              class="tab-button"
              :class="{ active: selectedTab === 'for-you' }"
              :style="textStyles.subtitle()"
            >
              Dành cho bạn
            </button>
            <button 
              @click="selectedTab = 'following'"
              class="tab-button"
              :class="{ active: selectedTab === 'following' }"
              :style="textStyles.subtitle()"
            >
              Đang theo dõi
            </button>
          </div>
        </div>
      </header>

      <!-- Feed Content -->
      <div class="feed-container">
        <!-- Create Post Prompt -->
        <div class="create-post-prompt" :style="{ backgroundColor: backgrounds.card }">
          <img 
            :src="currentUser?.avatarUrl || '/default-avatar.png'" 
            :alt="currentUser?.displayName"
            class="prompt-avatar"
          />
          <div class="prompt-content">
            <h3 :style="textStyles.subtitle()">{{ currentUser?.displayName || 'Đang tải...' }}</h3>
            <button 
              @click="showCreatePost = true"
              class="prompt-button"
              :style="textStyles.body()"
            >
              Hãy đăng một gì đó?
            </button>
          </div>
        </div>

        <!-- Posts Feed -->
        <div class="posts-feed">
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p :style="textStyles.body()">Đang tải bài viết...</p>
          </div>

          <div v-else-if="posts.length === 0" class="empty-feed">
            <Icon icon="mdi:post-outline" width="64" height="64" />
            <p :style="textStyles.body()">Không có bài viết nào</p>
          </div>

          <article 
            v-else
            v-for="post in posts" 
            :key="post.id" 
            class="post-card"
            :style="{ backgroundColor: backgrounds.card }"
          >
            <!-- Post Header -->
            <div class="post-header">
              <div class="post-author">
                <img 
                  :src="post.authorAvatar || '/default-avatar.png'" 
                  :alt="post.authorName"
                  class="author-avatar"
                />
                <div class="author-info">
                  <h4 :style="textStyles.subtitle()">{{ post.authorName }}</h4>
                  <p :style="textStyles.caption()">{{ formatTimeAgo(post.createdAt) }}</p>
                </div>
              </div>
              <button class="post-menu">
                <Icon icon="mdi:dots-horizontal" width="20" height="20" />
              </button>
            </div>

            <!-- Post Content -->
            <div class="post-content">
              <p :style="textStyles.body()">{{ post.content }}</p>
            </div>

            <!-- Post Actions -->
            <div class="post-actions">
              <button class="action-button">
                <Icon icon="mdi:heart-outline" width="20" height="20" />
                <span>{{ post.likes || 0 }}</span>
              </button>
              <button class="action-button">
                <Icon icon="mdi:comment-outline" width="20" height="20" />
                <span>{{ post.comments || 0 }}</span>
              </button>
              <button class="action-button">
                <Icon icon="mdi:share-outline" width="20" height="20" />
                <span>{{ post.shares || 0 }}</span>
              </button>
            </div>
          </article>
        </div>
      </div>
    </main>

    <!-- Create Post Modal -->
    <div v-if="showCreatePost" class="modal-overlay" @click="showCreatePost = false">
      <div class="modal-content" @click.stop :style="{ backgroundColor: backgrounds.card }">
        <div class="modal-header">
          <h3 :style="textStyles.subtitle()">Tạo bài viết mới</h3>
          <button @click="showCreatePost = false" class="modal-close">
            <Icon icon="mdi:close" width="24" height="24" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="create-post-form">
            <div class="form-author">
              <img 
                :src="currentUser?.avatarUrl || '/default-avatar.png'" 
                :alt="currentUser?.displayName"
                class="form-avatar"
              />
              <span :style="textStyles.subtitle()">{{ currentUser?.displayName }}</span>
            </div>
            
            <textarea
              v-model="newPostContent"
              placeholder="Bạn đang nghĩ gì?"
              class="content-textarea"
              :style="textStyles.body()"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            @click="createPost"
            :disabled="!newPostContent.trim()"
            class="post-button"
            :style="{
              backgroundColor: colors.buttonBg,
              color: colors.buttonText,
              ...textStyles.textButton()
            }"
          >
            Đăng bài
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: 245px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  border-right: 1px solid #E5E5E5;
  transition: width 0.3s ease;
  z-index: 100;
}

.sidebar.collapsed {
  width: 72px;
}

.sidebar-content {
  padding: 24px 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-section {
  margin-bottom: 32px;
  padding: 0 8px;
}

.logo h1 {
  margin: 0;
  font-size: 28px;
}

.logo-icon {
  display: flex;
  justify-content: center;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.nav-item {
  margin-bottom: 8px;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-button.active {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.nav-label {
  font-size: 16px;
  white-space: nowrap;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-top: 1px solid #E5E5E5;
  margin-top: auto;
}

.user-button {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-button {
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  color: #EF4444;
}

.collapse-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 1px solid #E5E5E5;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Content Styles */
.main-content {
  margin-left: 245px;
  flex: 1;
  transition: margin-left 0.3s ease;
}

.main-content.sidebar-collapsed {
  margin-left: 72px;
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #E5E5E5;
}

.header-content {
  padding: 16px 24px;
}

.tab-navigation {
  display: flex;
  gap: 32px;
}

.tab-button {
  padding: 12px 0;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.tab-button.active {
  border-bottom-color: #0F2A19;
  color: #0F2A19;
}

.feed-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.create-post-prompt {
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #E5E5E5;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.prompt-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.prompt-content h3 {
  margin: 0 0 8px 0;
}

.prompt-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6B7280;
  text-align: left;
  padding: 0;
}

.posts-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #E5E5E5;
  border-top: 3px solid #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-feed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px;
  color: #6B7280;
}

.post-card {
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  padding: 16px;
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

.author-info h4 {
  margin: 0 0 4px 0;
}

.author-info p {
  margin: 0;
}

.post-menu {
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
}

.post-content {
  margin-bottom: 16px;
}

.post-content p {
  margin: 0;
  line-height: 1.5;
}

.post-actions {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #E5E5E5;
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
  color: #6B7280;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E5E5;
}

.modal-header h3 {
  margin: 0;
}

.modal-close {
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
}

.modal-body {
  padding: 20px;
}

.form-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.form-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.content-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.5;
}

.content-textarea:focus {
  outline: none;
  border-color: #3B82F6;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #E5E5E5;
  display: flex;
  justify-content: flex-end;
}

.post-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.post-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 72px;
  }
  
  .sidebar .nav-label,
  .sidebar .user-name {
    display: none;
  }
  
  .main-content {
    margin-left: 72px;
  }
  
  .feed-container {
    padding: 16px;
  }
}
</style>