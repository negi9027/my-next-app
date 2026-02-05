// API to get user's country based on IP
export async function GET(req) {
    try {
        // Get client IP
        const forwarded = req.headers.get("x-forwarded-for");
        let ipaddress = "Unknown";

        if (forwarded) {
            const ipList = forwarded.split(',');
            ipaddress = ipList[0].trim();
        } else {
            ipaddress = req.headers.get("x-real-ip") || req.headers.get("remote-addr") || "Unknown";
        }

        // If localhost/unknown, return India as default
        if (ipaddress === "Unknown" || ipaddress === "::1" || ipaddress.startsWith("127.")) {
            return new Response(
                JSON.stringify({
                    country_code: "IN",
                    country_calling_code: "+91",
                    ipaddress: ipaddress
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Fetch country from external API
        const response = await fetch(`https://kidneyfailuretreatment.in/get-info.php?ip=${ipaddress}`);
        const result = await response.json();

        // Map country code to calling code
        const countryCallingCodes = {
            'IN': '+91', 'US': '+1', 'GB': '+44', 'CA': '+1', 'AU': '+61',
            'PK': '+92', 'BD': '+880', 'NP': '+977', 'LK': '+94', 'BT': '+975',
            'AE': '+971', 'SA': '+966', 'QA': '+974', 'OM': '+968', 'KW': '+965',
            'CN': '+86', 'JP': '+81', 'SG': '+65', 'MY': '+60', 'TH': '+66',
            'PH': '+63', 'NG': '+234', 'ZA': '+27', 'KE': '+254', 'GH': '+233'
        };

        const country_code = result.country_code || 'IN';
        const country_calling_code = countryCallingCodes[country_code] || '+91';

        return new Response(
            JSON.stringify({
                country_code,
                country_calling_code,
                ipaddress
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error('Error getting user country:', error);
        // Default to India on error
        return new Response(
            JSON.stringify({
                country_code: "IN",
                country_calling_code: "+91",
                error: error.message
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }
}
