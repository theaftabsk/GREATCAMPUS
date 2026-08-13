# 📄 OFFICIAL TECHNICAL INTEGRATION SPECIFICATION & HANDOVER SPECIFICATION
## Assessment Tool × Headstart CRM Technical Integration Document

**Document Version**: 2.0 (Production Final Specification)  
**Prepared For**: Headstart CRM Technical & Development Team  
**Prepared By**: Assessment Tool Platform Engineering Team  
**System Name**: Niva Bupa Candidate Assessment Platform  
**Document Status**: APPROVED & PRODUCTION LIVE  
**Last Updated**: 13 August 2026  

---

## 📋 Executive Overview & System Responsibility

The **Assessment Tool** is an independent exam & proctoring platform that handles candidate exams, proctoring timers, face-camera detection, automated scoring, result calculation, and report cards.  
**Headstart CRM** manages candidate sourcing, document verification, application tracking, and candidate-assessment assignments.

```text
┌────────────────────────┐                   ┌────────────────────────┐
│                        │ ── API 1 (Verify) ──► │                        │
│     Headstart CRM      │ ── API 2 (Assign) ──► │    Assessment Tool     │
│ (Source of Candidate)  │                       │   (Exam Engine & AI)   │
│                        │ ◄── API 3 (Active) ── │                        │
│                        │ ◄── API 4 (Status) ─ │                        │
│                        │ ◄── API 5 (Result) ─ │                        │
│                        │ ◄── API 6 (Report) ─ │                        │
└────────────────────────┘                   └────────────────────────┘
```

---

## 🌐 1. Environment Base URLs

| Environment | Service Name | Base URL | Purpose |
|-------------|--------------|----------|---------|
| **Production** | Integration REST API Engine | `https://api.niva.greatcampus.in` | All REST endpoints & Webhooks |
| **Production** | Candidate Exam Portal | `https://niva.greatcampus.in` | Candidate exam entry point |
| **Production** | HR Admin Evaluation Portal | `https://admin.niva.greatcampus.in` | HR administration & candidate locks |
| **Staging / Sandbox** | Staging Integration API | `https://staging-api.niva.greatcampus.in` | Staging testing environment |
| **Staging / Sandbox** | Staging Candidate Portal | `https://staging.niva.greatcampus.in` | Staging exam testing portal |

---

## 🔐 2. Authentication Standard

All API requests exchanged between **Assessment Tool** and **Headstart CRM** must be secured via HTTPS (TLS 1.3).

- **Header Style 1 (Primary)**: `x-api-key: <YOUR_SHARED_API_KEY>`
- **Header Style 2 (Alternative)**: `Authorization: Bearer <YOUR_SHARED_API_KEY>`
- **Content-Type**: `application/json`

*(Requests missing a valid API Key will return `HTTP 401 Unauthorized`.)*

---

## 🕒 3. Timezone & Timestamp Standard

- **Format**: **ISO 8601** Extended Format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Timezone**: **UTC (Coordinated Universal Time)**.
- **Example**: `2026-08-13T12:30:00.000Z`

---

## ⚡ 4. Rate Limiting & Security Headers

To protect the live infrastructure, rate limits are enforced at the API gateway layer:

- **Limit**: **100 requests per minute per IP address**.
- **Exceeded Limit Response**: `HTTP 429 Too Many Requests`.

