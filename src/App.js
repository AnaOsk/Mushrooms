import React, { useState } from "react";

const initialFormState = {
  "cap-diameter": "",
  "cap-shape": "",
  "cap-color": "",
  "does-bruise-or-bleed": "",
  "gill-attachment": "",
  "gill-color": "",
  "stem-height": "",
  "stem-width": "",
  "stem-color": "",
  "has-ring": "",
  "ring-type": "",
  "habitat": "",
  "season": "",
};

const options = {
  "cap-shape": ["b", "c", "x", "f", "s", "p", "o"],
  "cap-color": ["n", "b", "g", "r", "p", "u", "e", "w", "y", "l", "o", "k"],
  "does-bruise-or-bleed": ["t", "f"],
  "gill-attachment": ["a", "x", "d", "e", "s", "p", "f", "u"],
  "gill-color": ["n", "b", "g", "r", "p", "u", "e", "w", "y", "l", "o", "k", "f"],
  "stem-color": ["n", "b", "g", "r", "p", "u", "e", "w", "y", "l", "o", "k", "f"],
  "has-ring": ["t", "f"],
  "ring-type": ["c", "e", "r", "g", "l", "p", "s", "z", "y", "m", "f", "u"],
  "habitat": ["g", "l", "m", "p", "h", "u", "w", "d"],
  "season": ["s", "u", "a", "w"],
};

const labels = {
  "cap-shape": { b: "Bell", c: "Conical", x: "Convex", f: "Flat", s: "Sunken", p: "Spherical", o: "Others"},
  "cap-color": {
    n: "Brown", b: "Buff", g: "Gray", r: "Green", p: "Pink", u: "Purple",
    e: "Red", w: "White", y: "Yellow", l: "Blue", o: "Orange", k: "Black"
  },
  "does-bruise-or-bleed": { t: "Yes", f: "No" },
  "gill-attachment": {
    a: "Adnate", x: "Adnexed", d: "Decurrent", e: "Free", s: "Sinuate",
    p: "Pores", f: "None", u: "Unknown"
  },
  "gill-color": {
    n: "Brown", b: "Buff", g: "Gray", r: "Green", p: "Pink", u: "Purple",
    e: "Red", w: "White", y: "Yellow", l: "Blue", o: "Orange", k: "Black", f: "None"
  },
  "stem-color": {
    n: "Brown", b: "Buff", g: "Gray", r: "Green", p: "Pink", u: "Purple",
    e: "Red", w: "White", y: "Yellow", l: "Blue", o: "Orange", k: "Black", f: "None"
  },
  "has-ring": { t: "Yes", f: "No" },
  "ring-type": {
    c: "Cobwebby", e: "Evanescent", r: "Flaring", g: "Grooved", l: "Large",
    p: "Pendant", s: "Sheathing", z: "Zone", y: "Scaly", m: "Movable", f: "None", u: "Unknown"
  },
  "habitat": {
    g: "Grasses", l: "Leaves", m: "Meadows", p: "Paths", h: "Heaths",
    u: "Urban", w: "Waste", d: "Woods"
  },
  "season": { s: "Spring", u: "Summer", a: "Autumn", w: "Winter" }
};

