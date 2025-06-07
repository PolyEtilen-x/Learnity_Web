<script setup>
import { ref } from 'vue'
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

// sidebar status (Collapse)
const isSidebarCollapsed = ref(false)

// list navigation
const navItems = ref([
  { icon: 'mdi:home', label: 'Trang chủ', key: 'home', active: true },
  { icon: 'mdi:magnify', label: 'Tìm kiếm', key: 'search', active: false },
  { icon: 'mdi:chat-outline', label: 'Tin nhắn', key: 'messages', active: false },
  { icon: 'mdi:heart-outline', label: 'Thông báo', key: 'notifications', active: false },
  { icon: 'mdi:plus-box-outline', label: 'Tạo', key: 'create', active: false },
  { icon: 'mdi:account-circle-outline', label: 'Hồ sơ', key: 'profile', active: false },
  { icon: 'mdi:account-group-outline', label: 'Nhóm', key: 'group', active: false }
])

// click navigation
const handleNavClick = (key) => {
  if (key === 'create') {
    emit('create-post')
  } else {
    emit('navigate', key)
  }
  // reload status after click
  navItems.value.forEach(item => {
    item.active = item.key === key
  })
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleLogout = () => {
  emit('logout')
}
</script>

<template>
  <nav class="sidebar" :class="{ collapsed: isSidebarCollapsed }" :style="{ backgroundColor: backgrounds.main }">
    <div class="sidebar-content">
      <div class="logo-section">
        <div class="logo-container">
          <img src="/assets/learnity.png" alt="Learnity Logo" class="logo-image" />
        </div>
      </div>

      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.key" class="nav-item">
          <button
            class="nav-button"
            :class="{ active: item.active }"
            @click="handleNavClick(item.key)"
            :style="{
              ...textStyles.body(),
              color: item.active
                ? isDarkMode
                  ? colors.black
                  : colors.white
                : isDarkMode
                  ? colors.darkTextPrimary
                  : colors.textPrimary
            }"
          >
            <Icon
              :icon="item.icon"
              width="24"
              height="24"
              :color="
                item.active
                  ? isDarkMode
                    ? colors.black
                    : colors.white
                  : isDarkMode
                    ? colors.darkTextPrimary
                    : colors.textPrimary
              "
            />
            <span v-if="!isSidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </button>
        </li>
      </ul>

      <div class="user-section" v-if="currentUser">
        <button class="user-button" :style="textStyles.body()">
          <img
            :src="currentUser.avatarUrl || '/plugins/default-avatar.png'"
            :alt="currentUser.displayName"
            class="user-avatar"
          />
          <div v-if="!isSidebarCollapsed" class="user-info">
            <span class="user-name" :style="{ color: isDarkMode ? colors.darkTextPrimary : colors.textPrimary }">
              {{ currentUser.displayName }}
            </span>
            <span class="user-username" :style="{ color: isDarkMode ? colors.darkTextSecondary : colors.textSecondary }">
              @{{ currentUser.username }}
            </span>
          </div>
        </button>
        <button
          v-if="!isSidebarCollapsed"
          class="logout-button"
          @click="handleLogout"
          :style="{ color: '#EF4444' }"
        >
          <Icon icon="mdi:logout" width="24" height="24" />
        </button>
      </div>

      <!-- Collapse Toggle Button -->
      <button
        class="collapse-toggle"
        @click="toggleSidebar"
        :style="{
          backgroundColor: isDarkMode ? colors.darkBackground : colors.white,
          borderColor: isDarkMode ? colors.darkTextThird : '#E5E5E5',
          color: isDarkMode ? colors.darkTextPrimary : colors.textPrimary
        }"
      >
        <Icon :icon="isSidebarCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'" width="24" height="24" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 245px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid #e5e5e5;
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
  display: flex;
  justify-content: center;
}

.logo-container {
  width: 120px;
  height: 120px;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
  background-color: rgba(0, 0, 0, 0.1);
}

.nav-label {
  font-size: 16px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-top: 1px solid #e5e5e5;
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
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* Collapse toggle button */
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

@media (max-width: 768px) {
  .sidebar {
    width: 72px;
  }

  .nav-label,
  .user-info,
  .logout-button {
    display: none;
  }
}
</style>