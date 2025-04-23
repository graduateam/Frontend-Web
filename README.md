# Smart Road Reflector

Smart Road Reflector는 지능형 교통정보 제공 시스템을 위한 관리자 웹 인터페이스입니다. 이 애플리케이션은 React 및 웹 기술을 사용하여 구축되었습니다.

## 프로젝트 구조

```
src/
│  App.css
│  App.jsx
│  index.css
│  main.jsx
│
├─assets
│  │  react.svg
│  │
│  ├─images
│  │  └─logos
│  │          circle-logo.svg
│  │          road-intersection.svg
│  │
│  └─styles
│          global.css
│          colors.css
│          font.css
│
├─components
│  ├─auth
│  │      LoginForm.jsx
│  │
│  ├─common
│  │      Button.jsx
│  │      Input.jsx
│  │
│  └─layout
│          Header.jsx
│
├─context
│      AuthContext.jsx
│
├─hooks
│      useAuth.js
│
├─pages
│      AdminDashboard.jsx
│      LoginPage.jsx
│
├─services
│      authService.js
│
└─utils
        validators.js
```

## 시작하기

### 필요 조건

- Node.js 16.x 이상
- npm 8.x 이상

### 설치

1. 저장소 클론:

```bash
git clone https://github.com/your-username/smart-road-reflector.git
cd smart-road-reflector
```

2. 의존성 설치:

```bash
npm install
```

3. 개발 서버 실행:

```bash
npm run dev
```

4. 브라우저에서 http://localhost:5173 열기

## 디자인 시스템

### 색상 시스템

프로젝트는 체계적인 색상 시스템을 사용합니다. 모든 색상은 `src/assets/styles/colors.css`에 정의되어 있으며 CSS 변수와 유틸리티 클래스로 제공됩니다.

#### 색상 변수 사용

```css
.my-element {
  background-color: var(--color-traffic-orange);
  color: var(--color-white);
  border: 1px solid var(--color-gray-20);
}
```

#### 색상 유틸리티 클래스 사용

백그라운드 색상:

```jsx
<div className="bg-traffic-orange">주황색 배경</div>
<div className="bg-traffic-orange-b1-60">60% 투명도의 어두운 주황색 배경</div>
<div className="bg-white">흰색 배경</div>
```

텍스트 색상:

```jsx
<p className="text-traffic-orange">주황색 텍스트</p>
<p className="text-white">흰색 텍스트</p>
<p className="text-off-black">거의 검정색 텍스트</p>
```

테두리 색상:

```jsx
<div className="border-traffic-orange">주황색 테두리</div>
<div className="border-gray-20">연한 회색 테두리</div>
```

#### 색상 카테고리

1. **브랜드 색상**: `--color-traffic-orange` (#FF5501)
2. **앰비언트 색상 (Saturation 변형)**: `--color-traffic-orange-s1` ~ `s3`
3. **앰비언트 색상 (Darkness 변형)**: `--color-traffic-orange-d1` ~ `d3`
4. **화이트 그라데이션**: `--color-traffic-orange-w1` ~ `w5`
5. **블랙 그라데이션**: `--color-traffic-orange-b1` ~ `b5`
6. **뉴트럴 색상**: `--color-white`, `--color-gray-10` ~ `--color-gray-50`, `--color-off-black`, `--color-pure-black`

### 폰트 시스템

프로젝트는 두 가지 주요 폰트를 사용합니다: Pretendard와 SeoulNamsan.
폰트 정의 및 스타일은 `src/assets/styles/font.css`에 있습니다.

#### 폰트 클래스 사용

이 프로젝트는 의미 기반 네이밍 대신 폰트 종류와 크기를 직접 나타내는 명확한 클래스명을 사용합니다.

Pretendard:

```jsx
<h1 className="pretendard-24-bold">24px 볼드 제목</h1>
<h2 className="pretendard-20-bold">20px 볼드 제목</h2>
<p className="pretendard-16">16px 레귤러 본문</p>
<p className="pretendard-16-bold">16px 볼드 본문</p>
<p className="pretendard-16-semibold">16px 세미볼드 본문</p>
<p className="pretendard-12">12px 레귤러 작은 텍스트</p>
```

SeoulNamsan:

```jsx
<h1 className="seoul-24-extrabold">24px 서울남산 제목</h1>
<h2 className="seoul-20-extrabold">20px 서울남산 부제목</h2>
<p className="seoul-16-light">16px 서울남산 본문</p>
<p className="seoul-16-extrabold">16px 서울남산 볼드 본문</p>
<p className="seoul-14-light">14px 서울남산 본문</p>
```

#### 네이밍 규칙

폰트 클래스 이름은 다음 형식을 따릅니다:
`[폰트명]-[크기px]-[두께]`

예:

- `pretendard-16-bold`: Pretendard 폰트, 16px, 볼드(700)
- `seoul-20-extrabold`: SeoulNamsan 폰트, 20px, 엑스트라볼드(800)
- `pretendard-14`: Pretendard 폰트, 14px, 레귤러(400) 두께

### 컴포넌트 사용

#### Button 컴포넌트

```jsx
// 기본 버튼 (주황색 배경)
<Button>기본 버튼</Button>

// 색상 변형
<Button variant="primary">주요 버튼</Button>
<Button variant="secondary">보조 버튼</Button>
<Button variant="tertiary">테두리 버튼</Button>

// 크기 변형
<Button size="small">작은 버튼</Button>
<Button size="medium">중간 버튼</Button>
<Button size="large">큰 버튼</Button>

// 클래스 추가
<Button className="my-custom-class">커스텀 클래스 버튼</Button>
```

#### Input 컴포넌트

```jsx
// 기본 입력
<Input
  placeholder="입력하세요"
  value={value}
  onChange={handleChange}
/>

// 색상 변형
<Input
  variant="default"
  placeholder="기본 입력"
/>
<Input
  variant="primary"
  placeholder="주요 입력"
/>
<Input
  variant="error"
  placeholder="오류 입력"
/>

// 유형
<Input
  type="password"
  placeholder="비밀번호"
/>

// 클래스 추가
<Input
  className="my-custom-class"
  placeholder="커스텀 클래스 입력"
/>
```
