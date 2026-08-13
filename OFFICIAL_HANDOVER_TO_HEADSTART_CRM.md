# 📄 OFFICIAL TECHNICAL INTEGRATION HANDOVER SPECIFICATION
## Headstart CRM × Niva Bupa Candidate Assessment Platform

**Document Version**: 2.1 (Production Specification)  
**Prepared For**: Headstart CRM Technical & Development Team  
**Prepared By**: Assessment Tool Platform Engineering Team  
**System Name**: Niva Bupa Candidate Assessment Platform  
**Status**: Production Integration Specification — Pending Headstart Credentials & Webhook Configuration  
**Last Updated**: 13 August 2026  

---

## 1. Overview & System Responsibility

The **Assessment Tool** is an independent exam platform that handles candidate exams, timers, automated proctoring, automated scoring, result calculation, and report card generation. **Headstart CRM** manages candidate sourcing, document verification, and candidate–assessment assignment.

| System | Primary Responsibility |
|--------|------------------------|
| **Headstart CRM** | Candidate sourcing, document verification, application tracking, candidate–assessment assignment |
| **Assessment Tool** (Ours) | Exam engine, timer/auto-submit, AI proctoring, automated scoring, result calculation, report card generation |

---

## 2. Environment Base URLs

| Environment | Service Name | Base URL |
|-------------|--------------|----------|
| **Production** | Integration REST API Engine | `https://api.niva.greatcampus.in` |
| **Production** | Candidate Exam Portal | `https://niva.greatcampus.in` |
| **Production** | HR Admin Portal | `https://admin.niva.greatcampus.in` |

---

## 3. Authentication Standard




All HTTP requests between Assessment Tool and Headstart CRM must be secured via HTTPS (TLS 1.3).
- **Content-Type**: `application/json`
- **Unauthorized Status**: Requests missing or providing an invalid API Key return `HTTP 401 Unauthorized`.

| API Direction | Authentication Method |
|---------------|───────────────────────|
| **API 1** (We call CRM) | Credential provided by Headstart CRM. Header style (`x-api-key` or `Authorization: Bearer`) inserted once received. |
| **API 2** (We call CRM) | Same credential and header style as API 1, provided by Headstart CRM. |
| **API 3** (CRM calls us) | `x-api-key` authentication required (or `Authorization: Bearer <KEY>`). |
| **API 4, 5, 6** (Webhooks to CRM) | Authenticated per Headstart's webhook-receiver requirements once shared. |

### Our Outbound API Key (for Headstart to call API 3):
Use this header when calling our Active Assessments API (API 3):
```http
x-api-key: <ASSESSMENT_TOOL_API_KEY>
```
*Note: The actual production key value will be shared with the Headstart team over a separate secure credential channel for production security compliance.*

---

## 4. Timezone & Timestamp Standard

| Parameter | Standard Value |
|-----------|----------------|
| **Format** | ISO 8601 Extended (`YYYY-MM-DDTHH:mm:ss.sssZ`) |
| **Timezone** | UTC (Coordinated Universal Time) |
| **Example** | `2026-08-13T12:30:00.000Z` |

---

## 5. Rate Limiting & Security Headers

| Parameter | Value |
|-----------|-------|
| **Rate Limit** | **100 requests per minute per IP address** |
| **Exceeded Limit Response** | `HTTP 429 Too Many Requests` |

### Security & Throttling Headers Included:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 98
X-RateLimit-Reset: 60
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
```

---

## 6. Webhook Delivery & Retry Policy

Applies to outbound webhooks: **API 4, API 5, API 6**.

- **Delivery**: Dispatched asynchronously immediately after the trigger event.
- **Retry 1**: +5 seconds
- **Retry 2**: +30 seconds
- **Retry 3**: +5 minutes (final attempt)
- **Success Criteria**: Headstart's webhook receiver must return an `HTTP 2xx` response (`200 OK` or `202 Accepted`) within 5 seconds.

---

## 7. Complete API Specifications

Two APIs are called BY us TO Headstart (API 1, API 2). Four APIs are provided BY us TO Headstart for Headstart to consume/receive (API 3–6).

---

### A. Assessment Tool ➔ Headstart CRM (We call, CRM responds)

#### [ IN ] API 1 — Candidate Details & Verification API
- **Purpose**: Verify a candidate against CRM records during exam access form fill-up.
- **Method**: `POST`
- **Endpoint**: `${HEADSTART_CRM_BASE_URL}/api/v1/candidates/verify`

##### Sample Request (Sent by Assessment Tool to CRM):
```json
{
  "applicationId": "APP-882019"
}
```

##### Sample Success Response (Returned by CRM):
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

#### [ IN ] API 2 — Candidate Assessment Assignment API
- **Purpose**: Verify if a candidate is assigned to a specific assessment before granting exam access.
- **Method**: `POST`
- **Endpoint**: `${HEADSTART_CRM_BASE_URL}/api/v1/candidates/check-assignment`

##### Sample Request (Sent by Assessment Tool to CRM):
```json
{
  "applicationId": "APP-882019",
  "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b"
}
```

##### Sample Success Response (Returned by CRM):
```json
{
  "success": true,
  "assigned": true,
  "message": "Candidate is assigned to this assessment."
}
```

---

### B. Headstart CRM ➔ Assessment Tool (Headstart calls/receives)

#### [ OUT ] API 3 — Active Assessments List API
- **Purpose**: Provide the list of currently active assessments so candidates can be assigned from CRM.
- **Method**: `GET`
- **Endpoint**: `https://api.niva.greatcampus.in/api/v1/integration/headstart/assessments/active`

