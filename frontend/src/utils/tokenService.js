// src/utils/tokenService.js
import api from '../api/api'

let refreshTimeout = null

// schedule a background refresh
export function scheduleProactiveRefresh() {
  const raw = localStorage.getItem('accessToken')
  if (!raw) return

  let expMs
  try {
    expMs = JSON.parse(atob(raw.split('.')[1])).exp * 1000
  } catch {
    console.warn('Malformed token')
    return
  }

  const now      = Date.now()
  const timeLeft = expMs - now

  if (timeLeft <= 0) {
    triggerRefresh()
    return
  }

  const buffer      = Math.min(60_000, timeLeft / 2)
  const msToRefresh = timeLeft - buffer

  clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(triggerRefresh, msToRefresh)
}

async function triggerRefresh() {
  const rt = localStorage.getItem('refreshToken')
  if (!rt) {
    logoutAndRedirect()
    return
  }

  try {
    // note: baseURL is already '/api'
    const { data } = await api.post(
      '/auth/refresh',
      // server still expects a raw string body:
      JSON.stringify(rt),
      { headers: { 'Content-Type': 'application/json' } }
    )

    // swap in the new tokens
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    // schedule the next refresh cycle
    scheduleProactiveRefresh()
  } catch {
    logoutAndRedirect()
  }
}

export function logoutAndRedirect() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  // send user back to the login page
  window.location.href = '/auth'
}
