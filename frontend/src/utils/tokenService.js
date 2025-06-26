// src/utils/tokenService.js
import axios from 'axios';

let refreshTimeout = null;

// schedule a background refresh
export function scheduleProactiveRefresh() {
  const raw = localStorage.getItem('accessToken');
  if (!raw) return;

  let expMs;
  try {
    expMs = JSON.parse(atob(raw.split('.')[1])).exp * 1000;
  } catch {
    console.warn('Malformed token');
    return;
  }

  const now      = Date.now();
  const timeLeft = expMs - now;

  if (timeLeft <= 0) {
    triggerRefresh();
    return;
  }

  const buffer = Math.min(60_000, timeLeft / 2);
  const msToRefresh = timeLeft - buffer;

  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(triggerRefresh, msToRefresh);
}

async function triggerRefresh() {
  const rt = localStorage.getItem('refreshToken');
  if (!rt) {
    logoutAndRedirect();
    return;
  }

  try {
    const { data } = await axios.post('/api/auth/refresh', JSON.stringify(rt), {
      headers: { 'Content-Type': 'application/json' },
    });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    scheduleProactiveRefresh();
  } catch {
    logoutAndRedirect();
  }
}

export function logoutAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/auth?expired=1';
}
