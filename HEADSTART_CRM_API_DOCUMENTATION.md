# 📘 Assessment Tool × Headstart CRM Integration API Documentation

**System Version**: v1.0.0  
**Platform**: Assessment Tool (Niva Bupa Health Insurance Recruitment Engine)  
**Target Systems**: Headstart CRM & Assessment Tool  

---

## 1. System Overview & Architecture

The **Assessment Tool** operates as an independent, high-performance proctored assessment engine that conducts candidate exams, tracks timing, manages AI proctoring, calculates results, and generates section-wise report cards. **Headstart CRM** manages candidate sourcing, application tracking, and document verification.

```
+------------------+                    +-----------------------+
|  Headstart CRM   | <--- REST APIs --->|    Assessment Tool    |
| (Application ID) |    & Webhooks      | (Proctored Exam Engine)|
+------------------+                    +-----------------------+
```

---

## 2. API Responsibility Summary

### 🅰️ PART A: APIs & Webhooks PROVIDED BY Assessment Tool (TO Headstart CRM)
These are endpoints and webhooks **our Assessment Tool provides to Headstart CRM**:
1. **API 3 (Active Assessments Endpoint)**: Headstart calls our REST endpoint to fetch active exams.
2. **API 4 (Assessment Status Webhook)**: We push `Started` & `Completed` real-time events to Headstart.
3. **API 5 (Assessment Result Webhook)**: We push total marks, percentage, and `Qualified/Not Qualified` status.
4. **API 6 (Section Report Card Webhook)**: We push 6-section detailed subject-wise marks breakdown.

### 🅱️ PART B: APIs CONSUMED FROM Headstart CRM (BY Assessment Tool)
These are endpoints **Headstart CRM provides to our Assessment Tool**:
1. **API 1 (Candidate Verification API)**: We call Headstart CRM to verify Application ID.
2. **API 2 (Candidate Assignment Check API)**: We call Headstart CRM to verify if candidate is assigned.

---

## 3. Total API Summary Matrix

| # | API Name | Ownership / Provided By | Direction | Type | Endpoint / Webhook URL |
|---|----------|------------------------|-----------|------|------------------------|
| **1** | Candidate Verification | **Headstart CRM** | IN | `GET` | `${HEADSTART_CRM_BASE_URL}/api/candidates/verify` |
| **2** | Candidate Assignment Check | **Headstart CRM** | IN | `POST` | `${HEADSTART_CRM_BASE_URL}/api/candidates/check-assignment` |
| **3** | Active Assessments | **Assessment Tool (Us)** | OUT | `GET` | `http://localhost:4000/api/v1/integration/headstart/assessments/active` |
| **4** | Assessment Status Webhook | **Assessment Tool (Us)** | OUT | `POST Webhook` | `${HEADSTART_WEBHOOK_STATUS_URL}` |
| **5** | Assessment Result Webhook | **Assessment Tool (Us)** | OUT | `POST Webhook` | `${HEADSTART_WEBHOOK_RESULT_URL}` |
| **6** | Section Report Card Webhook | **Assessment Tool (Us)** | OUT | `POST Webhook` | `${HEADSTART_WEBHOOK_REPORT_URL}` |

---

## 4. Required Environment Variables Setup

Configure the following variables in `backend/.env`:

```env
# Assessment Tool Local Engine URLs
PORT=4000
CANDIDATE_PORTAL_URL=http://localhost:3000

# Headstart CRM Base URL & Authentication (Headstart Team Provides)
HEADSTART_CRM_BASE_URL=https://api.headstartcrm.com
HEADSTART_CRM_API_KEY=your_headstart_api_key_here

# Headstart Webhook Receiver Endpoints (Headstart Team Provides)
HEADSTART_WEBHOOK_STATUS_URL=https://api.headstartcrm.com/webhooks/status
HEADSTART_WEBHOOK_RESULT_URL=https://api.headstartcrm.com/webhooks/result
HEADSTART_WEBHOOK_REPORT_URL=https://api.headstartcrm.com/webhooks/report-card
```

---

## 5. Technical Specifications — PART A: APIs Provided BY Assessment Tool (TO Headstart CRM)

### API 3 · Active Assessments API `[OUT]`
- **Provided By**: Assessment Tool
- **Consumed By**: Headstart CRM
- **Method**: `GET`
- **Endpoint**: `http://localhost:4000/api/v1/integration/headstart/assessments/active`
- **Purpose**: Provides currently active assessment sessions for Headstart CRM candidate assignment.

