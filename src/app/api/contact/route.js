import pool from "@/lib/db";

// Helper: Get country by IP
async function getCountryByIP(ipaddress) {
  try {
    const response = await fetch(`https://kidneyfailuretreatment.in/get-info.php?ip=${ipaddress}`);
    const result = await response.json();
    return result.country_code || 'IN';
  } catch (error) {
    console.error('Error fetching country:', error);
    return 'IN';
  }
}

// Helper: Get client IP from request
function getClientIP(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ipList = forwarded.split(',');
    return ipList[0].trim();
  }
  return req.headers.get("x-real-ip") || req.headers.get("remote-addr") || "Unknown";
}

// Helper: Send mail via API
async function sendMailViaApi(apiUrl, data) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    });
    return await response.json();
  } catch (error) {
    console.error('Mail API error:', error);
    return { status: 'error', message: error.message };
  }
}

// Helper: Check IP via external API
async function checkIpAddress(data) {
  try {
    const response = await fetch('https://www.karmaayurveda.us/api/v2/checkIpAddress.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    });
    return await response.json();
  } catch (error) {
    console.error('IP check error:', error);
    return { status: 500 };
  }
}

// Helper: Send to external API
async function sendToExternalApi(url, formData) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });
  } catch (error) {
    console.error('External API error:', error);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, disease, message, page_url, countryCode } = body;

    const ipaddress = getClientIP(req);
    const user_agent = req.headers.get("user-agent") || "Unknown";
    const cur_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Check duplicate (same email + phone)
    const [existing] = await pool.execute(
      "SELECT id FROM enquiry WHERE email=? AND phone=?",
      [email, phone]
    );
    const is_duplicate = existing.length > 0 ? 1 : 0;

    // Check IP address validity
    const ipCheckData = {
      siteurl: process.env.PUBLIC_SITE_URL || 'https://karmaayurveda.com',
      ipaddress: ipaddress,
      name: name,
      email: email,
      phone: phone
    };

    const ipResponse = await checkIpAddress(ipCheckData);

    if (ipResponse.status !== 200 && ipResponse.status !== 500) {
      return new Response(
        JSON.stringify({ success: false, statuscode: ipResponse.status }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get user's country
    const userCountry = await getCountryByIP(ipaddress);

    const foreignCountry = ['US', 'GB', 'CA', 'PH', 'NG', 'AU', 'CN', 'AE'];
    const kidneylead = [
      "Kidney", "Acute Kidney Disease", "Chronic Kidney Disease", "Nephrotic Syndrome",
      "Polycystic Kidney Disease", "Creatinine", "Proteinuria", "Kidney Disease"
    ];
    const cancerlead = ["Cancer"];

    let cc_emails = ["esfgirish@gmail.com"];
    let counter;
    let subject_admin;
    let actualCountry = userCountry;

    // Determine if foreign or domestic
    const isForeign = foreignCountry.includes(userCountry) ||
      (countryCode?.includes('+1') && userCountry === 'IN');

    if (isForeign) {
      // FOREIGN LOGIC
      cc_emails = ["esfgirish@gmail.com", "girish.negi.karma@gmail.com"];

      // Get foreign counter (id=28)
      const [counterRes] = await pool.execute(
        "SELECT number FROM tbl_counter WHERE status='1' AND id='28'"
      );
      counter = counterRes[0]?.number || 0;

      if (!['9999999999', '9898989898'].includes(phone)) {
        counter++;
        await pool.execute(
          "UPDATE tbl_counter SET number=? WHERE id='28'",
          [counter]
        );
      }

      actualCountry = (countryCode?.includes('+1') && userCountry === 'IN') ? 'US' : userCountry;
      subject_admin = `ORGANIC KARMAAYURVEDA.COM | ${actualCountry} | ${counter}`;

    } else {
      // DOMESTIC LOGIC
      const hindiCodes = ["+91", "+92", "+977", "+880", "+94", "+975"];
      const isHindi = hindiCodes.some(code => countryCode?.includes(code));

      if (isHindi) {
        if (kidneylead.includes(disease)) {
          cc_emails.push("esfgirish@gmail.com");
        } else if (cancerlead.includes(disease)) {
          cc_emails.push("girish.negi.karma@gmail.com");
        } else {
          cc_emails.push("girish.negi@live.com");
        }
      }

      // Get domestic counter (id=25)
      const [counterRes] = await pool.execute(
        "SELECT number FROM tbl_counter WHERE status='1' AND id='25'"
      );
      counter = counterRes[0]?.number || 0;

      if (!['9999999999', '9898989898'].includes(phone)) {
        counter++;
        await pool.execute(
          "UPDATE tbl_counter SET number=? WHERE id='25'",
          [counter]
        );
      }

      subject_admin = `${countryCode} | ${counter} | Karma Ayurveda`;
    }

    // Build HTML email content
    const htmlContent = `
      <style>
      table, td, div, h1, p {
        font-family: 'Basier Circle', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      }
      </style>
      <body style='font-family: Basier Circle,margin:0;padding:0;word-spacing:normal;background-color:#FDF8F4;'>
      <div role='article' aria-roledescription='email' lang='en' style='text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#FDF8F4;'>
        <table role='presentation' style='width:100%;border:none;border-spacing:0;'>
          <tr>
            <td align='center' style='padding:0;'>
              <table role='presentation' style='width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-size:1em;line-height:1.37em;color:#384049;'>
                <tr>
                  <td style='padding:30px;background-color:white;'>
                    <h1 style='margin-top:0;margin-bottom:1.1em;font-size:1.953em;line-height:1.3;font-weight:bold;letter-spacing:-0.02em;color:#314719;'>New Lead - Karma Ayurveda</h1>
                    <h2 style='margin-top:0;margin-bottom:1.1em;font-size:1.1em;color:#314719;'>Namaste, Below are the details you have filled on our website regarding your problem.</h2>
                    <p style='margin:0;'>Hi ${name},</p>
                    <p>Name: ${name}</p>
                    <p>Email: ${email}</p>
                    <p>Country Code: ${countryCode}</p>
                    <p>Disease: ${disease}</p>
                    <p>Phone No.: ${phone}</p>
                    <p>Message: ${message}</p>
                    <p style='text-align:center;margin:2.5em auto'></p>
                    <p style='font-weight:600;'>Thank you for choosing Karma Ayurveda!</p>
                    <p>Regards,</p>
                    <p>Dr. Puneet Dhawan (Ayurvedic Expert) & Team Karma Ayurveda</p>
                  </td>
                </tr>
                <tr>
                  <td style='padding:10px;text-align:center;font-size:0.75em;background:#0a5041; color:#fff;border:1em solid #fff;border-left:none;border-right:none;'>
                    <p style='margin:0;font-size:0.75rem;line-height:1.5em;text-align:center;'>
                      This is a system Generated Email. Please do not reply to this Email. <br>
                      <a class='unsub' href='' style='color:#fff;text-decoration:underline;'>Karma Ayurveda</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      </body>`;

    // Send email via API
    const to_admin = 'domestic2@ayurvedickidneycare.com';
    const apiUrl = "https://www.karmaayurveda.org/mail_api.php";

    const mailData = {
      to: to_admin,
      subject: subject_admin,
      message: htmlContent,
      cc: cc_emails.join(", "),
      bcc: cc_emails.join(", "),
      site_name: "Karma Ayurveda"
    };

    const mailResponse = await sendMailViaApi(apiUrl, mailData);
    const mail_status = mailResponse.status === 'success' ? 1 : 0;

    // Insert to database
    const media_source = 'Karma Ayurveda International Site';

    await pool.execute(
      `INSERT INTO enquiry
      (name, email, phone, disease, message, page_url, ip_address, user_agent, is_duplicate, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, disease, message, page_url, ipaddress, user_agent, is_duplicate, cur_date, 'new']
    );

    // Send to external APIs
    const formData = {
      name: name,
      email: email,
      country: countryCode,
      tel: phone,
      message: message,
      problem_name: disease,
      crm_message: user_agent,
      pincode: '',
      media_source: media_source,
      lead_channel: "200",
      url: page_url,
      ipaddress: ipaddress,
      counter_no: counter.toString(),
      mail_status: "1"
    };

    // Send to both external APIs
    // await Promise.all([
    //   sendToExternalApi('https://www.karmaayurveda.org/api/v2/add.php?token=ahdhsasdnasbwdldkgldk', formData),
    //   sendToExternalApi('https://www.karmaayurveda.us/api/v2/add.php?token=ahdhsasdnasbwdldkgldk', formData)
    // ]);

    return new Response(
      JSON.stringify({ success: true, statuscode: 200, is_duplicate, mail_sent: mail_status === 1 }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
