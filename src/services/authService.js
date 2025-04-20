// 백엔드 API URL 상수 (나중에 환경 변수로 관리)
const API_URL = "/api";

// 로그인 함수
export const login = async (credentials) => {
  try {
    // 실제 백엔드 연동 시 아래 주석 해제
    /*
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
    */

    // 백엔드 연동 전 임시 로직
    if (
      credentials.username === "admin" &&
      credentials.password === "password"
    ) {
      const mockData = {
        token: "mock-jwt-token",
        user: {
          id: 1,
          username: credentials.username,
          role: "ADMIN",
        },
      };
      localStorage.setItem("token", mockData.token);
      localStorage.setItem("user", JSON.stringify(mockData.user));
      return mockData;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// 로그아웃 함수
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// 인증 토큰 가져오기
export const getToken = () => {
  return localStorage.getItem("token");
};

// 사용자 인증 상태 확인
export const isAuthenticated = () => {
  return getToken() !== null;
};