#### Request (Sent by Headstart to Us):
```http
GET /api/v1/integration/headstart/assessments/active HTTP/1.1
Host: localhost:4000
```

#### Response (Provided by Us to Headstart):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "assessmentId": "f6bdf6c4-9a77-42d6-bda7-e062fd505473",
      "assessmentName": "Agency Unit Manager & ARM Banca Assessment",
      "assessmentSlug": "aa-2812",
      "assessmentLink": "http://localhost:3000/aa-2812",
      "duration": "45 Mins",
      "durationMins": 45,
      "totalQuestions": 60,
      "status": "ACTIVE",
      "activeFrom": "2026-08-12T21:31:00.000Z",
      "activeUntil": null,
      "createdAt": "2026-08-12T21:31:52.816Z"
    }
  ]
}
```

---

### API 4 · Assessment Status Webhook `[OUT Webhook]`
- **Provided By**: Assessment Tool
- **Consumed By**: Headstart CRM
- **Method**: `POST`
- **Trigger**: Fired on exam session start (`Started`) and submission (`Completed`).

#### Webhook Request Payload (Sent by Us to Headstart):
```json
{
  "candidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "assessmentId": "f6bdf6c4-9a77-42d6-bda7-e062fd505473",
  "status": "Completed",
  "startTime": "2026-08-12T21:32:00.000Z"
}
```

---

### API 5 · Assessment Result Webhook `[OUT Webhook]`
- **Provided By**: Assessment Tool
- **Consumed By**: Headstart CRM
- **Method**: `POST`
- **Trigger**: Fired post-submission after database result persistence.

#### Webhook Request Payload (Sent by Us to Headstart):
```json
{
  "candidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "assessmentId": "f6bdf6c4-9a77-42d6-bda7-e062fd505473",
  "startTime": "2026-08-12T21:32:00.000Z",
  "endTime": "2026-08-12T21:44:12.000Z",
  "timeTaken": "12 mins 12 secs",
  "totalMarks": 60,
  "obtainedMarks": 48,
  "percentage": 80,
  "result": "Qualified"
}
```

---

### API 6 · Section-wise Report Card Webhook `[OUT Webhook]`
- **Provided By**: Assessment Tool
- **Consumed By**: Headstart CRM
- **Method**: `POST`
- **Trigger**: Fired post-submission alongside API 5.

#### Webhook Request Payload (Sent by Us to Headstart):
```json
{
  "candidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "assessmentId": "f6bdf6c4-9a77-42d6-bda7-e062fd505473",
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

## 6. Technical Specifications — PART B: APIs Consumed FROM Headstart CRM (BY Assessment Tool)

### API 1 · Candidate Details / Verification API `[IN]`
- **Provided By**: Headstart CRM
- **Consumed By**: Assessment Tool
- **Method**: `GET`
- **Purpose**: Verifies candidate data against CRM using `applicationId` at exam form fill-up.

#### Request (Sent by Us to Headstart):
```http
GET /api/candidates/verify?applicationId=APP-882019 HTTP/1.1
Host: api.headstartcrm.com
Authorization: Bearer <HEADSTART_CRM_API_KEY>
```

#### Response (Received from Headstart):
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

### API 2 · Candidate Assessment Assignment API `[IN]`
- **Provided By**: Headstart CRM
- **Consumed By**: Assessment Tool
- **Method**: `POST`
- **Purpose**: Checks whether a candidate (`applicationId`) is assigned to a specific assessment (`assessmentId`).

#### Request (Sent by Us to Headstart):
```http
POST /api/candidates/check-assignment HTTP/1.1
Host: api.headstartcrm.com
Authorization: Bearer <HEADSTART_CRM_API_KEY>
Content-Type: application/json

{
  "applicationId": "APP-882019",
  "assessmentId": "aa-2812"
}
```

#### Response (Received from Headstart):
```json
{
  "success": true,
  "assigned": true,
  "message": "Candidate is assigned to this assessment."
}
```

---

## 7. Information Required From Headstart Technical Team

To transition to production live integration, the Headstart Technical Team must provide:
1. `HEADSTART_CRM_BASE_URL`
2. `HEADSTART_CRM_API_KEY`
3. `HEADSTART_WEBHOOK_STATUS_URL`
4. `HEADSTART_WEBHOOK_RESULT_URL`
5. `HEADSTART_WEBHOOK_REPORT_URL`
