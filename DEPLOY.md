# 배포 가이드

## 배포 구성

| 구성 요소 | 서비스 | 비용 |
|-----------|--------|------|
| Frontend/Backend (Next.js) | Vercel | 무료 (hobby tier) |
| Database (MySQL) | PlanetScale | 무료 tier |
| 도메인 | Vercel 제공 | 무료 (`your-app.vercel.app`) |

---

## Step 1: PlanetScale 데이터베이스 생성

1. https://planetscale.com 접속
2. **GitHub 계정으로 가입/로그인**
3. **Create a new database** 클릭
4. 설정:
   - Name: `calendar-vote`
   - Region: `ap-northeast-1` (Tokyo - 한국과 가까움)
5. **Get connection strings** 클릭
6. **Connect with: Prisma** 선택
7. 연결 문자열 복사해두기:
   ```
   mysql://[username]:[password]@[host]/calendar-vote?sslaccept=strict
   ```

---

## Step 2: Vercel 배포

1. https://vercel.com 접속
2. **GitHub 계정으로 로그인**
3. **Add New... → Project**
4. **Import** `rlaxhwhd/Calendar_meet` 저장소
5. **Environment Variables** 설정:

| Name | Value |
|------|-------|
| `DATABASE_URL` | PlanetScale에서 복사한 연결 문자열 |
| `NEXT_PUBLIC_BASE_URL` | 배포 후 Vercel이 제공하는 URL 입력 |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오 개발자 콘솔에서 발급받은 JavaScript 키 |

6. **Deploy** 클릭

---

## Step 3: 데이터베이스 마이그레이션

### 방법 1: 로컬에서 실행 (권장)

```bash
# PlanetScale 연결 문자열로 마이그레이션
DATABASE_URL="mysql://[username]:[password]@[host]/calendar-vote?sslaccept=strict" npx prisma db push
```

### 방법 2: PlanetScale 콘솔에서 직접 SQL 실행

1. PlanetScale 대시보드 → 데이터베이스 선택
2. **Branches** → `main` 클릭
3. **Console** 탭에서 SQL 직접 실행

---

## Step 4: 배포 후 확인사항

1. Vercel 대시보드에서 배포 URL 확인 (예: `calendar-meet.vercel.app`)
2. `NEXT_PUBLIC_BASE_URL` 환경변수를 배포 URL로 업데이트
3. Vercel에서 **Redeploy** 실행

---

## 환경변수 요약

```env
# 프로덕션 환경변수
DATABASE_URL="mysql://[username]:[password]@[host]/calendar-vote?sslaccept=strict"
NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"
NEXT_PUBLIC_KAKAO_JS_KEY="your_kakao_javascript_key"
```

---

## 카카오 공유 기능 설정 (선택)

1. https://developers.kakao.com 접속
2. 애플리케이션 추가
3. **앱 키** → **JavaScript 키** 복사
4. **플랫폼** → **Web** 추가
   - 사이트 도메인: `https://your-app.vercel.app`
5. Vercel 환경변수에 `NEXT_PUBLIC_KAKAO_JS_KEY` 추가

---

## 문제 해결

### PlanetScale 연결 오류
- `sslaccept=strict` 파라미터가 연결 문자열에 포함되어 있는지 확인
- Prisma 스키마에 `relationMode = "prisma"` 설정 확인

### Vercel 빌드 실패
- `postinstall` 스크립트에 `prisma generate`가 설정되어 있음 (자동 실행됨)
- 빌드 로그에서 Prisma 관련 오류 확인

### 환경변수 미적용
- Vercel에서 환경변수 변경 후 **Redeploy** 필요
