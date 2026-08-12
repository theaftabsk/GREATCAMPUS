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

## 2. Total API Summary Matrix

| # | API Name | Direction | Type | Method | Endpoint / Webhook URL |
|---|----------|-----------|------|--------|------------------------|
| **1** | Candidate Verification | Headstart → Us | `IN` | `GET` | `${HEADSTART_CRM_BASE_URL}/api/candidates/verify` |
| **2** | Candidate Assignment Check | Headstart → Us | `IN` | `POST` | `${HEADSTART_CRM_BASE_URL}/api/candidates/check-assignment` |
| **3** | Active Assessments | Us → Headstart | `OUT` | `GET` | `http://localhost:4000/api/v1/integration/headstart/assessments/active` |
| **4** | Assessment Status Webhook | Us → Headstart | `OUT` | `POST Webhook` | `${HEADSTART_WEBHOOK_STATUS_URL}` |
| **5** | Assessment Result Webhook | Us → Headstart | `OUT` | `POST Webhook` | `${HEADSTART_WEBHOOK_RESULT_URL}` |
| **6** | Section Report Card Webhook | Us → Headstart | `OUT` | `POST Webhook` | `${HEADSTART_WEBHOOK_REPORT_URL}` |

---

## 3. Required Environment Variables Setup

Configure the following variables in `backend/.env`:

```env
# Port & Local Base URLs
PORT=4000
CANDIDATE_PORTAL_URL=http://localhost:3000

# Headstart CRM Base URL & Authentication (Provided by Headstart Team)
HEADSTART_CRM_BASE_URL=https://api.headstartcrm.com
HEADSTART_CRM_API_KEY=your_headstart_api_key_here

# Headstart Webhook Receiver Endpoints (Provided by Headstart Team)
HEADSTART_WEBHOOK_STATUS_URL=https://api.headstartcrm.com/webhooks/status
HEADSTART_WEBHOOK_RESULT_URL=https://api.headstartcrm.com/webhooks/result
HEADSTART_WEBHOOK_REPORT_URL=https://api.headstartcrm.com/webhooks/report-card
```

---

## 4. API Schemas & Technical Specification

### API 1 · Candidate Details / Verification API `[IN]`
- **Direction**: Headstart CRM → Assessment Tool
- **Method**: `GET`
- **Purpose**: Verifies candidate data against CRM using `applicationId` at exam form fill-up.

#### Request (Sent by Us to CRM):
```http
GET /api/candidates/verify?applicationId=APP-882019 HTTP/1.1
Host: api.headstartcrm.com
Authorization: Bearer <HEADSTART_CRM_API_KEY>
Content-Type: application/json
```

#### Response (Received from CRM):
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
- **Direction**: Headstart CRM → Assessment Tool
- **Method**: `POST`
- **Purpose**: Checks whether a candidate (`applicationId`) is assigned to a specific assessment (`assessmentId`).

#### Request (Sent by Us to CRM):
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

#### Response (Received from CRM):
```json
{
  "success": true,
  "assigned": true,
  "message": "Candidate is assigned to this assessment."
}
```

---

### API 3 · Active Assessments API `[OUT]`
- **Direction**: Assessment Tool → Headstart CRM
- **Method**: `GET`
- **Endpoint**: `http://localhost:4000/api/v1/integration/headstart/assessments/active`
- **Purpose**: Provides currently active assessment sessions for Headstart CRM candidate assignment.

#### Response (Provided to CRM):
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
- **Direction**: Assessment Tool → Headstart CRM
- **Method**: `POST`
- **Trigger**: Fired on exam session start (`Started`) and submission (`Completed`).

#### Webhook Request Payload (Sent to Headstart):
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
- **Direction**: Assessment Tool → Headstart CRM
- **Method**: `POST`
- **Trigger**: Fired post-submission after database result persistence.

#### Webhook Request Payload (Sent to Headstart):
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
- **Direction**: Assessment Tool → Headstart CRM
- **Method**: `POST`
- **Trigger**: Fired post-submission alongside API 5.

#### Webhook Request Payload (Sent to Headstart):
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

## 5. Information Required From Headstart Technical Team

To transition to production live integration, the Headstart Technical Team must provide:
1. `HEADSTART_CRM_BASE_URL`
2. `HEADSTART_CRM_API_KEY`
3. `HEADSTART_WEBHOOK_STATUS_URL`
4. `HEADSTART_WEBHOOK_RESULT_URL`
5. `HEADSTART_WEBHOOK_REPORT_URL`
