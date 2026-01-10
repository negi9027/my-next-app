"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function KidneyCalculator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    age: 35,
    gender: "",
    diabetes: "",
    bp: "",
    symptoms: [],
    creatinine: "",
  });

  const toggleSymptom = (s) => {
    setData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter(i => i !== s)
        : [...prev.symptoms, s]
    }));
  };

  const calculateScore = () => {
    let score = 100;
    if (data.age > 50) score -= 10;
    if (data.diabetes === "yes") score -= 20;
    if (data.bp === "high") score -= 15;
    if (data.symptoms.length >= 2) score -= 15;
    if (data.creatinine === "high") score -= 25;
    return Math.max(score, 5);
  };

  const score = calculateScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-16">
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Kidney Health Calculator
        </h1>

        {/* STEP INDICATOR */}
        <div className="flex justify-center gap-2 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i}
              className={`w-3 h-3 rounded-full ${step >= i ? "bg-blue-600" : "bg-gray-300"}`}
            />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}}>
            <label className="block mb-4 font-semibold">Age: {data.age}</label>
            <input type="range" min="18" max="80" value={data.age}
              onChange={e => setData({...data, age:+e.target.value})}
              className="w-full"/>

            <div className="flex gap-4 mt-6">
              {["male","female"].map(g => (
                <button key={g}
                  onClick={()=>setData({...data, gender:g})}
                  className={`flex-1 py-3 rounded-xl border ${
                    data.gender===g ? "bg-blue-600 text-white" : "bg-white"
                  }`}>
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <p className="font-semibold mb-4">Medical Conditions</p>

            {[
              ["Diabetes","diabetes"],
              ["High Blood Pressure","bp"]
            ].map(([label,key]) => (
              <div key={key} className="flex gap-4 mb-4">
                <span className="w-1/2">{label}</span>
                {["yes","no"].map(v => (
                  <button key={v}
                    onClick={()=>setData({...data,[key]:v})}
                    className={`px-4 py-2 rounded-lg ${
                      data[key]===v ? "bg-blue-600 text-white" : "bg-gray-100"
                    }`}>
                    {v.toUpperCase()}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <p className="font-semibold mb-4">Select Symptoms</p>
            <div className="grid grid-cols-2 gap-3">
              {["Swelling","Foamy Urine","Fatigue","Low Urine","Back Pain"].map(s => (
                <button key={s}
                  onClick={()=>toggleSymptom(s)}
                  className={`p-3 rounded-xl border ${
                    data.symptoms.includes(s)
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 4 RESULT */}
        {step === 4 && (
          <motion.div initial={{scale:0.9}} animate={{scale:1}}>
            <h2 className="text-2xl font-bold text-center mb-4">
              Your Kidney Health Score
            </h2>

            <div className="text-center text-5xl font-bold text-blue-600">
              {score}%
            </div>

            <p className="text-center mt-4 text-gray-700">
              {score >= 80 && "Your kidney health looks good. Maintain healthy habits."}
              {score < 80 && score >= 50 && "There are early risk signs. Medical guidance advised."}
              {score < 50 && "High risk detected. Immediate medical consultation recommended."}
            </p>

            <div className="text-center mt-6">
              <a href="/contact" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl">
                Talk to Kidney Expert
              </a>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              *This calculator is for educational purposes only and not a medical diagnosis.
            </p>
          </motion.div>
        )}

        {/* NAV BUTTONS */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button onClick={()=>setStep(step-1)} className="text-gray-500">
              ← Back
            </button>
          )}
          {step < 4 && (
            <button onClick={()=>setStep(step+1)} className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg">
              Next →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
