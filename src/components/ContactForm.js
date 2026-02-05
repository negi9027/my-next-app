"use client";

import { useState, useMemo, useEffect } from "react";
import Select, { components as RSComponents } from "react-select";
import { countries } from "@/lib/countries"; // ensure this file has flag URLs (png) and unique entries

// Custom SingleValue: show only the flag image in the closed control
const SingleValue = ({ data, ...props }) => {
  return (
    <RSComponents.SingleValue {...props}>
      <img
        src={data.flag}
        alt={data.name}
        style={{ width: 20, height: 15, objectFit: "cover", display: "block" }}
      />
    </RSComponents.SingleValue>
  );
};

// Custom Option: show flag + name + code in one row
const Option = (props) => {
  const { data } = props;
  return (
    <RSComponents.Option {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={data.flag} alt={data.name} style={{ width: 22, height: 16, objectFit: "cover" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 14 }}>{data.name}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{data.code}</div>
        </div>
      </div>
    </RSComponents.Option>
  );
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    disease: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const [diseases, setDiseases] = useState([]);

  // Fetch user's country and diseases on mount
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const res = await fetch("/api/get-user-country");
        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({ ...prev, countryCode: data.country_calling_code }));
        }
      } catch (error) {
        console.error("Failed to fetch user country", error);
      }
    };

    const fetchDiseases = async () => {
      try {
        const res = await fetch("/api/diseases");
        if (res.ok) {
          const data = await res.json();
          setDiseases(data);
        }
      } catch (error) {
        console.error("Failed to fetch diseases", error);
      }
    };

    fetchUserCountry();
    fetchDiseases();
  }, []);

  // prepare react-select options (useMemo for perf)
  const countryOptions = useMemo(
    () =>
      countries.map((c) => ({
        value: c.code,
        label: `${c.name} (${c.code})`,
        name: c.name,
        code: c.code,
        flag: c.flag, // URL to small png
      })),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const cleaned = value.replace(/[0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    if (name === "phone") {
      let val = value.replace(/^[01]+/, "");
      val = val.replace(/\D/g, ""); // allow only digits
      if (val.length > 10) val = val.slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: val }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle select change (react-select)
  const handleCountrySelect = (selected) => {
    if (!selected) return;
    setFormData((prev) => ({ ...prev, countryCode: selected.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValidationMsg("");

    // Basic validations
    if (!formData.name.trim()) {
      setValidationMsg("Please enter your name.");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationMsg("Please enter a valid email.");
      setLoading(false);
      return;
    }
    if (!formData.phone || formData.phone.length !== 10) {
      setValidationMsg("Phone number must be 10 digits.");
      setLoading(false);
      return;
    }
    if (formData.message.trim().split(/\s+/).length < 3) {
      setValidationMsg("Message must contain at least 3 words.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, page_url: window.location.href }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      alert(data.is_duplicate ? "You have already submitted a form." : "Form submitted successfully!");
      setFormData({ name: "", email: "", phone: "", countryCode: "+91", disease: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  // react-select custom styles:
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: 38,
      height: 38,
      width: 80, // small square for closed control (flag only)
      paddingLeft: 6,
      paddingRight: 6,
      borderRadius: 6,
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 6px",
      justifyContent: "center",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (provided) => ({ ...provided, padding: 4 }),
    menu: (provided) => ({
      ...provided,
      width: 340, // wider dropdown
      borderRadius: 8,
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: 8,
      background: state.isFocused ? "#d6d6d6ff" : "white",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <form onSubmit={handleSubmit}>
      {validationMsg && <div className="alert alert-warning">{validationMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Name */}
      <div className="mb-2">
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      {/* Email */}
      <div className="mb-2">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      {/* Phone + Country */}
      <div className="mb-2 d-flex align-items-center">
        <div style={{ width: 80, marginRight: 10 }}>
          <Select
            options={countryOptions}
            value={countryOptions.find((o) => o.value === formData.countryCode)}
            onChange={handleCountrySelect}
            components={{ SingleValue, Option }}
            styles={customStyles}
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPosition="fixed"
            isSearchable
          />
        </div>

        <input
          type="tel"
          name="phone"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          className="form-control"
        />
      </div>


      {/* Disease */}
      <div className="mb-2">
        <select
          name="disease"
          value={formData.disease}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Maladie (optionnel)</option>
          {Object.entries(
            diseases.reduce((acc, d) => {
              const cat = d.category || "Other";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(d);
              return acc;
            }, {})
          ).map(([category, items]) => (
            <optgroup key={category} label={category}>
              {items.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </optgroup>
          ))}

        </select>
      </div>

      {/* Message */}
      <div className="mb-2">
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="form-control"
          rows="3"
          required
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );

}
