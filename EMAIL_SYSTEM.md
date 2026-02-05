# Email System Implementation

This document explains the email sending system implemented in the Next.js application, which matches the functionality of the original PHP website.

## Features Implemented

### 1. **IP Detection & Country Lookup**
- Extracts client IP from request headers (handles proxy/forwarded IPs)
- Calls external API to get country code based on IP
- Uses country code to determine routing logic

### 2. **Foreign vs Domestic Lead Routing**

#### Foreign Countries (US, GB, CA, PH, NG, AU, CN, AE)
- Uses **Foreign Counter** (ID: 28)
- CC List: `nikitakarmaayurveda32@gmail.com`, `dheeraj33@gmail.com`, `usaorganicleads@gmail.com`
- Subject format: `ORGANIC KARMAAYURVEDA.COM | {COUNTRY} | {COUNTER}`

#### Domestic Countries (India + nearby regions)
- Uses **Domestic Counter** (ID: 25)
- Routes by disease type for Hindi-speaking regions (+91, +92, +977, +880, +94, +975):
  - **Kidney diseases** → `kidneydomestic@gmail.com`, `kidney@ayurvedickidneycare.com`
  - **Cancer** → `leadcancerkrm@gmail.com`, `cancer@ayurvedickidneycare.com`
  - **Others** → `leadotherskrm@gmail.com`, `other@ayurvedickidneycare.com`
- Subject format: `{COUNTRY_CODE} | {COUNTER} | Karma Ayurveda`

### 3. **Counter System**
- Maintains separate counters for foreign and domestic leads
- Increments counters in database for each valid submission
- Skips increment for test numbers: 9999999999, 9898989898

### 4. **Email Sending**
- Uses external mail API: `https://www.karmaayurveda.org/mail_api.php`
- Sends HTML formatted email with lead details
- Includes CC and BCC based on routing logic

### 5. **External API Integration**
- Validates IP via: `https://www.karmaayurveda.us/api/v2/checkIpAddress.php`
- Sends lead data to two external APIs:
  - `https://www.karmaayurveda.org/api/v2/add.php`
  - `https://www.karmaayurveda.us/api/v2/add.php`

### 6. **Database Storage**
- Stores all submissions in `enquiry` table
- Tracks: name, email, phone, disease, message, IP, user agent, duplicate status

## Disease Categories for Routing

### Kidney Diseases
- Kidney
- Acute Kidney Disease
- Chronic Kidney Disease
- Nephrotic Syndrome
- Polycystic Kidney Disease
- Creatinine
- Proteinuria
- Kidney Disease

### Cancer
- Cancer

### Others
All other disease types go to the "Others" category

## Email Template
The email template includes:
- Lead details (name, email, phone, disease, message)
- Country code
- Thank you message from Dr. Puneet Dhawan
- Branded styling with Karma Ayurveda colors

## Configuration
Environment variables used:
- `PUBLIC_SITE_URL` - Site URL for IP validation

## Counter Table Structure
```sql
CREATE TABLE tbl_counter (
  id INT(11) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  number INT(11) DEFAULT 0,
  status ENUM('1', '0') DEFAULT '1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Default counters:
- ID 25: Domestic Counter
- ID 28: Foreign Counter