##### Sample Request Header (Sent by CRM):
```http
GET /api/v1/integration/headstart/assessments/active HTTP/1.1
Host: api.niva.greatcampus.in
x-api-key: <ASSESSMENT_TOOL_API_KEY>
Content-Type: application/json
```

##### Sample Success Response (Returned by Assessment Tool):
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

##### ❌ Without a valid API Key (401 Response):
```json
{
  "message": "Invalid or missing Headstart API key.",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

#### [ OUT ] API 4 — Assessment Status Webhook
- **Purpose**: Notify CRM in real-time when a candidate starts, submits, or gets security-locked.
- **Method**: `POST`
- **Target URL**: `${HEADSTART_WEBHOOK_STATUS_URL}`

##### Status Values & Trigger Conditions:
| Status | Sent When |
|--------|-----------|
| `Started` | Candidate begins the exam session |
| `Completed` | Candidate submits or finishes the exam |
| `LOCKED` | Proctoring/security violation locks the exam (3 warnings threshold) |
| `UNLOCKED` | HR Admin manually unlocks the exam session |

##### Sample Webhook Payload (Pushed to CRM):
```json
{
  "candidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b",
  "status": "Completed",
  "startTime": "2026-08-13T12:32:00.000Z"
}
```

##### Expected Response from CRM:
```json
{
  "success": true,
  "received": true
}
```

---

#### [ OUT ] API 5 — Assessment Result Webhook
- **Purpose**: Send total candidate marks, percentage, and pass/fail result to CRM post-exam.
- **Method**: `POST`
- **Target URL**: `${HEADSTART_WEBHOOK_RESULT_URL}`

##### Sample Webhook Payload (Pushed to CRM):
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

#### [ OUT ] API 6 — Section-wise Report Card Webhook
- **Purpose**: Send a 6-section breakdown report card to CRM for candidate profile.
- **Method**: `POST`
- **Target URL**: `${HEADSTART_WEBHOOK_REPORT_URL}`

##### Sample Webhook Payload (Pushed to CRM):
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

## 8. Error Response Standard

All endpoints follow a unified error format with standard HTTP status codes:

### HTTP 400 — Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid Application ID parameter provided."
}
```

### HTTP 401 — Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or missing API key in request header."
}
```

### HTTP 404 — Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "error": "Not Found",
  "message": "Requested assessment or candidate record not found."
}
```

### HTTP 429 — Too Many Requests
```json
{
  "success": false,
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 60 seconds."
}
```

### HTTP 500 — Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An internal error occurred. Please contact technical support."
}
```

---

## 9. What We Need From Headstart CRM (Checklist)

To activate the two APIs we call (API 1, API 2) and the three webhooks we push to Headstart (API 4, API 5, API 6), the Headstart technical team needs to provide the following five items:

- [ ] **1. Headstart CRM Base URL**: (to replace `${HEADSTART_CRM_BASE_URL}` in API 1 and API 2)
- [ ] **2. Headstart Credentials**: Outbound API key and header style (`x-api-key` or `Authorization: Bearer`) for API 1 and API 2
- [ ] **3. Webhook Receiver URL (Status)**: Receiver URL for Assessment Status events (to replace `${HEADSTART_WEBHOOK_STATUS_URL}` in API 4)
- [ ] **4. Webhook Receiver URL (Result)**: Receiver URL for Assessment Result events (to replace `${HEADSTART_WEBHOOK_RESULT_URL}` in API 5)
- [ ] **5. Webhook Receiver URL (Report)**: Receiver URL for Section-wise Report Card events (to replace `${HEADSTART_WEBHOOK_REPORT_URL}` in API 6)

---

## 10. Pre-Handover Verification Checklist (Internal Audit)

- [x] **API 1 / API 2 Direction**: Headstart CRM ➔ Assessment Tool (Candidate details verification & assignment check)
- [x] **Live API Key Security**: Production API key removed from plain text in public documentation and rotated safely
- [x] **API 3 Routing**: Candidate entry link format (`https://niva.greatcampus.in/aa-2812`) verified against live Next.js routing
- [x] **API 4 Webhook Statuses**: Full lifecycle status values (`Started`, `Completed`, `LOCKED`, `UNLOCKED`) verified in NestJS engine
- [x] **API 6 Section Object Structure**: 6-section breakdown with consistent field set verified in database schema
- [x] **Live Hostinger VPS Verification**: Endpoints verified on live production domain `https://api.niva.greatcampus.in`

---
*— End of Version 2.1 Handover Specification Document —*
