<script setup>
import { ref, onMounted } from 'vue'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useAppStyles } from '~/composables/useAppStyles'
import { useAlert } from '~/composables/useAlert'

const auth = useFirebaseAuth()
const user = useCurrentUser()
const { colors, textStyles, backgrounds } = useAppStyles()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('') 
const { success, error: showError } = useAlert()

const isLoggedIn = computed(() => !!user.value)

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Email/Password login
const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Vui lòng nhập đầy đủ thông tin'
    showError('Vui lòng nhập đầy đủ thông tin')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    success('Đăng nhập thành công!')
    await navigateTo('/home')
  } catch (err) {
    console.error('Login error:', err)
    let message = 'Đăng nhập thất bại. Vui lòng thử lại'
    
    switch (err.code) {
      case 'auth/user-not-found':
        message = 'Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới'
        break
      case 'auth/wrong-password':
        message = 'Mật khẩu không chính xác. Vui lòng kiểm tra lại hoặc sử dụng tính năng quên mật khẩu'
        break
      case 'auth/invalid-email':
        message = 'Email không hợp lệ. Vui lòng kiểm tra lại định dạng email'
        break
      case 'auth/too-many-requests':
        message = 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút hoặc sử dụng tính năng quên mật khẩu'
        break
      case 'auth/network-request-failed':
        message = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn'
        break
      case 'auth/user-disabled':
        message = 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ'
        break
    }
    
    errorMessage.value = message
    showError(message)
  } finally {
    loading.value = false
  }
}

// Google login
const handleGoogleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    success('Đăng nhập với Google thành công!')
    await navigateTo('/home')
  } catch (err) {
    console.error('Google login error:', err)
    let message = 'Đăng nhập Google thất bại. Vui lòng thử lại'
    
    if (err.code === 'auth/popup-closed-by-user') {
      message = 'Đăng nhập bị hủy. Vui lòng thử lại'
    } else if (err.code === 'auth/popup-blocked') {
      message = 'Trình duyệt đã chặn cửa sổ popup. Vui lòng cho phép popup và thử lại'
    } else if (err.code === 'auth/cancelled-popup-request') {
      message = 'Đăng nhập bị hủy. Vui lòng thử lại'
    } else if (err.code === 'auth/network-request-failed') {
      message = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn'
    }
    
    errorMessage.value = message
    showError(message)
  } finally {
    loading.value = false
  }
}

// Đăng xuất
const handleLogout = async () => {
  try {
    await signOut(auth)
    email.value = ''
    password.value = ''
    errorMessage.value = ''
    
    success('Đăng xuất thành công')
    await navigateTo('/login')
  } catch (err) {
    console.error('Logout error:', err)
    errorMessage.value = 'Đăng xuất thất bại. Vui lòng thử lại'
    showError('Đăng xuất thất bại. Vui lòng thử lại')
  }
}

// Navigate to register
const goToRegister = () => {
  navigateTo('/register')
}

// Navigate to forgot password
const goToForgotPassword = () => {
  navigateTo('/forgot-password')
}

// Navigate to home
const goToHome = () => {
  navigateTo('/home')
}
</script>

<template>
  <div class="login-container" :style="{ backgroundColor: backgrounds.main }">
    <div class="login-content">
      
      <!-- Form đăng nhập nếu chưa đăng nhập -->
      <div>
        <!-- Header -->
        <div class="header-section">
          <h1 class="app-title" :style="textStyles.title()">Learnity</h1>
          <h2 class="page-title" :style="textStyles.subtitle()">Đăng Nhập</h2>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
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
                placeholder=""
              />
            </div>
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
                placeholder=""
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="password-toggle"
              >
                <Icon 
                  :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" 
                  width="20" 
                  height="20" 
                />
              </button>
            </div>
          </div>

          <!-- Forgot Password -->
          <div class="forgot-password">
            <button 
              type="button" 
              @click="goToForgotPassword"
              class="forgot-link"
              :style="textStyles.link()"
            >
              Quên mật khẩu
            </button>
          </div>

          <!-- Remember Me -->
          <div class="checkbox-group">
            <label class="checkbox-container">
              <input 
                v-model="rememberMe" 
                type="checkbox" 
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label" :style="textStyles.body()">
                Lưu đăng nhập
              </span>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message" :style="textStyles.error()">
            <Icon icon="mdi:alert-circle-outline" width="20" height="20" class="error-icon" />
            {{ errorMessage }}
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="login-button"
            :style="{
              backgroundColor: colors.buttonBg,
              color: colors.buttonText,
              ...textStyles.textButton()
            }"
          >
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>

          <!-- Register Link -->
          <div class="register-section">
            <span :style="textStyles.body()">Bạn mới biết đến Learnity? </span>
            <button 
              type="button"
              @click="goToRegister"
              class="register-link"
              :style="textStyles.link()"
            >
              Đăng ký
            </button>
          </div>

          <!-- Divider -->
          <div class="divider">
            <span :style="textStyles.body()">Hoặc</span>
          </div>

          <!-- Google Login -->
          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="loading"
            class="google-button"
            :style="{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              ...textStyles.textButton()
            }"
          >
            <Icon icon="mdi:google" width="20" height="20" class="google-icon" />
            Tiếp tục với Google
          </button>

          <!-- Footer Links -->
          <div class="footer-links">
            <span :style="textStyles.caption()">
              Điều khoản sử dụng | Chính sách riêng tư
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-content {
  width: 100%;
  max-width: 400px;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.app-title {
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.page-title {
  margin: 0;
  line-height: 1.2;
}

/* Styles cho form đăng nhập */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  margin: 0;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  z-index: 2;
  color: #6C6C6C;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 52px;
  border: 2px solid #E5E5E5;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #0F2A19;
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6C6C6C;
  padding: 4px;
}

.forgot-password {
  text-align: right;
  margin-top: -12px;
}

.forgot-link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.checkbox-group {
  margin: 8px 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #0F2A19;
  border-radius: 4px;
  position: relative;
  background: white;
}

.checkbox-input:checked + .checkbox-custom {
  background: #0F2A19;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  margin: 0;
}

.error-message {
  text-align: center;
  margin: -8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background-color: rgba(220, 38, 38, 0.1);
  border-radius: 8px;
}

.error-icon {
  color: #dc2626;
  flex-shrink: 0;
}

.login-button {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-section {
  text-align: center;
  margin: 8px 0;
}

.register-link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #E5E5E5;
  z-index: 1;
}

.divider span {
  background: inherit;
  padding: 0 16px;
  position: relative;
  z-index: 2;
}

.google-button {
  width: 100%;
  padding: 16px;
  border: 2px solid #E5E5E5;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.google-button:hover:not(:disabled) {
  border-color: #D1D5DB;
  transform: translateY(-1px);
}

.google-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  color: #4285F4;
}

.footer-links {
  text-align: center;
  margin-top: 24px;
}

@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }
  
  .header-section {
    margin-bottom: 32px;
  }
  
  .login-form, .button-group {
    gap: 16px;
  }
}
</style>