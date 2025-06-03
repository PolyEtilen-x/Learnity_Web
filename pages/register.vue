<template>
  <div class="register-container" :style="{ backgroundColor: backgrounds.main }">
    <div class="register-content">      
      <div class="header-section">
        <h1 class="app-title" :style="textStyles.title()">Learnity</h1>
        <h2 class="page-title" :style="textStyles.subtitle()">Đăng Ký</h2>
        <p class="subtitle-text" :style="textStyles.bodySecondary()">
          Tạo tài khoản mới để bắt đầu học tập
        </p>
      </div>

      <!-- Google Sign-Up Button -->
      <button 
        type="button" 
        class="google-button"
        :style="{
          backgroundColor: colors.white,
          color: colors.textPrimary,
          ...textStyles.textButton()
        }"
        @click="handleGoogleRegister"
        :disabled="loading"
      >
        <Icon icon="mdi:google" width="20" height="20" class="google-icon" />
        <span>Tiếp tục với Google</span>
      </button>

      <!-- Divider: HOẶC -->
      <div class="divider">
        <span :style="textStyles.bodySecondary()">HOẶC</span>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label class="form-label" :style="textStyles.label()">Tên người dùng</label>
          <div class="input-container">
            <div class="input-icon">
              <Icon icon="mdi:account-outline" width="20" height="20" />
            </div>
            <input
              v-model="username"
              type="text"
              class="form-input"
              :style="{
                backgroundColor: colors.white,
                color: colors.textPrimary,
                ...textStyles.inputText()
              }"
              placeholder="Nhập tên người dùng của bạn"
            />
          </div>
          <p v-if="errors.username" class="error-message-text" :style="textStyles.error()">
            {{ errors.username }}
          </p>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label class="form-label" :style="textStyles.label()">Email</label>
          <div class="input-container">
            <div class="input-icon">
              <Icon icon="mdi:email-outline" width="20" height="20" />
            </div>
            <input
              v-model="email"
              type="email"
              class="form-input"
              :style="{
                backgroundColor: colors.white,
                color: colors.textPrimary,
                ...textStyles.inputText()
              }"
              placeholder="Nhập địa chỉ email của bạn"
            />
          </div>
          <p v-if="errors.email" class="error-message-text" :style="textStyles.error()">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label class="form-label" :style="textStyles.label()">Mật khẩu</label>
          <div class="input-container">
            <div class="input-icon">
              <Icon icon="mdi:lock-outline" width="20" height="20" />
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :style="{
                backgroundColor: colors.white,
                color: colors.textPrimary,
                ...textStyles.inputText()
              }"
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="togglePasswordVisibility"
            >
              <Icon 
                :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" 
                width="20" height="20" 
                class="text-gray-600" 
              />
            </button>
          </div>
          <p v-if="errors.password" class="error-message-text" :style="textStyles.error()">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirm Password Field -->
        <div class="form-group">
          <label class="form-label" :style="textStyles.label()">Xác nhận mật khẩu</label>
          <div class="input-container">
            <div class="input-icon">
              <Icon icon="mdi:lock-outline" width="20" height="20" />
            </div>
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              :style="{
                backgroundColor: colors.white,
                color: colors.textPrimary,
                ...textStyles.inputText()
              }"
              placeholder="Nhập lại mật khẩu"
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="toggleConfirmPasswordVisibility"
            >
              <Icon 
                :icon="showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" 
                width="20" height="20" 
                class="text-gray-600" 
              />
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="error-message-text" :style="textStyles.error()">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          class="register-button"
          :style="{
            backgroundColor: colors.buttonBg,
            color: colors.buttonText,
            ...textStyles.textButton()
          }"
          :disabled="loading"
        >
          {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
        </button>
      </form>

      <!-- Footer: Link to Login -->
      <div class="footer-links">
        <span :style="textStyles.body()">Bạn đã có tài khoản? </span>
        <NuxtLink to="/login" class="register-link" :style="textStyles.link()">Đăng nhập</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStyles } from '~/composables/useAppStyles'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth' // sử dụng composable tương tự ví dụ
import { useRouter } from 'vue-router'

const router = useRouter()
const { colors, textStyles, backgrounds } = useAppStyles()

// Data form
const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const showPassword = ref<boolean>(false)
const showConfirmPassword = ref<boolean>(false)
const loading = ref<boolean>(false)

// Object chứa lỗi validate
const errors = ref<{
  username: string
  email: string
  password: string
  confirmPassword: string
}>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Toggle hiển thị mật khẩu
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Lấy các hàm xử lý Firebase Auth từ composable
const { registerWithEmail, signInWithGoogleAndSave } = useFirebaseAuth()

// Validate dữ liệu đầu vào
const validateForm = (): boolean => {
  errors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  if (!username.value.trim()) {
    errors.value.username = 'Vui lòng nhập tên người dùng'
  }
  if (!email.value.trim()) {
    errors.value.email = 'Vui lòng nhập email'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Email không hợp lệ'
  }
  if (!password.value) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
  } else if (password.value.length < 6) {
    errors.value.password = 'Mật khẩu tối thiểu 6 ký tự'
  }
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Mật khẩu không khớp'
  }

  // Nếu mọi trường trống, tức không có thông báo lỗi → form hợp lệ
  return Object.values(errors.value).every(err => err === '')
}

// Form Register
const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    // call Firebase
    await registerWithEmail(email.value, password.value, username.value)
    await router.push('/login')
  } catch (err: any) {
    const msg = err?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
    errors.value.email = msg
  } finally {
    loading.value = false
  }
}

const handleGoogleRegister = async () => {
  loading.value = true
  try {
    await signInWithGoogleAndSave() 
    await router.push('/home')
  } catch (err: any) {
    const msg = err?.message || 'Đăng ký Google thất bại'
    errors.value.username = msg 
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-content {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border-radius: 12px;
}

.header-section {
  text-align: center;
  margin-bottom: 24px;
}
.app-title {
  margin: 0 0 8px 0;
  line-height: 1.2;
}
.page-title {
  margin: 0 0 4px 0;
  line-height: 1.2;
}
.subtitle-text {
  margin: 0;
}

.google-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.google-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.google-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.divider {
  position: relative;
  text-align: center;
  margin: 16px 0;
}
.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e5e5;
  z-index: 1;
}
.divider span {
  background: inherit;
  padding: 0 12px;
  position: relative;
  z-index: 2;
  color: #6c6c6c;
  font-size: 14px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-label {
  margin: 0;
}

/* Input container */
.input-container {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 12px;
  color: #6c6c6c;
}
.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
  font-size: 16px;
}
.form-input:focus {
  border-color: #0f2a19;
}

/* Nút hiện/ẩn mật khẩu */
.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c6c6c;
  padding: 4px;
}

/* Thông báo lỗi validate */
.error-message-text {
  margin-top: 4px;
  font-size: 14px;
  color: #ef4444;
}

/* Nút Đăng ký chính */
.register-button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 17px;
  font-weight: 600;
}
.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.register-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Footer link Đăng nhập */
.footer-links {
  text-align: center;
  margin-top: 24px;
}
.register-link {
  margin-left: 4px;
  font-weight: 500;
}
</style>
