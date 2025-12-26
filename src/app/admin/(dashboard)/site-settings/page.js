"use client";

import { useEffect, useState } from "react";

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const updateSetting = async (key, value, enabled) => {
    await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, enabled }),
    });
  };

  const toggleSetting = async (key, enabled) => {
    await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled }),
    });

    setSettings(prev =>
      prev.map(s =>
        s.setting_key === key ? { ...s, is_enabled: enabled } : s
      )
    );
  };

  if (loading) {
    return (
      <div className="container my-5 text-center text-muted">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h2 className="fw-bold">Contact & Social Settings</h2>
        <p className="text-muted mb-0">
          Manage phone, email, address, map and social links used across the website.
        </p>
      </div>

      <div className="row g-4">
        {settings.map(s => (
          <div key={s.setting_key} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 text-capitalize">
                    {s.setting_key.replace(/_/g, " ")}
                  </h6>

                  {/* Toggle */}
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!s.is_enabled}
                      onChange={() =>
                        toggleSetting(
                          s.setting_key,
                          s.is_enabled ? 0 : 1
                        )
                      }
                    />
                  </div>
                </div>

                {/* Input */}
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  defaultValue={s.setting_value || ""}
                  placeholder={`Enter ${s.setting_key}`}
                  onBlur={(e) =>
                    updateSetting(
                      s.setting_key,
                      e.target.value,
                      s.is_enabled
                    )
                  }
                />

                {/* Status */}
                <small className={`mt-auto fw-semibold ${s.is_enabled ? "text-success" : "text-muted"}`}>
                  {s.is_enabled ? "● Enabled" : "● Disabled"}
                </small>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="alert alert-info mt-5">
        💡 Tip: Changes are saved automatically when you leave the input field.
      </div>
    </div>
  );
}
