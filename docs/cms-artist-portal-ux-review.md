# Douren CMS – Artist Portal UX Review (staging PR-145)

URL reviewed: `https://pr-145.douren-cms.pages.dev/`  
Branch mentioned: `feat/artistportal`

Review date: 2026-01-24  
Reviewer: Pixel (assistant)

> Context: CMS users are **artists** who upload their work, plus **admins** who create/manage artists and invite codes. This review is from the perspective of a first‑time admin/artist landing on the staging site.

---

## 1. Onboarding & Authentication

### 1.1. Login vs Register flows

**Current behaviour**
- Top nav shows `首頁` and `登入`.
- Login page (`/login`) is clear: email + password + "忘記密碼？" link and a small `註冊` link.
- Register page (`/register`) copy:
  - Title: `註冊`
  - Description: "請輸入您的電子郵件、密碼和邀請碼以建立新帳戶".
  - Fields: 邀請碼, 電子郵件, 密碼.

**Issues / friction**
1. **No direct path for invited admins/users from landing page**
   - As an invited admin/artist, I land on `/` and only see `登入` – there is no prominent `註冊` entry point.
   - I have to go to `登入` first and then find the small `註冊` link.

2. **Invite‑code first mental model is not obvious**
   - The register form asks for `邀請碼` but does not explain:
     - Who should have an invite code.
     - Where to get it.
     - That different codes may imply different roles (admin vs artist).

3. **Registration error handling**
   - Using `DOUREN_MASTER` or `DOUREN-MASTER` with a valid email/password shows the error:
     - `Internal server error during validation`.
   - This is a backend issue, but from UX perspective:
     - The message is **too technical** (`Internal server error`).
     - It does not say whether the invite code is invalid, expired, or if the system is down.
     - The user has no next step (contact support? retry? different code?).

**Suggested improvements**
- **Add a clear `註冊` / "Create account" entry in the main nav**
  - Example: nav items: `首頁 | 登入 | 註冊`.

- **Clarify invite code usage on the register page**
  - Add helper text under 邀請碼, e.g.:  
    `請輸入管理員提供的邀請碼。若您沒有邀請碼，請聯絡團隊。`
  - If there are role‑specific codes, add a short note:  
    `不同邀請碼會決定您的權限（管理員 / 藝術家）。`

- **Improve error messages for registration**
  - Map backend errors to user‑friendly text:
    - Invalid/unknown invite code → `無效的邀請碼，請確認後再試一次。`
    - Expired invite → `此邀請碼已過期，請向管理員索取新的邀請碼。`
    - Generic 500 error → `系統目前無法處理您的註冊請求，請稍後再試或聯絡開發團隊。`
  - Log the technical detail to the server, but keep the UI message simple.

- **Optional: invite‑driven entry URL**
  - Support URLs like `https://.../register?code=DOUREN-XXXX` so artists can click a link from email/DM and have the `邀請碼` prefilled.

---

## 2. Invite Code UX (admin & artist)

> Note: I hit backend errors when trying to register with `DOUREN_MASTER` / `DOUREN-MASTER`, so I couldn’t reach the authenticated admin UI. Suggestions below are based on the current public flows + typical CMS patterns.

### 2.1. Where invite codes live today

- Currently, invite codes are **on the main page** (per product description), but the staging UI I saw doesn’t expose them prominently to logged‑out users.
- There is no obvious dedicated place for an admin to see/manage their own invite code(s) once logged in (blocked from testing due to 500s).

### 2.2. Proposed model for invite codes

**Goals:**
- Make it easy for an admin to **find & share** their invite code.
- Avoid leaking invite codes on the public landing page.
- Make the flow obvious to new artists who receive a code.

**Recommendations:**

1. **Move invite codes into an "Invite" / "Team" / "Artists" section in the authenticated admin UI**
   - Example navigation entry: `Artists` → `Invite` tab.
   - Show:
     - The admin’s own invite code(s).
     - Expiry / usage count.
     - A "Copy code" and/or "Copy invite link" button.

