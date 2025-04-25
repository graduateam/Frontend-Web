# Smart Road Reflector 관리 시스템

스마트 도로 반사경 관리 시스템은 교통 안전을 위한 실시간 모니터링 웹 애플리케이션입니다. 이 시스템은 네이버 지도 API를 활용하여 도로 상의 차량과 위험 요소를 실시간으로 시각화합니다.

## 프로젝트 개요

- **프로젝트명**: Smart Road Reflector
- **버전**: 1.0.0
- **개발 환경**: React 19.0.0, Vite 6.3.1
- **지도 API**: NAVER Maps API

## 주요 기능

- 사용자 인증 및 로그인 시스템
- 네이버 지도 기반 실시간 모니터링
- 차량 위치 및 이동 경로 추적
- 충돌 위험 감지 및 경고 알림
- 실시간 데이터 시각화

## 프로젝트 구조 및 주요 파일 설명

```
src/
├─ App.jsx                # 메인 애플리케이션 컴포넌트, 라우팅 설정
├─ App.css                # 앱 기본 스타일
├─ main.jsx               # 애플리케이션 진입점
├─ index.css              # 전역 스타일
├─ assets/                # 정적 자원
│  ├─ fonts/              # 폰트 파일
│  │  ├─ pretendard/      # Pretendard 폰트
│  │  └─ seoulnamsan/     # SeoulNamsan 폰트
│  ├─ images/             # 이미지 파일
│  │  ├─ icons/           # 아이콘 이미지
│  │  └─ logos/           # 로고 이미지
│  └─ styles/             # 스타일 파일
│     ├─ colors.css       # 색상 변수 및 클래스
│     ├─ font.css         # 폰트 정의 및 타이포그래피
│     └─ global.css       # 전역 스타일 및 레이아웃
├─ components/            # 재사용 가능한 UI 컴포넌트
│  ├─ auth/               # 인증 관련 컴포넌트
│  │  └─ LoginForm.jsx    # 로그인 폼 컴포넌트
│  ├─ camera/             # 카메라 관련 컴포넌트
│  │  ├─ CameraDetailsPanel.jsx # 카메라 상세 정보 패널
│  │  ├─ CameraVideo.jsx  # 카메라 비디오 컴포넌트
│  │  ├─ CollisionLogTable.jsx # 충돌 로그 테이블
│  │  ├─ PanelHeader.jsx  # 패널 헤더 컴포넌트
│  │  └─ hooks/           # 카메라 관련 훅
│  │     ├─ useCollisionLogs.js # 충돌 로그 관리 훅
│  │     └─ usePanelAnimation.js # 패널 애니메이션 훅
│  ├─ common/             # 공통 UI 컴포넌트
│  │  ├─ Button.jsx       # 버튼 컴포넌트
│  │  └─ Input.jsx        # 입력 필드 컴포넌트
│  ├─ layout/             # 레이아웃 관련 컴포넌트
│  │  └─ Header.jsx       # 헤더 컴포넌트
│  └─ map/                # 지도 관련 컴포넌트
│     ├─ NaverMap.jsx     # 네이버 지도 컴포넌트
│     ├─ MapMarkerLayer.jsx # 지도 마커 레이어
│     ├─ MapBoundaryLayer.jsx # 지도 경계 레이어
│     ├─ CameraDropdown.jsx # 카메라 선택 드롭다운
│     └─ hooks/           # 지도 관련 훅
│        ├─ useNaverMapInit.js # 지도 초기화 훅
│        ├─ useMapMarkers.js # 지도 마커 관리 훅
│        ├─ useMapBoundaries.js # 지도 경계 관리 훅
│        ├─ useMapDataUpdater.js # 지도 데이터 업데이트 훅
│        └─ useCameraFocus.js # 카메라 포커스 훅
├─ context/               # React Context API
│  └─ AuthContext.jsx     # 인증 상태 관리 컨텍스트
├─ hooks/                 # 커스텀 React Hooks
│  └─ useAuth.js          # 인증 관련 커스텀 훅
├─ pages/                 # 페이지 컴포넌트
│  ├─ LoginPage.jsx       # 로그인 페이지
│  └─ MainPage.jsx        # 메인 대시보드 페이지
├─ services/              # API 서비스 함수
│  ├─ authService.js      # 인증 상태 관리 서비스
│  └─ api/                # API 통신 모듈
│     ├─ apiClient.js     # 중앙 HTTP 클라이언트
│     ├─ authApi.js       # 인증 관련 API
│     ├─ cameraApi.js     # 카메라 관련 API
│     └─ mapApi.js        # 지도 데이터 관련 API
└─ utils/                 # 유틸리티 함수
   ├─ NaverMapData.js     # 지도 데이터 생성 유틸리티
   └─ CameraData.js       # 카메라 데이터 관리 유틸리티
```

### 주요 파일 설명

#### 핵심 컴포넌트

