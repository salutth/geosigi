# Geosigi (거시기) — 외국인 유학생 정착·시민과학 PWA

## 프로젝트 개요
- RiverWatch Phase 3-2 확장 프로젝트
- 외국인 유학생(308,838명) 정착 지원 + 시민과학 참여 앱
- React + Vite + TypeScript PWA

## 기술 스택
- Frontend: React 19 + Vite + TypeScript
- 라우팅: react-router-dom
- 다국어: react-i18next (6개 언어: ko/en/zh/ja/vi/es)
- 백엔드: Supabase (서울 리전 nsuefjoovtbxlohwnigq)
- 배포: Cloudflare Pages

## 5개 탭 구조
1. 첫번째집 (Settle) — 정착 가이드 + AI 챗봇
2. 믿을수있어 (Trust) — 공인 정보 검증 + 1345 신고
3. 같이해요 (Do) — 시민과학 미션 (RiverWatch 연동)
4. 사람들 (People) — 커뮤니티 + 번역 채팅
5. 내이야기 (Story) — 활동 기록 + SNS 스토리

## 개발 명령어
```bash
npm run dev    # 개발 서버
npm run build  # 빌드
npm run preview # 빌드 미리보기
```

## 주요 디렉토리
- src/pages/ — 5개 탭 페이지 컴포넌트
- src/components/ — 공통 컴포넌트 (Header, BottomNav, LanguageSwitcher)
- src/i18n/locales/ — 6개 언어 번역 파일
- src/lib/ — Supabase 클라이언트 등 유틸리티

## 법적 준수사항
- 여권번호·비자번호·외국인등록번호 절대 수집 불가
- 개인정보 수집 시 항목별 동의 체크박스 필수
- 개인정보처리방침 6개 언어 게시 필수
- 3-Layer 데이터 구분: 공공집계 / 자발적동의 / 시민과학(익명)

## 환경 변수
- VITE_SUPABASE_URL — Supabase 프로젝트 URL
- VITE_SUPABASE_ANON_KEY — Supabase anon key