2. **Use invite *links* instead of raw codes in most flows**
   - Format: `https://cms.douren.../register?code=DOUREN-XXXX`
   - UI: `複製邀請連結` button that copies the full URL.
   - Artists mostly click links; codes are there as a fallback.

3. **Show invite code context on the register page**
   - If `?code=...` is present, prefill 邀請碼 and show:  
     `您是透過 XXX 的邀請加入。`
   - If an artist navigates to `/register` without a code, show instructions on how to get one.

4. **Avoid putting invite codes on the public landing page**
   - If you must surface them, restrict to a developer/staging banner only, not production.

---

## 3. General UI/UX Observations (Public / Auth Screens)

### 3.1. Language & audience

- The UI is in **Traditional Chinese**, which is presumably correct for your artists.
- Consider whether admins and artists need different copy:
  - Admin pages: more technical, about managing artists and content.
  - Artist pages: more friendly, focused on uploading and managing their own works.

### 3.2. Navigation clarity

- Current nav is minimal: `首頁 | 登入`.
- For a CMS, consider a more informative header once authenticated:
  - `儀表板 | 藝術家 | 作品 | 邀請碼 | 設定`

### 3.3. Feedback & loading states

- On registration, after clicking `註冊`:
  - There is no explicit loading state/spinner; the error just appears.
  - For slow network or heavy validation, a small spinner and disabled button would improve perceived responsiveness.

**Suggestions:**
- Disable `註冊` button while the request is in flight.
- Show a small inline spinner / "註冊中…" label.
- For success, redirect to a clear "Welcome" screen or dashboard.

---

## 4. Errors Encountered (for dev context)

### 4.1. Registration validation error

**Steps to reproduce**
1. Go to `https://pr-145.douren-cms.pages.dev/register`.
2. Enter:
   - 邀請碼: `DOUREN_MASTER` (and separately tested `DOUREN-MASTER`).
   - 電子郵件: `stangenartist+cms-test@gmail.com`.
   - 密碼: `TestPassword123!`.
3. Click `註冊`.

**Observed result**
- Form stays on `/register`.
- Error message appears above fields:
  - `Internal server error during validation`.
- Same result for both invite code variants.

**Expected result**
- Either:
  - Successful account creation and redirect to dashboard, or
  - A user‑friendly, specific error (invalid/expired invite, etc.).

**Probable causes (codebase hints to check in `c/douren-monorepo`)**
- Invite code validation API route throwing 500 instead of returning a 4xx with error info.
- Zod/Yup/validation layer throwing and not being handled.
- Env/secrets for invite code lookup not configured in this staging environment.

---

## 5. Next UX passes (blocked until backend fix)

Once the registration 500s are fixed and we can reach the admin UI, the next UX review should cover:

1. **Artist management flows**
   - Create artist
   - Edit artist (bio, avatar, social links)
   - Delete artist and confirm dialogs
   - Filter/search/sort artists

2. **Artwork upload flow**
   - Drag‑and‑drop vs file picker
   - Progress indicators and error handling (file size, format, etc.)
   - How metadata is collected (title, tags, series, pricing info?)

3. **Invite management**
   - Where admins see/manage invite codes
   - How many invites, expiration, revocation

4. **Role clarity**
   - Distinguish admin vs artist views (navigation, available actions).

Each of these flows should get the same treatment: step‑by‑step walkthrough, friction points, and concrete UI copy/layout recommendations.

---

## 6. Summary of Key UX Improvement Spots

**High impact / low effort**
1. Add `註冊` to the top navigation for clear onboarding.
2. Improve register page copy to explain invite codes (who, where from, role impact).
3. Replace `Internal server error during validation` with user‑friendly error messages.
4. Add loading state and disabled `註冊` button while registration is in progress.
5. Support invite links that prefill `邀請碼` (`/register?code=...`).

**High impact / medium effort**
1. Move invite code surface from public landing page to an authenticated "Invite" section.
2. Implement invite link generation (`複製邀請連結`).
3. Design dedicated onboarding flows for artists vs admins (different copy, nav entries).

This doc can be used as the basis for a Notion spec or a follow‑up UX/design jam.
