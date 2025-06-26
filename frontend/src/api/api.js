// src/api/api.js
import axios from 'axios'
import { scheduleProactiveRefresh, logoutAndRedirect } from '../utils/tokenService'

let isRefreshing = false
let refreshPromise = null

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        logoutAndRedirect()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = axios
          .post(
            '/api/auth/refresh',
            JSON.stringify(refreshToken),
            { headers: { 'Content-Type': 'application/json' } }
          )
          .then(res => {
            const { accessToken, refreshToken: newRefresh } = res.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefresh)
            scheduleProactiveRefresh()
            return accessToken
          })
          .catch(err => {
            logoutAndRedirect()
            throw err
          })
          .finally(() => {
            isRefreshing = false
          })
      }

      try {
        const newToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api
