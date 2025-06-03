<script setup>
import { useAppStyles } from '~/composables/useAppStyles'

const { colors, textStyles, backgrounds } = useAppStyles()

function handleLogin() {
  navigateTo('/login')
}

function handleRegister() {
  navigateTo('/register')
}
</script>

<template>
  <div class="welcome-container" :style="{ backgroundColor: backgrounds.main }">
    <div class="main-content">
      <div class="title-section">
        <h1 class="welcome-title" :style="textStyles.title()">
          Chào Mừng<br>Đến với Learnity
        </h1>
      </div>

      <div class="logo-section">
        <div class="logo-container">
          <img 
            src="/assets/learnity.png"
            alt="Learnity Logo"
            class="logo-image"
          />
        </div>
      </div>

      <div class="description">
        <p :style="textStyles.subtitle()">
          Cộng đồng học tập<br>Nơi mỗi ý tưởng đều có giá trị.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="button-section">
        <button 
          @click="handleLogin"
          class="primary-button"
          :style="{
            backgroundColor: colors.buttonBg,
            color: colors.buttonText,
            ...textStyles.textButton()
          }"
        >
          Đăng nhập
        </button>
        
        <button 
          @click="handleRegister"
          class="secondary-button"
          :style="{
            backgroundColor: colors.white,
            color: colors.buttonBg,
            ...textStyles.textButton()
          }"
        >
          Đăng ký
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  gap: 40px;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.welcome-title {
  margin: 0;
  line-height: 1.2;
}

.subtitle {
  margin: 0;
  line-height: 1.2;
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

.logo-text {
  margin: 0;
  line-height: 1;
  font-size: 48px;
}

.description p {
  margin: 0;
  line-height: 1.5;
}

.button-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;
}

.primary-button, .secondary-button {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.secondary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 480px) {
  .welcome-container {
    padding: 16px;
  }
  
  .main-content {
    gap: 32px;
  }
  
  .logo-container {
    width: 100px;
    height: 100px;
  }
  
  .logo-image {
    width: 100%;
    height: 100%;
  }
  
  .logo-text {
    font-size: 40px;
  }
}
</style>