- **App.jsx**: 애플리케이션의 라우팅 설정 및 전역 상태 관리를 담당합니다.
- **NaverMap.jsx**: 네이버 지도 API를 초기화하고 실시간 데이터를 가져와 표시합니다.
- **CameraDetailsPanel.jsx**: 선택된 카메라의 상세 정보 및 충돌 예측 로그를 표시합니다.
- **AuthContext.jsx**: 사용자 인증 상태를 전역적으로 관리하는 Context API 구현체입니다.

#### API 관련 파일

- **apiClient.js**: 모든 HTTP 요청을 처리하는 중앙 클라이언트로, 인증 토큰 관리, 에러 처리 등을 담당합니다.
- **authApi.js**: 로그인, 로그아웃 등 인증 관련 API 호출을 담당합니다.
- **cameraApi.js**: 카메라 정보 조회 등 카메라 관련 API 호출을 담당합니다.
- **mapApi.js**: 지도 데이터, 충돌 예측 등 지도 관련 API 호출을 담당합니다.

#### 스타일링 시스템

- **colors.css**: 브랜드 색상 시스템 정의 및 색상 유틸리티 클래스를 제공합니다.
- **font.css**: 커스텀 폰트 및 타이포그래피 시스템을 정의합니다.
- **global.css**: 전체 레이아웃 및 공통 스타일을 정의합니다.

#### 데이터 관련

- **NaverMapData.js**: 차량 충돌 예측 시스템의 API 응답을 시뮬레이션하는 샘플 데이터를 생성합니다. GeoJSON 형식으로 차량, 충돌, 경로 정보를 제공합니다.
- **CameraData.js**: 카메라 정보를 관리하고 가상 API 호출을 시뮬레이션합니다.
- **authService.js**: 인증 상태를 관리하고 로컬 스토리지를 통해 토큰을 유지합니다.

## 개발 환경 설정

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상 또는 yarn 1.22.0 이상

### 로컬 개발 환경 설정

1. 저장소 복제

   ```bash
   git clone https://github.com/yourusername/smart-road-reflector.git
   cd smart-road-reflector
   ```

2. 의존성 설치

   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 환경 변수 설정

   ```bash
   # .env.local 파일 생성
   cp .env.example .env.local
   # 필요한 환경 변수를 설정
   # VITE_NAVER_MAPS_CLIENT_ID=your_client_id_here
   # VITE_API_BASE_URL=/api
   # VITE_USE_REAL_API=false
   ```

4. 개발 서버 실행

   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 http://localhost:5173 접속

## 백엔드 API 연동

이 프로젝트는 RESTful API를 통해 스마트 도로 반사경 시스템의 백엔드와 통신합니다. 현재는 개발 편의를 위해 모의 데이터를 사용하고 있으며, 실제 백엔드 서버와의 연동이 용이하도록 설계되어 있습니다.

### API 구조

프론트엔드는 다음과 같은 구조로 API를 호출합니다:

```
services/
│
├─ api/
│  ├─ apiClient.js      # 기본 HTTP 요청 처리
│  ├─ authApi.js        # 인증 관련 API
│  ├─ cameraApi.js      # 카메라 관련 API
│  └─ mapApi.js         # 지도 데이터 관련 API
```

### 응답 형식

모든 API 응답은 다음과 같은 JSON 형식을 따릅니다:

```json
{
  "success": true,
  "data": { ... },  // 요청 성공 시 반환 데이터
  "message": "..."  // 선택적인 메시지
}
```

또는 오류 시:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "오류 메시지"
  }
}
```

### 주요 API 엔드포인트

#### 인증 API

- **로그인**: `POST /api/auth/login`
- **로그아웃**: `POST /api/auth/logout`
- **사용자 프로필 조회**: `GET /api/auth/profile`
- **토큰 갱신**: `POST /api/auth/refresh-token`

#### 카메라 API

- **모든 카메라 조회**: `GET /api/cameras`
- **카메라 상세 정보 조회**: `GET /api/cameras/:id`
- **카메라 통계 정보 조회**: `GET /api/cameras/:id/stats`
- **카메라 상태 업데이트**: `PATCH /api/cameras/:id/status`

#### 지도 데이터 API

- **지도 업데이트 데이터 조회**: `GET /api/map/update`
- **충돌 예측 데이터 조회**: `GET /api/map/collisions`
- **차량 데이터 조회**: `GET /api/map/vehicles`
- **카메라 경계 데이터 조회**: `GET /api/map/boundaries`
- **특정 카메라 경계 조회**: `GET /api/map/boundaries/:id`

### 데이터 모델

#### GeoJSON 형식

모든 위치 데이터는 [GeoJSON](https://geojson.org/) 형식을 따릅니다. 주요 구조:

- **포인트 (점)**

  ```json
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [경도, 위도]
    },
    "properties": {
      // 다양한 속성
    }
  }
  ```

- **폴리곤 (다각형)**
  ```json
  {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [경도1, 위도1],
          [경도2, 위도2],
          // ...
          [경도1, 위도1]  // 첫 번째 점과 동일 (닫힌 다각형)
        ]
      ]
    },
    "properties": {
      // 다양한 속성
    }
  }
  ```

### 주요 객체 속성

#### 카메라 객체

```json
{
  "id": 1,
  "name": "카메라 1",
  "location": {
    "latitude": 37.5676805,
    "longitude": 126.9764147
  },
  "status": "active" // "active", "inactive", "maintenance"
}
```

#### 차량 객체 (GeoJSON Feature)

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [경도, 위도]
  },
  "properties": {
    "id": 123,
    "type": "vehicle",
    "heading": "45.2",
    "speed": "12.5",
    "speed_kph": "45.0",
    "timestamp": "2023-01-01T12:34:56.789Z",
    "is_collision_risk": false,
    "ttc": null
  }
}
```

