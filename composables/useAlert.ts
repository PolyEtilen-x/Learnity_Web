export const useAlert = () => {
  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    // Bạn có thể tuỳ chỉnh cách hiển thị thông báo ở đây
    if (process.client) { 
      const alertClass = type === 'success' ? 'text-green-600' : 'text-red-600'
      const alertElement = document.createElement('div')
      alertElement.className = `fixed top-4 right-4 p-4 rounded-md bg-white shadow-lg ${alertClass}`
      alertElement.textContent = message
      document.body.appendChild(alertElement)
      
      // Tự động xoá sau 3 giây
      setTimeout(() => {
        alertElement.remove()
      }, 3000)
    }
  }

  return {
    success: (message: string) => showAlert(message, 'success'),
    error: (message: string) => showAlert(message, 'error')
  }
}