### Response Rate Limit Headers Included:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 98
X-RateLimit-Reset: 60
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
```

---

## 🔁 5. Webhook Delivery & Retry Policy

For Outbound Webhooks (**API 4, API 5, API 6**):

1. **Delivery Guarantee**: Webhooks are dispatched asynchronously immediately post-event.
2. **Retry Strategy**: Exponential backoff with up to **3 retries**:
   - Retry 1: +5 seconds
   - Retry 2: +30 seconds
   - Retry 3: +5 minutes
3. **Success Requirement**: Headstart CRM Webhook receiver must return an `HTTP 2xx` response (e.g. `200 OK` or `202 Accepted`) within **5 seconds**.

---

## 📑 6. Complete API Specifications (API 1 to API 6)

---

### 📥 API 1 · Candidate Details & Verification API
- **Direction**: `Headstart CRM ➔ Assessment Tool` (IN)
- **Purpose**: Verify a candidate against CRM records when filling up the exam access form.
- **HTTP Method**: `POST`
- **Actual Endpoint URL**: `${HEADSTART_CRM_BASE_URL}/api/v1/candidates/verify`

#### Sample Request JSON (Sent by Assessment Tool to CRM):
```json
{
  "applicationId": "APP-882019"
}
```

#### Sample Success Response JSON (Returned by CRM to Assessment Tool):
```json
{
  "success": true,
  "crmCandidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "name": "Amit Sharma",
  "email": "amit.sharma@example.com",
  "phone": "9876543210"
}
```

---

### 📥 API 2 · Candidate Assessment Assignment API
- **Direction**: `Headstart CRM ➔ Assessment Tool` (IN)
- **Purpose**: Verify if a candidate is assigned to a specific assessment before granting exam access.
- **HTTP Method**: `POST`
- **Actual Endpoint URL**: `${HEADSTART_CRM_BASE_URL}/api/v1/candidates/check-assignment`

#### Sample Request JSON (Sent by Assessment Tool to CRM):
```json
{
  "applicationId": "APP-882019",
  "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b"
}
```

#### Sample Success Response JSON (Returned by CRM to Assessment Tool):
```json
{
  "success": true,
  "assigned": true,
  "message": "Candidate is assigned to this assessment."
}
```

---

### 📤 API 3 · Active Assessments List API
- **Direction**: `Assessment Tool ➔ Headstart CRM` (OUT)
- **Purpose**: Provide list of currently active assessments so candidates can be assigned from CRM.
- **HTTP Method**: `GET`
- **Actual Endpoint URL**: `https://api.niva.greatcampus.in/api/v1/integration/headstart/assessments/active`

#### Sample Request Header (Sent by CRM):
```http
GET /api/v1/integration/headstart/assessments/active HTTP/1.1
Host: api.niva.greatcampus.in
x-api-key: your_assessment_tool_inbound_key
Content-Type: application/json
```

