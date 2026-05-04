"use client";

import React from "react";

export const FinalCTA = () => {
   return (
      <section
         style={{
            position: "relative",
            padding: "120px 24px",
            textAlign: "center",
            overflow: "hidden",
            background:
               "linear-gradient(160deg, #040e07 0%, #082f1d 50%, #040e07 100%)",
            color: "#eff8ee",
         }}
      >
         {/* grid background */}
         <div
            style={{
               position: "absolute",
               inset: 0,
               backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
               backgroundSize: "60px 60px",
               pointerEvents: "none",
            }}
         />

         {/* gold glow */}
         <div
            style={{
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               width: "800px",
               height: "400px",
               background:
                  "radial-gradient(ellipse, rgba(232,197,71,0.08), transparent 65%)",
               pointerEvents: "none",
            }}
         />

         <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>

            {/* eyebrow */}
            <div
               style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#E8C547",
                  marginBottom: "24px",
               }}
            >
               <span style={{ width: "24px", height: "1px", background: "#E8C547" }} />
               Your Wellness, Your Way
               <span style={{ width: "24px", height: "1px", background: "#E8C547" }} />
            </div>

            {/* headline */}
            <h2
               style={{
                  fontFamily: "serif",
                  fontSize: "clamp(42px, 6vw, 72px)",
                  lineHeight: 1.1,
                  marginBottom: "16px",
               }}
            >
               Ready to find your <br />
               <span
                  style={{
                     fontStyle: "italic",
                     color: "#E8C547",
                     borderBottom: "2px solid #E8C547",
                  }}
               >
                  Balance?
               </span>
            </h2>

            {/* subtext */}
            <p
               style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "rgba(239,248,238,0.6)",
                  maxWidth: "420px",
                  margin: "0 auto 40px",
               }}
            >
               Six series. Every mood. One brand you can trust.
               Find exactly what your body needs.
            </p>

            {/* buttons */}
            <div
               style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "16px",
               }}
            >
               <button
                  style={{
                     background: "#E8C547",
                     color: "#082f1d",
                     padding: "16px 34px",
                     borderRadius: "999px",
                     border: "none",
                     fontSize: "12px",
                     letterSpacing: "0.1em",
                     textTransform: "uppercase",
                     fontWeight: 600,
                     cursor: "pointer",
                     boxShadow: "0 10px 30px rgba(232,197,71,0.3)",
                  }}
               >
                  Explore Products →
               </button>

               <button
                  style={{
                     background: "transparent",
                     color: "rgba(239,248,238,0.7)",
                     padding: "16px 28px",
                     borderRadius: "999px",
                     border: "1px solid rgba(239,248,238,0.2)",
                     fontSize: "12px",
                     letterSpacing: "0.1em",
                     textTransform: "uppercase",
                     cursor: "pointer",
                  }}
               >
                  Take the Series Quiz
               </button>
            </div>

            {/* note */}
            <p
               style={{
                  marginTop: "18px",
                  fontSize: "11px",
                  color: "rgba(239,248,238,0.3)",
                  letterSpacing: "0.04em",
               }}
            >
               2 minutes · Find your perfect series · Free
            </p>
         </div>
      </section>
   );
};
