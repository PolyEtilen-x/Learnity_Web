export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser()

    const publicRoutes = ['login', 'register', 'index', 'forgot-password']
    
    if (!user && !publicRoutes.includes(to.name as string)) {
        return navigateTo('/login')
    }
})