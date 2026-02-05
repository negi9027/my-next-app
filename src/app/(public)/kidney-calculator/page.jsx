"use client";
import "./kidney.css";
import GaugeMeter from "@/components/GaugeMeter";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function KidneyCalculator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    age: 35,
    gender: "",
    diabetes: "",
    bp: "",
    symptoms: [],
    creatinine: ""
  });

  /* -----------------------------
     Helpers
  ------------------------------*/

  const toggleSymptom = (s) => {
    setData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter(i => i !== s)
        : [...prev.symptoms, s]
    }));
  };

  /* -----------------------------
     eGFR Calculation (Educational)
     CKD-EPI simplified
  ------------------------------*/
  const calculateEGFR = () => {
    if (!data.creatinine || !data.gender) return null;

    const creat = parseFloat(data.creatinine);
    if (creat <= 0) return null;

    let egfr =
      175 *
      Math.pow(creat, -1.154) *
      Math.pow(data.age, -0.203);

    if (data.gender === "female") {
      egfr = egfr * 0.742;
    }

    return Math.round(egfr);
  };

  const egfr = calculateEGFR();

  /* -----------------------------
     MEDICALLY DEEP SCORE LOGIC
     (Educational Risk Index)
  ------------------------------*/
  const calculateScore = () => {
    let score = 100;

    /* AGE IMPACT */
    if (data.age >= 60) score -= 15;
    else if (data.age >= 45) score -= 8;

    /* DIABETES (major CKD risk) */
    if (data.diabetes === "yes") score -= 25;

    /* HYPERTENSION */
    if (data.bp === "yes") score -= 18;

    /* SYMPTOM SEVERITY */
    const symptomWeights = {
      "Swelling": 8,        // fluid retention
      "Foamy Urine": 10,    // proteinuria marker
      "Fatigue": 5,
      "Low Urine": 12,      // reduced filtration
      "Back Pain": 4
    };

    data.symptoms.forEach(s => {
      score -= symptomWeights[s] || 0;
    });

    /* CREATININE IMPACT */
    const creat = parseFloat(data.creatinine);
    if (!isNaN(creat)) {
      if (creat >= 2.0) score -= 25;
      else if (creat >= 1.5) score -= 15;
      else if (creat >= 1.2) score -= 8;
    }

    /* eGFR IMPACT (MOST IMPORTANT) */
    if (egfr !== null) {
      if (egfr < 15) score -= 40;
      else if (egfr < 30) score -= 30;
      else if (egfr < 45) score -= 20;
      else if (egfr < 60) score -= 12;
      else if (egfr < 90) score -= 5;
    }

    return Math.max(score, 5);
  };

  const score = calculateScore();

  const scoreColor =
    score >= 80 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#dc2626";

  const getCKDStage = (egfr) => {
    if (!egfr) return null;
    if (egfr >= 90) return "Stage 1 (Normal / High)";
    if (egfr >= 60) return "Stage 2 (Mild loss)";
    if (egfr >= 45) return "Stage 3A (Mild–Moderate)";
    if (egfr >= 30) return "Stage 3B (Moderate–Severe)";
    if (egfr >= 15) return "Stage 4 (Severe)";
    return "Stage 5 (Kidney Failure)";
  };

  const ckdStage = getCKDStage(egfr);

  /* -----------------------------
     UI
  ------------------------------*/
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-white px-4">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Kidney Health Assessment
          </h1>
          <p className="text-gray-600 mt-2">
            Answer a few questions to understand your kidney risk level
          </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-2 w-10 rounded-full transition ${
                step >= i ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 className="text-xl font-bold mb-6">Basic Details</h2>

              <label className="font-semibold mb-2 block">
                Age: <span className="text-blue-600">{data.age}</span>
              </label>
              <input
                type="range"
                min="18"
                max="80"
                value={data.age}
                onChange={e => setData({ ...data, age: +e.target.value })}
                className="w-full accent-blue-600"
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                {["male", "female"].map(g => (
                  <button
                    key={g}
                    onClick={() => setData({ ...data, gender: g })}
                    className={`py-4 rounded-2xl font-semibold transition-all ${
                      data.gender === g
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 hover:bg-blue-50"
                    }`}
                  >
                    {g.toUpperCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 className="text-xl font-bold mb-6">Medical History</h2>

              {[
                ["Diabetes", "diabetes"],
                ["High Blood Pressure", "bp"],
              ].map(([label, key]) => (
                <div key={key} className="flex justify-between items-center mb-6">
                  <span className="font-medium">{label}</span>
                  <div className="flex gap-3">
                    {["yes", "no"].map(v => (
                      <button
                        key={v}
                        onClick={() => setData({ ...data, [key]: v })}
                        className={`px-5 py-2 rounded-xl font-semibold transition ${
                          data[key] === v
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-blue-50"
                        }`}
                      >
                        {v.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 className="text-xl font-bold mb-6">Symptoms & Lab Data</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {["Swelling", "Foamy Urine", "Fatigue", "Low Urine", "Back Pain"].map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`py-4 px-3 rounded-2xl font-semibold text-sm transition-all ${
                      data.symptoms.includes(s)
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "bg-gray-100 hover:bg-blue-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "30px" }}>
                <label className="font-semibold block mb-2">
                  Serum Creatinine (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 1.2"
                  value={data.creatinine}
                  onChange={e =>
                    setData({ ...data, creatinine: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ border: "1px solid #d1d5db", fontSize: "16px" }}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4 RESULT */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-center">

                <div className="flex justify-center">
                  <GaugeMeter value={score} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Your Kidney Health Report
                  </h2>

                  <p className="text-gray-700 mb-4">
                    {egfr >= 90 && "Kidney function appears healthy. Maintain hydration and healthy habits."}
                    {egfr < 90 && egfr >= 60 && "Early kidney stress detected. Preventive care is advised."}
                    {egfr < 60 && "Reduced kidney function detected. Consultation with a kidney specialist is strongly recommended."}
                  </p>

                  {egfr && (
                    <>
                      <p className="text-gray-700"><strong>Estimated GFR:</strong> {egfr} mL/min/1.73m²</p>
                      <p className="text-gray-700"><strong>CKD Stage:</strong> {ckdStage}</p>
                    </>
                  )}

                  <a
                    href="/contact"
                    className="block w-full text-center bg-blue-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
                    style={{ marginTop: "20px" }}
                  >
                    Consult Kidney Expert
                  </a>

                  <p className="text-xs text-gray-500 mt-4">
                    *Educational purpose only. Not a medical diagnosis.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-12">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="text-gray-500 font-medium">
              ← Back
            </button>
          )}
          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto bg-blue-600 text-white px-8 py-3 rounded-xl shadow hover:scale-105 transition"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
