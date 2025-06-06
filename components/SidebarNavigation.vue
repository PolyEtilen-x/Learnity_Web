<script setup>
import { ref, computed } from 'vue'
import { useAppStyles } from '~/composables/useAppStyles'
import { useTheme } from '~/composables/useTheme'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['logout', 'navigate', 'create-post'])

const { colors, textStyles, backgrounds } = useAppStyles()
const { isDarkMode } = useTheme()

const sidebarCollapsed = ref(false)

// Navigation items (removed explore and reels)
const navItems = [
  { icon: 'mdi:home', label: 'Trang chủ', key: 'home', active: true },
  { icon: 'mdi:magnify', label: 'Tìm kiếm', key: 'search' },
  { icon: 'mdi:message-outline', label: 'Tin nhắn', key: 'messages' },
  { icon: 'mdi:heart-outline', label: 'Thông báo', key: 'notifications' },
  { icon: 'mdi:plus-box-outline', label: 'Tạo', key: 'create' },
  { icon: 'mdi:account-circle-outline', label: 'Hồ sơ', key: 'profile' }
]

const handleNavClick = (key) => {
  if (key === 'create') {
    emit('create-post')
  } else {
    emit('navigate', key)
  }
  
  // Update active state
  navItems.forEach(item => item.active = item.key === key)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleLogout = () => {
  emit('logout')
}
</script>

<template>
  <nav class="sidebar" :class="{ collapsed: sidebarCollapsed }" :style="{ backgroundColor: backgrounds.main }">
    <div class="sidebar-content">
      <div class="logo-section">
        <div class="logo-container">
          <img 
            src="/assets/learnity.png"
            alt="Learnity Logo"
            class="logo-image"
          />
        </div>
      </div>

      <!-- Navigation Items -->
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.key" class="nav-item">
          <button 
            @click="handleNavClick(item.key)"
            class="nav-button"
            :class="{ active: item.active }"
            :style="{
              ...textStyles.body(),
              color: item.active ? (isDarkMode ? colors.darkButtonText : colors.buttonText) : (isDarkMode ? colors.darkTextPrimary : colors.textPrimary)
            }"
          >
            <Icon 
              :icon="item.icon" 
              width="24" 
              height="24" 
              :color="item.active ? (isDarkMode ? colors.darkButtonText : colors.buttonText) : (isDarkMode ? colors.darkTextPrimary : colors.textPrimary)"
            />
            <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </button>
        </li>
      </ul>

      <!-- User Profile -->
      <div class="user-section" v-if="currentUser">
        <button class="user-button" :style="textStyles.body()">
          <img 
            :src="currentUser.avatarUrl || '/default-avatar.png'" 
            :alt="currentUser.displayName"
            class="user-avatar"
          />
          <div v-if="!sidebarCollapsed" class="user-info">
            <span class="user-name" :style="{ color: isDarkMode ? colors.darkTextPrimary : colors.textPrimary }">
              {{ currentUser.displayName }}
            </span>
            <span class="user-username" :style="{ color: isDarkMode ? colors.darkTextSecondary : colors.textSecondary }">
              @{{ currentUser.username }}
            </span>
          </div>
        </button>
        <button 
          @click="handleLogout" 
          class="logout-button" 
          v-if="!sidebarCollapsed"
          :style="{ color: '#EF4444' }"
        >
          <Icon icon="mdi:logout" width="20" height="20" />
        </button>
      </div>

      <!-- Collapse Toggle -->
      <button 
        @click="toggleSidebar" 
        class="collapse-toggle"
        :style="{ 
          backgroundColor: isDarkMode ? colors.darkBackground : colors.white,
          borderColor: isDarkMode ? colors.darkTextThird : '#E5E5E5',
          color: isDarkMode ? colors.darkTextPrimary : colors.textPrimary
        }"
      >
        <Icon :icon="sidebarCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'" width="20" height="20" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
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
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
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
  transition: all 0.2s ease;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-button.active {
  background-color: rgba(15, 42, 25, 0.1);
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

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
}

.user-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.user-username {
  font-size: 12px;
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
}

.collapse-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: 1px solid;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 72px;
  }
  
  .sidebar .nav-label,
  .sidebar .user-info {
    display: none;
  }
}
</style>