# 🚀 Quick Setup Guide - Home Page Management

## आसान तरीका - 3 Steps में Setup करें!

### ✅ Step 1: Database Setup

**Option A: Browser से (सबसे आसान)**
1. अपने browser में जाएं: http://localhost:3000/admin/login
2. Admin login करें
3. फिर जाएं: http://localhost:3000/admin/setup-home
4. "🚀 Initialize Database" button पर click करें
5. Success message आने का wait करें

**Option B: Postman/Thunder Client से**
```
POST http://localhost:3000/api/admin/setup-home
```

**Option C: PowerShell से**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/setup-home" -Method POST
```

**Option D: phpMyAdmin/MySQL Workbench से**
1. phpMyAdmin open करें
2. अपना database (`kidney_health_db`) select करें
3. SQL tab पर जाएं
4. `scripts/create_home_sections_table.sql` file को open करें
5. पूरा content copy करें और execute करें ✅

---

### ✅ Step 2: Access Admin Panel

1. Browser में जाएं: http://localhost:3000/admin/login
2. Login करें (अपना admin credentials use करें)
3. Sidebar में "🌐 Home Page" link पर click करें

---

### ✅ Step 3: Content शुरू करें!

अब आप manage कर सकते हैं:

#### **Sections Tab**
- ✏️ Edit करें sections (Hero, About, Why Choose Us, etc.)
- 📷 Images upload/change करें
- 📝 Content edit करें
- 🔘 CTAs (Call-to-Action buttons) change करें
- 👁️ Active/Inactive toggle करें

#### **Features Tab**
- ✨ Feature cards add/edit करें
- 🎨 Icons upload करें
- 📋 Description update करें
- 🔢 Order change करें

---

## 📊 क्या-क्या Manage कर सकते हैं?

### Pre-configured Sections:

1. **Hero Section** (`hero`)
   - Main banner heading
   - Subtitle
   - Hero image
   - 2 CTA buttons

2. **Consultation Banner** (`consultation_banner`)
   - Free consultation message
   - Flag image
   - CTA button

3. **Trust Section** (`trust_section`)
   - Hospital information
   - Trust content
   - Image with certification

4. **About Us** (`about_us`)
   - Company description
   - Doctor image
   - 4 feature highlights (checkmarks)

5. **Why Choose Us** (`why_choose_us`)
   - Main description
   - 4 feature cards with icons
   - Rotating stamp image

6. **Contact CTA** (`contact_cta`)
   - Help message
   - Badges (trust indicators)
   - 2 CTA buttons

---

## 🎨 Image Upload कैसे करें?

### Section Images:
1. Section edit करते समय
2. "Or Upload Image" field में image select करें
3. या फिर "Image URL" में direct URL paste करें
4. Save करें

### Feature Icons:
1. Feature edit करते समय
2. "Or Upload Icon" में icon select करें
3. या "Icon URL" में URL paste करें
4. Save करें

**Images save होंगी:** `/public/uploads/home/`

---

## 🔧 Extra Features

### Display Order
- Numbers से order control करें (1, 2, 3...)
- छोटा number = पहले display होगा

### Active/Inactive
- Temporarily hide करें बिना delete किए
- Toggle करके on/off करें

### Extra Data (JSON)
Advanced customization के लिए:
```json
{
  "subtitle": "Your subtitle",
  "background": "linear-gradient(...)",
  "badges": ["Badge 1", "Badge 2"]
}
```

---

## 📱 API Endpoints

### Public API (Frontend के लिए)
```javascript
// सभी active sections और features fetch करें
const res = await fetch('/api/home');
const { sections, features } = await res.json();

// Hero section निकालें
const hero = sections.find(s => s.section_key === 'hero');

// About features निकालें
const aboutFeatures = features['about_us'] || [];
```

### Admin APIs (Protected)
- `GET /api/admin/home-sections` - सभी sections
- `POST /api/admin/home-sections` - नया section बनाएं
- `PUT /api/admin/home-sections` - section update करें
- `DELETE /api/admin/home-sections?id={id}` - section delete करें

Same for features: `/api/admin/home-features`

---

## ❓ Troubleshooting

### Setup button काम नहीं कर रहा?
→ Direct SQL file run करें phpMyAdmin से

### Images show नहीं हो रहीं?
→ Check `/public/uploads/home/` में files हैं या नहीं
→ Permissions check करें

### Admin panel access नहीं हो रहा?
→ Login check करें (`/admin/login`)
→ Database connection verify करें

### "Table already exists" error?
→ कोई problem नहीं! Tables पहले से हैं तो skip हो जाएंगे

---

## 🎯 Next Step: Frontend Integration

Home page को dynamic बनाने के लिए:

```javascript
// src/app/(public)/page.js में

export default async function HomePage() {
  const res = await fetch('http://localhost:3000/api/home');
  const { sections, features } = await res.json();
  
  return (
    <>
      {sections.map(section => (
        <DynamicSection key={section.id} data={section} />
      ))}
    </>
  );
}
```

---

## 📚 Documentation

Complete documentation: `HOME_PAGE_MANAGEMENT.md`

---

## ✅ Ready!

अब आप पूरे home page का content admin panel से manage कर सकते हैं! 🎉

**Access करें:** http://localhost:3000/admin/home-management