export default function App() {
  const [form, setForm] = useState(initialFormState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastForm, setLastForm] = useState(null);

  const [errors, setErrors] = useState({});

  const normalImg = "/normalMushroom.png";
  const poisonousImg = "/poisonMushroom.png";
  const edibleImg = "/edibleMushroom.png";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    setErrors((errs) => {
      const newErrors = { ...errs };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (form["cap-diameter"] === "" || isNaN(form["cap-diameter"])) {
      newErrors["cap-diameter"] = "Please enter a valid number";
    }
    if (form["stem-height"] === "" || isNaN(form["stem-height"])) {
      newErrors["stem-height"] = "Please enter a valid number";
    }
    if (form["stem-width"] === "" || isNaN(form["stem-width"])) {
      newErrors["stem-width"] = "Please enter a valid number";
    }
    for (const [key, value] of Object.entries(form)) {
      if (!["cap-diameter", "stem-height", "stem-width"].includes(key) && value === "") {
        newErrors[key] = "Please select an option";
      }
    }
    return newErrors;
  };

const onSubmit = async () => {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setResult(null);
    return;
  }

  // Pretvori numeričke vrijednosti iz string u broj
  const payload = { ...form };
  ["cap-diameter", "stem-height", "stem-width"].forEach((key) => {
    payload[key] = parseFloat(payload[key]);
  });

  setLoading(true);
  try {
    const res = await fetch("https://mushrooms-f1dg.onrender.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setResult(data.poisonous);
    setLastForm(form);
    setErrors({});
  } catch (error) {
    setErrors({ api: "Greška prilikom poziva API-ja." });
  }
  setLoading(false);
};

  const onRetry = () => {
    setResult(null);
    setForm(initialFormState);
    setErrors({});
  };

  const onLoadLast = () => {
    if (lastForm) {
      setForm(lastForm);
      setResult(null);
      setErrors({});
    }
  };

  const getImage = () => {
    if (result === null) return normalImg;
    return result ? poisonousImg : edibleImg;
  };

  const renderErrorText = (key) =>
    errors[key] ? (
      <div
        style={{
          position: "absolute",
          right: "6px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "red",
          fontSize: "10px",
          backgroundColor: "white",
          padding: "0 5px",
          marginRight: "10px",
          pointerEvents: "none",
          maxWidth: "160px",
          textAlign: "right",
          whiteSpace: "normal",
          wordWrap: "break-word",
          userSelect: "none",
        }}
      >
        {errors[key]}
      </div>
    ) : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url('/backgroundMushroom3.gif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 20,
        color: "white",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Check if the mushroom is edible!

      </h1>

      <div style={{ display: "flex", maxWidth: 1200, margin: "auto" }}>
        {/* Lijevo: Forma */}
        <div
          style={{
            flex: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginRight: 20,
          }}
        >
          {Object.entries(form).map(([key, value]) => {
            const isNumeric = ["cap-diameter", "stem-height", "stem-width"].includes(key);

            if (result !== null) {
              if (isNumeric) {
                return (
                  <div key={key}>
                    <label>{key}:</label>
                    <input
                      type="text"
                      value={value}
                      disabled
                      style={{
                        width: "100%",
                        height: "30px",
                        paddingRight: "85px",
                        boxSizing: "border-box",
                        borderColor: errors[key] ? "red" : undefined,
                        borderWidth: errors[key] ? "2px" : undefined,
                        outline: errors[key] ? "none" : undefined,
                        textAlign: "left",
                      }}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={key}>
                    <label>{key}:</label>
                    <select disabled value={value} style={{ width: "100%", height: "30px" }}>
                      <option value={value}>{labels[key]?.[value] || value}</option>
                    </select>
                  </div>
                );
              }
            }

            return isNumeric ? (
              <div key={key}>
                <label>{key}:</label>
                <div style={{ position: "relative", width: "100%", minWidth: "250px" }}>
                  <input
  type="number"
  name={key}
  value={value}
  onChange={onChange}
  placeholder="--Writte number--"
  style={{
    width: "100%",
    height: "30px",
    paddingRight: "2px", // smanji s 85px na ~24px, da strelica bude desno
    boxSizing: "border-box",
    borderColor: errors[key] ? "red" : undefined,
    borderWidth: errors[key] ? "2px" : undefined,
    outline: errors[key] ? "none" : undefined,

  }}
/>
                  {renderErrorText(key)}
                </div>
              </div>
            ) : (
              <div key={key}>
                <label>{key}:</label>
                <div style={{ position: "relative", width: "100%", minWidth: "250px" }}>
                  <select
  name={key}
  value={value}
  onChange={onChange}
  style={{
    width: "100%",
    height: "30px",
    paddingRight: "25px", // smanji sa 85px na 24px da strelica bude vidljiva
    boxSizing: "border-box",
    borderColor: errors[key] ? "red" : undefined,
    borderWidth: errors[key] ? "2px" : undefined,
    outline: errors[key] ? "none" : undefined,

  }}
>
                    <option value="">-- Choose characteristic--</option>
                    {options[key].map((opt) => (
                      <option key={opt} value={opt}>
                        {labels[key]?.[opt] || opt}
                      </option>
                    ))}
                  </select>
                  {renderErrorText(key)}
                </div>
              </div>
            );
          })}

          {errors.api && (
            <div style={{ color: "red", gridColumn: "span 2", textAlign: "center" }}>
              {errors.api}
            </div>
          )}

          <div
            style={{
              gridColumn: "span 2",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 20,
            }}
          >
            {result === null ? (
              <button
                onClick={onSubmit}
                disabled={loading}
                style={{
                  fontSize: "18px",
                  borderRadius: "6px",
                  cursor: loading ? "not-allowed" : "pointer",
                  width: "200px",
                  height: "40px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={loading ? "Predviđam..." : "Is poisonous?"}
              >
                {loading ? "Predviđam..." : "Is poisonous?"}
              </button>
            ) : (
              <button
                onClick={onRetry}
                style={{
                  fontSize: "18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  width: "200px",
                  height: "40px",
                }}
              >
                Retry
              </button>
            )}

            <button
              onClick={onLoadLast}
              disabled={!lastForm}
              style={{
                fontSize: "18px",
                borderRadius: "6px",
                cursor: lastForm ? "pointer" : "not-allowed",
                width: "200px",
                height: "40px",
                backgroundColor: lastForm ? "#FFFFFF" : "#888",
                color: "black",
              }}
              title={lastForm ? "Vrati posljednje rezultate" : "Nema spremljenih rezultata"}
            >
              Return last resaults
            </button>
          </div>
        </div>

        {/* Desno: Slika i tekst ispod nje */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 400,
            minWidth: 400,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 400,
              height: 450,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "5%",
                left: "5%",
                width: "90%",
                height: "90%",
                borderRadius: "50% / 70%",
                backgroundColor: "rgba(255, 255, 255, 0.35)",
                border: "4px solid white",
                zIndex: 0,
                boxShadow: "0 0 15px rgba(255,255,255,0.6)",
              }}
            />

            <img
              src={getImage()}
              alt="Mushroom"
              style={{
                left: "5%",
                width: "95%",
                height: "95%",
                borderRadius: 30,
                position: "relative",
                zIndex: 1,
                objectFit: "contain",
                filter: "drop-shadow(0 0 5px rgba(0,0,0,0.3))",
                userSelect: "none",
              }}
            />
          </div>

          {result !== null && (
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                maxWidth: "90%",
              }}
            >
              {result
                ? "Warning: This mushroom is poisonous!"
                : "This mushroom is edible."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
