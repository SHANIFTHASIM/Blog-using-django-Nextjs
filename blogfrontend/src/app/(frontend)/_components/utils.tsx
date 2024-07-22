export const refreshToken = async (): Promise<string> => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) throw new Error('No refresh token available');

  const response = await fetch('http://127.0.0.1:8000/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refresh_token }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
};

interface FetchWithTokenOptions extends RequestInit {
  headers?: HeadersInit & { Authorization?: string };
}

export const fetchWithToken = async (url: string, options: FetchWithTokenOptions = {}) => {
  let accessToken = localStorage.getItem('access_token');

  const headers: HeadersInit & { Authorization?: string } = {
      ...options.headers,
  };

  if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
      accessToken = await refreshToken();
      headers['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(url, { ...options, headers });
  }

  return response;
};

  