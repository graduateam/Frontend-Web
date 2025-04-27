# 스마트 도로 반사경 시스템 API 연동 가이드

이 문서는 스마트 도로 반사경 시스템의 프론트엔드와 백엔드 간의 API 연동을 위한 가이드입니다.

## 목차

1. [소개](#소개)
2. [API 구조](#api-구조)
3. [환경 설정](#환경-설정)
4. [API 엔드포인트 설명](#api-엔드포인트-설명)
5. [인증 API](#인증-api)
6. [카메라 API](#카메라-api)
7. [지도 데이터 API](#지도-데이터-api)
8. [데이터 모델](#데이터-모델)
9. [모의 데이터에서 실제 API로 전환하기](#모의-데이터에서-실제-api로-전환하기)

## 소개

스마트 도로 반사경 시스템은 현재 프론트엔드에서 모의(mock) 데이터를 사용하여 개발되었습니다. 이 가이드는 백엔드 개발자가 필요한 API를 구현하고 프론트엔드와 연동하기 위한 정보를 제공합니다.

## API 구조

프론트엔드는 다음과 같은 구조로 API를 호출합니다:

```
services/
│
├─ api/
│  ├─ apiClient.js      # 기본 HTTP 요청 처리
│  ├─ authApi.js        # 인증 관련 API
│  ├─ cameraApi.js      # 카메라 관련 API
│  └─ mapApi.js         # 지도 데이터 관련 API
│
├─ authService.js       # 인증 상태 관리
└─ ...
```

## 환경 설정

프로젝트 루트에 `.env.local` 파일을 생성하여 다음 환경 변수를 설정할 수 있습니다:

```
# API 설정
VITE_API_BASE_URL=/api
VITE_USE_REAL_API=true  # true로 설정하면 실제 API 호출, false면 모의 데이터 사용

# 네이버 지도 API
VITE_NAVER_MAPS_CLIENT_ID=YOUR_CLIENT_ID
```

## API 엔드포인트 설명

모든 API 엔드포인트는 `VITE_API_BASE_URL` 환경 변수로 설정된 기본 URL에 상대 경로를 추가하여 구성됩니다.

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

## 인증 API

### 로그인

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "password"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "ADMIN"
    }
  }
  ```

### 로그아웃

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**: `{ "success": true }`

### 사용자 프로필 조회

- **URL**: `/auth/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**:
  ```json
  {
    "id": 1,
    "username": "admin",
    "role": "ADMIN",
    "name": "관리자",
    "email": "admin@example.com"
  }
  ```

### 토큰 갱신

- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**:
  ```json
  {
    "token": "NEW_JWT_TOKEN"
  }
  ```

## 카메라 API

### 모든 카메라 조회

- **URL**: `/cameras`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "카메라 1",
      "location": {
        "latitude": 37.5676805,
        "longitude": 126.9764147
      },
      "status": "active"
    },
    ...
  ]
  ```

### 카메라 상세 정보 조회

- **URL**: `/cameras/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**:
  ```json
  {
    "id": 1,
    "name": "카메라 1",
    "location": {
      "latitude": 37.5676805,
      "longitude": 126.9764147
    },
    "status": "active",
    "installation_date": "2023-01-01",
    "last_maintenance": "2023-06-01",
    "model": "Camera Model X1",
    "resolution": "1080p",
    "connection_status": "connected"
  }
  ```

### 카메라 통계 정보 조회

- **URL**: `/cameras/:id/stats`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**:
  ```json
  {
    "camera_id": 1,
    "uptime": 99.8,
    "total_detections": 15420,
    "total_collisions_predicted": 187,
    "avg_vehicles_per_hour": 523,
    "avg_speed": 34.8
  }
  ```

### 카메라 상태 업데이트

- **URL**: `/cameras/:id/status`
- **Method**: `PATCH`
- **Headers**: `Authorization: Bearer TOKEN`
- **Request Body**:
  ```json
  {
    "status": "maintenance"
  }
  ```
- **Response**: `{ "success": true }`

## 지도 데이터 API

### 지도 업데이트 데이터 조회

- **URL**: `/map/update`
- **Method**: `GET`
- **Query Parameters**: `camera_id` (선택적)
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**:
  ```json
  {
    "vehicles": [
      /* GeoJSON Feature 배열 */
    ],
    "collisions": [
      /* GeoJSON Feature 배열 */
    ],
    "paths": [
      /* GeoJSON Feature 배열 */
    ],
    "video_boundary": {
      /* GeoJSON Feature 객체 */
    },
    "video_boundaries": [
      /* GeoJSON Feature 배열 */
    ]
  }
  ```

### 충돌 예측 데이터 조회

- **URL**: `/map/collisions`
- **Method**: `GET`
- **Query Parameters**: `camera_id` (선택적)
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**:
  ```json
  [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [126.9774147, 37.5646805]
      },
      "properties": {
        "id": "123_456",
        "type": "collision",
        "vehicle_ids": [123, 456],
        "ttc": "2.5",
        "timestamp": "2023-01-01T12:34:56.789Z"
      }
    },
    ...
  ]
  ```

### 차량 데이터 조회

- **URL**: `/map/vehicles`
- **Method**: `GET`
- **Query Parameters**: `camera_id` (선택적)
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**: GeoJSON Feature 배열

### 모든 카메라 경계 조회

- **URL**: `/map/boundaries`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**: GeoJSON Feature 배열

### 특정 카메라 경계 조회

- **URL**: `/map/boundaries/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer TOKEN`
- **Response**: GeoJSON Feature 객체

## 데이터 모델

### GeoJSON 형식

모든 위치 데이터는 [GeoJSON](https://geojson.org/) 형식을 따릅니다. 주요 구조:

#### 포인트 (점)

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

#### 폴리곤 (다각형)

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [경도1, 위도1],
        [경도2, 위도2],
        [경도3, 위도3],
        ...,
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

## 모의 데이터에서 실제 API로 전환하기

프로젝트는 개발 중에는 모의 데이터를 사용하고, 실제 API와 연동할 준비가 되어 있습니다. 전환 방법:

1. `.env.local` 파일에서 `VITE_USE_REAL_API=true`로 설정
2. 필요한 API 엔드포인트를 구현
3. API 응답 형식이 위의 문서와 일치하는지 확인

### 테스트 방법

개발 모드에서 실행 시 콘솔에 API 호출 로그가 출력됩니다. 이를 통해 API 연동 상태를 확인할 수 있습니다.

```
npm run dev
```

로그에서 다음과 같은 메시지를 확인할 수 있습니다:

```
[API] GET /cameras 응답: 200 성공
[CameraData] API에서 3개 카메라 데이터 로드됨
```
