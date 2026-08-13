# 📄 OFFICIAL INTEGRATION HANDOVER DOCUMENT
## Assessment Tool × Headstart CRM Technical Integration

**Prepared For**: Headstart CRM Technical & Development Team  
**Prepared By**: Assessment Tool Platform Engineering Team  
**Environment**: Production Live  
**Security Standard**: HTTPS (TLS 1.3), Inbound API Key Validation, Rate Limited (100 req/min), HSTS Hardened  
**Document Date**: 13 August 2026  

---

## 🌐 1. Live System Base URLs

| Service / Portal | Production HTTPS Base URL | Purpose |
|------------------|---------------------------|---------|
| ⚙️ **Integration REST API Engine** | `https://api.niva.greatcampus.in` | All Headstart integration endpoints & webhooks |
| 🎓 **Candidate Exam Portal** | `https://niva.greatcampus.in/[slug]` | Candidate exam entry point (e.g. `https://niva.greatcampus.in/aa-2812`) |
| 🛡️ **HR Admin Evaluation Portal** | `https://admin.niva.greatcampus.in` | HR Administration & Assessment Session Management |

---

## 📦 2. Deliverables Provided BY Assessment Tool (TO Headstart CRM)

Below are the exact endpoints, webhooks, and JSON payloads **our Assessment Tool provides to Headstart CRM**.

---

### API 3 · Active Assessments Endpoint `[GET]`
- **Ownership**: Assessment Tool (Provided to Headstart)
- **Method**: `GET`
- **Full Production Endpoint**:  
  `https://api.niva.greatcampus.in/api/v1/integration/headstart/assessments/active`
- **Authentication Header Required**:  
  `x-api-key: <ASSESSMENT_TOOL_INBOUND_KEY>` *(or `Authorization: Bearer <ASSESSMENT_TOOL_INBOUND_KEY>`)*

#### Request Format (Sent by Headstart CRM):
```http
GET /api/v1/integration/headstart/assessments/active HTTP/1.1
Host: api.niva.greatcampus.in
x-api-key: your_provided_inbound_api_key
Content-Type: application/json
```

#### Response Format (Provided by Assessment Tool):
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

### API 4 · Assessment Status Webhook `[POST]`
- **Ownership**: Assessment Tool (Pushed to Headstart Webhook Receiver)
- **Trigger**: Real-time event when a candidate starts (`Started`) or submits (`Completed`) an exam.
- **Method**: `POST`
- **Target Receiver URL**: Provided by Headstart Team (`HEADSTART_WEBHOOK_STATUS_URL`)

#### Request Payload (Pushed to Headstart CRM):
```json
{
  "candidateId": "CRM-CAND-882019",
  "applicationId": "APP-882019",
  "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b",
  "status": "Completed",
  "startTime": "2026-08-13T12:32:00.000Z"
}
```

---

### API 5 · Assessment Result Webhook `[POST]`
- **Ownership**: Assessment Tool (Pushed to Headstart Webhook Receiver)
- **Trigger**: Fired immediately post-submission after database score calculation.
- **Method**: `POST`
- **Target Receiver URL**: Provided by Headstart Team (`HEADSTART_WEBHOOK_RESULT_URL`)

#### Request Payload (Pushed to Headstart CRM):
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

### API 6 · Section-wise Report Card Webhook `[POST]`
- **Ownership**: Assessment Tool (Pushed to Headstart Webhook Receiver)
- **Trigger**: Fired post-submission alongside API 5 with 6-section breakdown.
- **Method**: `POST`
- **Target Receiver URL**: Provided by Headstart Team (`HEADSTART_WEBHOOK_REPORT_URL`)

#### Request Payload (Pushed to Headstart CRM):
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

## 📥 3. Specifications Consumed FROM Headstart CRM

Below are the exact schemas **our Assessment Tool expects Headstart CRM to provide**.

### API 1 · Candidate Details / Verification `[GET]`
- **Called By**: Assessment Tool
- **Target Endpoint**: `${HEADSTART_CRM_BASE_URL}/api/candidates/verify?applicationId={appId}`
- **Authentication**: Sent in header as `Authorization: Bearer <HEADSTART_CRM_API_KEY>`

#### Expected Response from Headstart CRM:
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

### API 2 · Candidate Assignment Check `[POST]`
- **Called By**: Assessment Tool
- **Target Endpoint**: `${HEADSTART_CRM_BASE_URL}/api/candidates/check-assignment`
- **Request Body**:
  ```json
  {
    "applicationId": "APP-882019",
    "assessmentId": "c3a011c4-542a-4fbd-9c58-b1c64c50308b"
  }
  ```

#### Expected Response from Headstart CRM:
```json
{
  "success": true,
  "assigned": true,
  "message": "Candidate is assigned to this assessment."
}
```

---

## 🔑 4. Action Item Checklist for Headstart CRM Team

To complete live production integration, the **Headstart CRM Technical Team** must return the following 5 parameters to us:

- [ ] **1. Headstart CRM Base URL**: `HEADSTART_CRM_BASE_URL` (e.g. `https://api.headstartcrm.com`)
- [ ] **2. Headstart CRM Outbound API Key**: `HEADSTART_CRM_API_KEY` (Token for us to call API 1 & 2)
- [ ] **3. Webhook Receiver URL (Status)**: `HEADSTART_WEBHOOK_STATUS_URL` (Endpoint for API 4)
- [ ] **4. Webhook Receiver URL (Result)**: `HEADSTART_WEBHOOK_RESULT_URL` (Endpoint for API 5)
- [ ] **5. Webhook Receiver URL (Report)**: `HEADSTART_WEBHOOK_REPORT_URL` (Endpoint for API 6)

---

## 🛡️ 5. Security & Infrastructure Handover Summary

- **HTTPS / SSL**: SSL encrypted (Let's Encrypt TLS 1.3 with HSTS enabled).
- **Inbound Authentication**: Enforced via `x-api-key` header on API 3 (`401 Unauthorized` on missing/invalid keys).
- **Rate Limiting**: Enforced via NestJS Throttler at **100 requests / minute per IP**.
- **Internal Ports**: Ports `3000`, `3001`, `4000`, `5432` are strictly firewalled on VPS; only HTTPS (`443`) and SSH (`22`) are exposed.
