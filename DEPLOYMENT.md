# 배포 가이드 (Vercel + TiDB Cloud)

이 문서는 Calendar Vote 프로젝트를 Vercel과 TiDB Cloud를 사용하여 배포하는 방법을 설명합니다.

---

## 목차

1. [사전 준비](#1-사전-준비)
2. [TiDB Cloud 데이터베이스 설정](#2-tidb-cloud-데이터베이스-설정)
3. [Vercel 배포](#3-vercel-배포)
4. [환경변수 설정](#4-환경변수-설정)
5. [데이터베이스 마이그레이션](#5-데이터베이스-마이그레이션)
6. [도메인 설정 (가비아)](#6-도메인-설정-가비아)
7. [카카오 SDK 설정 (선택사항)](#7-카카오-sdk-설정-선택사항)
8. [배포 확인 및 문제 해결](#8-배포-확인-및-문제-해결)

---

## 1. 사전 준비

### 필요한 계정
- [GitHub](https://github.com) 계정 (코드 저장소)
- [Vercel](https://vercel.com) 계정 (GitHub로 가입 권장)
- [TiDB Cloud](https://tidbcloud.com) 계정

### 로컬 환경
- Node.js 18.x 이상
- Git 설치
- 프로젝트가 GitHub에 푸시되어 있어야 함

### GitHub에 프로젝트 푸시
```bash
# 아직 GitHub에 올리지 않았다면
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/calendar-vote.git
git push -u origin main
```

---

## 2. TiDB Cloud 데이터베이스 설정

### 2.1 TiDB Cloud 가입 및 클러스터 생성

1. [TiDB Cloud](https://tidbcloud.com)에 가입 (GitHub 계정 권장)
2. **Create Cluster** 클릭
3. **Serverless** 선택 (무료 티어)
4. 클러스터 설정:
   - **Cluster Name**: `calendar-vote` (원하는 이름)
   - **Cloud Provider**: AWS
   - **Region**: `ap-northeast-1` (Tokyo) - 한국에서 가장 가까움
   - **Spending Limit**: `$0` (무료 사용)
5. **Create** 클릭 (생성에 약 1분 소요)

### 2.2 데이터베이스 생성

1. 클러스터 생성 완료 후 **SQL Editor** 또는 **Chat2Query** 탭 클릭
2. 다음 SQL 실행:
```sql
CREATE DATABASE IF NOT EXISTS calendar_vote;
```

### 2.3 연결 문자열 얻기

1. 클러스터 페이지에서 **Connect** 버튼 클릭
2. **Connect With**: `Prisma` 선택
3. **Generate Password** 클릭하여 비밀번호 생성
4. 표시된 연결 문자열 복사

```
mysql://[username]:[password]@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/calendar_vote?sslaccept=strict
```

> **중요**:
> - 비밀번호는 한 번만 표시됩니다. 안전한 곳에 저장하세요.
> - 데이터베이스 이름을 `calendar_vote`로 변경하세요 (기본값 `test` → `calendar_vote`)

### 2.4 TiDB Cloud Serverless 무료 티어

- **행 기반 스토리지**: 5GiB
- **요청 단위**: 월 5천만 RU (Request Units)
- **무료 사용**: 소규모 프로젝트에 충분

---

## 3. Vercel 배포

### 3.1 Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. **Add New...** → **Project** 클릭
3. **Import Git Repository**에서 GitHub 저장소 선택
4. `calendar-vote` 저장소 **Import** 클릭

### 3.2 프로젝트 설정

1. **Framework Preset**: Next.js (자동 감지됨)
2. **Root Directory**: `./` (기본값)
3. **Build and Output Settings**: 기본값 유지
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next`

### 3.3 환경변수 설정 (배포 전)

**Environment Variables** 섹션에서 다음 변수 추가:

| Name | Value |
|------|-------|
| `DATABASE_URL` | TiDB Cloud에서 복사한 연결 문자열 |
| `NEXT_PUBLIC_BASE_URL` | `https://your-project.vercel.app` (배포 후 수정) |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오 JavaScript 키 (선택사항) |

### 3.4 배포

1. **Deploy** 버튼 클릭
2. 빌드 로그 확인 (약 1-3분 소요)
3. 배포 완료 후 URL 확인

---

## 4. 환경변수 설정

### 4.1 배포 후 URL 업데이트

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. `NEXT_PUBLIC_BASE_URL` 값을 실제 배포 URL로 수정
   - 예: `https://calendar-vote.vercel.app`
4. **Redeploy** 필요 (Deployments → 최신 배포 → ⋮ → Redeploy)

---

## 5. 데이터베이스 마이그레이션

### 5.1 로컬에서 스키마 푸시

TiDB Cloud는 `prisma db push`를 사용합니다.

```bash
# .env 파일에 TiDB Cloud DATABASE_URL 설정 후
npx prisma db push
```

### 5.2 스키마 확인

```bash
# Prisma Studio로 데이터베이스 확인
npx prisma studio
```

### 5.3 TiDB Cloud에서 직접 확인

1. TiDB Cloud Dashboard → 클러스터 선택
2. **SQL Editor** 탭
3. 테이블 확인:
```sql
USE calendar_vote;
SHOW TABLES;
```

---

## 6. 도메인 설정 (가비아)

### 6.1 Vercel에 도메인 추가

1. Vercel Dashboard → 프로젝트 → **Settings** → **Domains**
2. 구매한 도메인 입력 (예: `calendar-vote.com`)
3. **Add** 클릭

### 6.2 가비아 DNS 설정

1. [가비아](https://www.gabia.com) 로그인
2. **My가비아** → **도메인 관리** → 해당 도메인 **관리**
3. **DNS 설정** 또는 **DNS 레코드 관리** 클릭
4. 기존 레코드 삭제 후 다음 레코드 추가:

| 타입 | 호스트 | 값/위치 | TTL |
|-----|-------|--------|-----|
| A | @ | `76.76.21.21` | 3600 |
| CNAME | www | `cname.vercel-dns.com` | 3600 |

> **참고**:
> - `@`는 루트 도메인 (예: `calendar-vote.com`)
> - `www`는 서브도메인 (예: `www.calendar-vote.com`)

### 6.3 SSL 인증서

- Vercel이 **자동으로 Let's Encrypt SSL 인증서 발급**
- DNS 전파 후 자동 적용 (몇 분 ~ 최대 48시간)

### 6.4 환경변수 업데이트

도메인 연결 완료 후:
1. Vercel → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_BASE_URL`을 커스텀 도메인으로 변경:
   ```
   https://calendar-vote.com
   ```
3. **Redeploy** 실행

---

## 7. 카카오 SDK 설정 (선택사항)

카카오 공유 기능을 사용하려면:

### 7.1 카카오 개발자 등록

1. [Kakao Developers](https://developers.kakao.com)에 가입
2. **내 애플리케이션** → **애플리케이션 추가하기**
3. 앱 이름 입력 후 저장

### 7.2 플랫폼 등록

1. 생성된 앱 클릭 → **앱 설정** → **플랫폼**
2. **Web 플랫폼 등록**
3. 사이트 도메인 추가:
   - `http://localhost:3000` (개발용)
   - `https://your-domain.com` (배포용)

### 7.3 JavaScript 키 확인

1. **앱 설정** → **앱 키**
2. **JavaScript 키** 복사
3. Vercel 환경변수 `NEXT_PUBLIC_KAKAO_JS_KEY`에 설정

---

## 8. 배포 확인 및 문제 해결

### 8.1 배포 확인 체크리스트

- [ ] 메인 페이지 접속 가능
- [ ] 방 생성 가능
- [ ] 투표 기능 동작
- [ ] 공유 링크 생성 가능
- [ ] 커스텀 도메인 접속 가능
- [ ] HTTPS 정상 동작

### 8.2 일반적인 문제 해결

#### 빌드 실패: Prisma Client 에러
```
Error: @prisma/client did not initialize yet
```
**해결**: `package.json`의 build 스크립트에 `prisma generate` 확인
```json
"build": "prisma generate && next build"
```

#### 데이터베이스 연결 실패
```
Can't reach database server
```
**해결**:
- DATABASE_URL 확인 (특히 비밀번호, 데이터베이스 이름)
- TiDB Cloud 클러스터가 **Active** 상태인지 확인
- 연결 문자열에 `?sslaccept=strict` 포함 확인

#### 테이블이 없음 에러
```
Table 'calendar_vote.Room' doesn't exist
```
**해결**: 로컬에서 `npx prisma db push` 실행

#### 환경변수 미적용
**해결**: 환경변수 변경 후 **Redeploy** 필요

#### DNS 전파 지연
**해결**: 최대 48시간 대기 (보통 몇 분 ~ 몇 시간)

### 8.3 로그 확인

**Vercel 로그:**
1. Vercel Dashboard → 프로젝트 → **Deployments**
2. 배포 선택 → **Functions** 탭
3. 에러 로그 확인

**TiDB Cloud 로그:**
1. TiDB Cloud Dashboard → 클러스터 선택
2. **Diagnosis** → **Slow Query** 또는 **Statement Analysis**

---

## 비용 안내

### Vercel (Hobby Plan - 무료)
- 월 100GB 대역폭
- 서버리스 함수 실행 시간 제한
- 커스텀 도메인 지원
- 상업적 사용 시 Pro 플랜 필요 ($20/월)

### TiDB Cloud (Serverless - 무료)
- 5GiB 행 기반 스토리지
- 월 5천만 Request Units
- 자동 스케일링
- 소규모 프로젝트에 충분

### 가비아 도메인
- .com 도메인: 약 15,000원/년
- .co.kr 도메인: 약 18,000원/년

> **참고**: 무료 티어는 개인 프로젝트나 프로토타입에 적합합니다.

---

## 요약 체크리스트

1. [ ] GitHub에 코드 푸시
2. [ ] TiDB Cloud 클러스터 생성 (Serverless)
3. [ ] TiDB Cloud에서 `calendar_vote` 데이터베이스 생성
4. [ ] 연결 문자열 복사
5. [ ] Vercel 프로젝트 생성 및 GitHub 연결
6. [ ] 환경변수 설정 (DATABASE_URL, NEXT_PUBLIC_BASE_URL)
7. [ ] 배포 실행
8. [ ] `npx prisma db push`로 스키마 동기화
9. [ ] 가비아 DNS 설정 (A 레코드, CNAME)
10. [ ] 도메인 연결 확인 및 SSL 확인
11. [ ] `NEXT_PUBLIC_BASE_URL` 커스텀 도메인으로 업데이트
12. [ ] 기능 테스트
13. [ ] (선택) 카카오 SDK 설정

---

## 참고 자료

- [Vercel Documentation](https://vercel.com/docs)
- [TiDB Cloud Documentation](https://docs.pingcap.com/tidbcloud)
- [Prisma with TiDB](https://www.prisma.io/docs/guides/database/tidb)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [가비아 DNS 설정 가이드](https://customer.gabia.com/manual/domain/279/1248)