#### 충돌 예측 객체 (GeoJSON Feature)

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [경도, 위도]
  },
  "properties": {
    "id": "123_456",
    "type": "collision",
    "vehicle_ids": [123, 456],
    "ttc": "2.5", // 충돌까지의 예상 시간(초)
    "timestamp": "2023-01-01T12:34:56.789Z"
  }
}
```

### 모의 데이터에서 실제 API로 전환하기

프로젝트는 개발 중에는 모의 데이터를 사용하고, 실제 API와 연동할 준비가 되어 있습니다. 전환 방법:

1. `.env.local` 파일에서 `VITE_USE_REAL_API=true`로 설정
2. 필요한 API 엔드포인트를 구현
3. API 응답 형식이 위의 문서와 일치하는지 확인

자세한 API 연동 문서는 프로젝트 내 `API 연동 가이드.md` 파일을 참조하세요.

## 환경 변수

프로젝트에서 사용되는 환경 변수 목록:

| 변수명                    | 설명                          | 기본값               |
| ------------------------- | ----------------------------- | -------------------- |
| VITE_NAVER_MAPS_CLIENT_ID | 네이버 지도 API 클라이언트 ID | -                    |
| VITE_API_BASE_URL         | 백엔드 API 기본 URL           | /api                 |
| VITE_USE_REAL_API         | 실제 API 사용 여부            | false                |
| VITE_APP_NAME             | 애플리케이션 이름             | Smart Road Reflector |
| VITE_APP_VERSION          | 애플리케이션 버전             | 1.0.0                |

## 배포 가이드

### Docker 배포

#### Dockerfile 작성

프로젝트 루트 디렉토리에 `Dockerfile`을 생성합니다:

```dockerfile
# 빌드 스테이지
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 환경 변수 설정을 위한 스크립트
COPY ./env.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf 작성

```
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-service:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket.io/ {
        proxy_pass http://backend-service:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

#### env.sh 작성

```bash
#!/bin/sh

# HTML 파일 내에서 환경 변수 대체
envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html
```

#### Docker 이미지 빌드 및 실행

```bash
# 이미지 빌드
docker build -t smart-road-reflector:latest .

# 컨테이너 실행
docker run -d -p 8080:80 \
  -e VITE_NAVER_MAPS_CLIENT_ID=your_client_id_here \
  -e VITE_API_BASE_URL=/api \
  -e VITE_USE_REAL_API=true \
  --name smart-road-reflector \
  smart-road-reflector:latest
```

### GitHub Actions CI/CD 설정

#### .github/workflows/ci-cd.yml 작성

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Build project
        run: npm run build

      - name: Store build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/smart-road-reflector:latest,${{ secrets.DOCKER_HUB_USERNAME }}/smart-road-reflector:${{ github.sha }}

      # 쿠버네티스 또는 다른 배포 환경에 배포하는 단계를 여기에 추가할 수 있습니다.
```

### Docker Compose 설정 (백엔드와 프론트엔드 통합)

#### docker-compose.yml 작성

```yaml
version: "3.8"

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_NAVER_MAPS_CLIENT_ID=${NAVER_MAPS_CLIENT_ID}
      - VITE_API_BASE_URL=/api
      - VITE_USE_REAL_API=true
    depends_on:
      - backend
    restart: always

  backend:
    image: your-backend-image:latest
    container_name: backend-service
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend-data:/app/data
    restart: always

  # 필요한 경우 데이터베이스 서비스를 추가할 수 있습니다
  # database:
  #   image: postgres:14
  #   environment:
  #     - POSTGRES_USER=${DB_USER}
  #     - POSTGRES_PASSWORD=${DB_PASSWORD}
  #     - POSTGRES_DB=${DB_NAME}
  #   volumes:
  #     - postgres-data:/var/lib/postgresql/data
  #   restart: always

volumes:
  postgres-data:
```

## 라이센스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.
