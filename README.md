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
├─ main.jsx               # 애플리케이션 진입점
├─ components/            # 재사용 가능한 UI 컴포넌트
│  ├─ auth/               # 인증 관련 컴포넌트
│  │  └─ LoginForm.jsx    # 로그인 폼 컴포넌트
│  ├─ layout/             # 레이아웃 관련 컴포넌트
│  │  └─ Header.jsx       # 헤더 컴포넌트
│  └─ map/                # 지도 관련 컴포넌트
│     └─ NaverMap.jsx     # 네이버 지도 컴포넌트
├─ context/               # React Context API
│  └─ AuthContext.jsx     # 인증 상태 관리 컨텍스트
├─ hooks/                 # 커스텀 React Hooks
│  └─ useAuth.js          # 인증 관련 커스텀 훅
├─ pages/                 # 페이지 컴포넌트
│  ├─ LoginPage.jsx       # 로그인 페이지
│  └─ MainPage.jsx        # 메인 대시보드 페이지
├─ services/              # API 서비스 함수
│  └─ authService.js      # 인증 관련 API 서비스
└─ utils/                 # 유틸리티 함수
   └─ NaverMapData.js     # 지도 데이터 생성 유틸리티
```

### 주요 파일 설명

#### 핵심 컴포넌트

- **App.jsx**: 애플리케이션의 라우팅 설정 및 전역 상태 관리를 담당합니다.
- **NaverMap.jsx**: 네이버 지도 API를 초기화하고 실시간 데이터를 가져와 표시합니다.
- **AuthContext.jsx**: 사용자 인증 상태를 전역적으로 관리하는 Context API 구현체입니다.

#### 데이터 관련

- **NaverMapData.js**: 차량 충돌 예측 시스템의 API 응답을 시뮬레이션하는 샘플 데이터를 생성합니다. GeoJSON 형식으로 차량, 충돌, 경로 정보를 제공합니다.
- **authService.js**: 백엔드 API와 통신하여 인증 관련 기능을 처리합니다. 현재는 모의 데이터로 구현되어 있습니다.

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
   # .env 파일 생성
   cp .env.example .env
   # NAVER Maps API 키 설정
   # VITE_NAVER_MAPS_CLIENT_ID=your_client_id_here
   ```

4. 개발 서버 실행

   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 http://localhost:5173 접속

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

## 환경 변수

프로젝트에서 사용되는 환경 변수 목록:

| 변수명                    | 설명                          | 기본값 |
| ------------------------- | ----------------------------- | ------ |
| VITE_NAVER_MAPS_CLIENT_ID | 네이버 지도 API 클라이언트 ID | -      |
| VITE_API_URL              | 백엔드 API URL                | /api   |

## 백엔드 API 연동

이 프로젝트는 RESTful API와 WebSocket을 통해 차량 충돌 예측 시스템의 백엔드와 통신합니다. 백엔드 API 명세는 다음과 같습니다:

### RESTful API 엔드포인트

- **기본 URL**: `http://{서버 주소}:5000/api/`
- **시스템 상태 정보**: `GET /api/status`
- **비디오 프레임 경계**: `GET /api/video-bounds`
- **처리 시작**: `GET /api/start-processing`
- **처리 중지**: `GET /api/stop-processing`
- **비디오 피드**: `GET /video_feed`

### WebSocket 이벤트

- **기본 연결 URL**: `ws://{서버 주소}:5000/socket.io/`
- **지도 업데이트 이벤트**: `map_update`
- **비디오 프레임 이벤트**: `video_frame`

자세한 API 사양은 백엔드 개발팀에 문의하세요.

## 라이센스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.