#### Sample Success Response JSON (Returned by Assessment Tool):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b",
      "assessmentName": "Agency Unit Manager & ARM Banca Assessment",
      "assessmentSlug": "aa-2812",
      "assessmentLink": "https://niva.greatcampus.in/aa-2812",
      "duration": "45 Mins",
      "durationMins": 45,
      "totalQuestions": 60,
      "status": "ACTIVE",
      "activeFrom": "2026-08-13T11:26:29.657Z",
      "activeUntil": "2027-08-13T11:26:29.657Z",
      "createdAt": "2026-08-13T11:26:29.658Z"
    }
  ]
}
```

---

### 📤 API 4 · Assessment Status Webhook
- **Direction**: `Assessment Tool ➔ Headstart CRM` (OUT Webhook)
- **Purpose**: Notify CRM in real-time when a candidate starts, submits, or gets security locked.
- **HTTP Method**: `POST`
- **Target Callback Receiver URL**: `${HEADSTART_WEBHOOK_STATUS_URL}`

#### Sample Webhook Request Payload (Pushed to CRM):
```json
{
  "candidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b",
  "status": "Completed",
  "startTime": "2026-08-13T12:32:00.000Z"
}
```
*(Status values: `Started`, `Completed`, `LOCKED`, `UNLOCKED`)*

#### Expected Webhook Response from CRM:
```json
{
  "success": true,
  "received": true
}
```

---

### 📤 API 5 · Assessment Result Webhook
- **Direction**: `Assessment Tool ➔ Headstart CRM` (OUT Webhook)
- **Purpose**: Send total candidate marks, percentage, and pass/fail result to CRM post-exam.
- **HTTP Method**: `POST`
- **Target Callback Receiver URL**: `${HEADSTART_WEBHOOK_RESULT_URL}`

#### Sample Webhook Request Payload (Pushed to CRM):
```json
{
  "candidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b",
  "startTime": "2026-08-13T12:32:00.000Z",
  "endTime": "2026-08-13T12:44:12.000Z",
  "timeTaken": "12 mins 12 secs",
  "totalMarks": 60,
  "obtainedMarks": 48,
  "percentage": 80,
  "result": "Qualified"
}
```

---

### 📤 API 6 · Section-wise Report Card Webhook
- **Direction**: `Assessment Tool ➔ Headstart CRM` (OUT Webhook)
- **Purpose**: Send 6-section breakdown report card to CRM for candidate profile.
- **HTTP Method**: `POST`
- **Target Callback Receiver URL**: `${HEADSTART_WEBHOOK_REPORT_URL}`

#### Sample Webhook Request Payload (Pushed to CRM):
```json
{
  "candidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b",
  "candidateName": "Amit Sharma",
  "sections": [
    {
      "sectionName": "Communication & Customer Handling",
      "totalQuestions": 10,
      "totalMarks": 10,
      "obtainedMarks": 9,
      "percentage": 90
    },
    {
      "sectionName": "Advanced English",
      "totalQuestions": 10,
      "totalMarks": 10,
      "obtainedMarks": 8,
      "percentage": 80
    },
    {
      "sectionName": "Mental Ability & Reasoning",
      "totalQuestions": 10,
      "totalMarks": 10,
      "obtainedMarks": 8,
      "percentage": 80
    },
    {
      "sectionName": "Numerical & Mathematical Reasoning",
      "totalQuestions": 10,
      "totalMarks": 10,
      "obtainedMarks": 7,
      "percentage": 70
    },
    {
      "sectionName": "Banking & Financial Awareness",
      "totalQuestions": 10,
      "totalMarks": 10,
      "obtainedMarks": 8,
      "percentage": 80
    },
    {
      "sectionName": "Sales Orientation & Situational Judgement",
      "totalQuestions": 10,
      "totalMarks": 10,
      "obtainedMarks": 8,
      "percentage": 80
    }
  ],
  "totalMarks": 60,
  "obtainedMarks": 48,
  "percentage": 80,
  "result": "Qualified"
}
```

---

## ❌ 7. Error Response Standard

All endpoints follow a unified error format with standard HTTP status codes:

### HTTP 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid Application ID parameter provided."
}
```

### HTTP 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or missing API key in request header."
}
```

### HTTP 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "error": "Not Found",
  "message": "Requested assessment or candidate record not found."
}
```

### HTTP 429 Too Many Requests
```json
{
  "success": false,
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "ThrottlerException: Rate limit exceeded. Try again in 60 seconds."
}
```

### HTTP 500 Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An internal error occurred. Please contact technical support."
}
```

---

## 📌 8. Required Configuration Parameters (Checklist)

The Headstart CRM Team needs to provide the following 5 parameters to complete production deployment:

- [ ] **1. `HEADSTART_CRM_BASE_URL`**: e.g., `https://api.headstartcrm.com`
- [ ] **2. `HEADSTART_CRM_API_KEY`**: Outbound API key for us to call API 1 & API 2
- [ ] **3. `HEADSTART_WEBHOOK_STATUS_URL`**: Receiver URL for API 4 (Status Webhook)
- [ ] **4. `HEADSTART_WEBHOOK_RESULT_URL`**: Receiver URL for API 5 (Result Webhook)
- [ ] **5. `HEADSTART_WEBHOOK_REPORT_URL`**: Receiver URL for API 6 (Report Card Webhook)

---

## 📞 9. Technical Contacts & Support Matrix

For technical queries, API key exchanges, or staging testing:

- **Lead Systems Engineer**: Assessment Platform Architecture Team
- **Technical Support Email**: `tech-support@niva.greatcampus.in`
- **Live System API Status**: `https://api.niva.greatcampus.in` (HTTP 200 OK 🟢)

---
*— End of Technical Handover Specification Document —*
