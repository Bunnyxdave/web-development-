import React, { useState } from "react";
import "./Financialform.css";
import { DotLoader } from "react-spinners";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const FinancialForm = ({ setResult, setStockName, setProfitLoss }) => {
  const [values, setValues] = useState({
    stockName: "",
    marketPrice: "231.59",
    eps: "6.42",
    bookValue: "52.80",
    sales: "94000000000",
    annualDividends: "1.04",
    previousEps: "1.52",
    currentEps: "1.65",
    totalDebt: "98157071000",
    totalEquity: "5067200000",
    netIncome: "9980300000",
  });

  const [isSent, setIsSent] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (name === "stockName") {
      setStockName(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const prompt = `
Given the following stock parameters:

${JSON.stringify(values, null, 2)}

1. Create a neat ** table** with bold lines (not markdown, not ASCII) with the following rows:
   - P/E ratio
   - P/B ratio
   - Dividend Yield
   - Debt-to-Equity ratio
   - Net Profit Margin
   - Return on Equity (ROE)
   - Return on Assets (ROA)

⚠️ Use <table>, <tr>, <th>, <td> tags so it renders in HTML directly.

2. After the table, add these lines:
   <p><b>Profit Percentage:</b> X%</p>
   <p><b>Loss Percentage:</b> Y%</p>

Do NOT return explanations or paragraphs, only the HTML table + the two lines below, lines below should be stating the calculated profit percentage and calculated loss percentage based on the given parameters and also the stock history and also a small 2-3 line description about the entered stock, and also tell if the stocks are investable or notand no other than that. if stocks=good,moderate give in bold INVESTABLE else RISKY irrespective of high debt to equity ratio. you must return the profit and loss percentages accurate based on the yahoo finance or google ai overview. 
`;

    const messages = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    setIsSent(false);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: messages }),
      });

      const data = await res.json();
      setIsSent(true);

      if (data.candidates && data.candidates.length > 0) {
        const raw = data.candidates[0].content.parts[0].text || "";

        // ✅ Strip markdown fences like ```html
        let html = raw.replace(/```html/gi, "").replace(/```/g, "").trim();

        // ✅ Show cleaned HTML
        setResult(html);

        // ✅ Build plain text to search for numbers
        const plain = html.replace(/<[^>]*>/g, " ");

        // ✅ Extract Profit/Loss
        const profitMatch = plain.match(/profit\s*percentage\s*:\s*(-?\d+(?:\.\d+)?)/i);
        const lossMatch = plain.match(/loss\s*percentage\s*:\s*(-?\d+(?:\.\d+)?)/i);

        let profit = profitMatch ? parseFloat(profitMatch[1]) : null;
        let loss = lossMatch ? parseFloat(lossMatch[1]) : null;

        if (profit !== null) profit = Math.min(100, Math.max(0, profit));
        if (loss !== null) loss = Math.min(100, Math.max(0, loss));

        // ✅ Handle missing values
        if (profit === null && loss === null) {
          profit = 50;
          loss = 50;
        } else if (profit !== null && loss === null) {
          loss = Math.max(0, 100 - profit);
        } else if (profit === null && loss !== null) {
          profit = Math.max(0, 100 - loss);
        } else {
          // normalize if total != ~100
          const total = profit + loss;
          if (total > 0 && Math.abs(total - 100) > 0.01) {
            const k = 100 / total;
            profit = +(profit * k).toFixed(2);
            loss = +(loss * k).toFixed(2);
          }
        }

        // ✅ Compute Risk as leftover
        let risk = 100 - (profit + loss);
        if (risk < 0) risk = 0;
        if (risk > 100) risk = 100;

        setProfitLoss({ profit, loss, risk });
      } else {
        setResult("<div>Error: No response from API</div>");
        setProfitLoss({ profit: 40, loss: 40, risk: 20 }); // fallback dummy
      }
    } catch (error) {
      setIsSent(true);
      setResult(`<div>Error: ${error.message}</div>`);
      setProfitLoss({ profit: 40, loss: 40, risk: 20 }); // fallback dummy
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div>
        <label>Stock Name:</label>
        <input
          type="text"
          name="stockName"
          value={values.stockName}
          onChange={handleChange}
          placeholder="Enter Stock Name"
          required
        />
      </div>

      {[
        "marketPrice",
        "eps",
        "bookValue",
        "sales",
        "annualDividends",
        "previousEps",
        "currentEps",
        "totalDebt",
        "totalEquity",
        "netIncome",
      ].map((key) => (
        <div key={key}>
          <label>{key.replace(/([A-Z])/g, " $1")}:</label>
          <input
            type="number"
            name={key}
            value={values[key]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      {isSent ? (
        <button type="submit">SUBMIT</button>
      ) : (
        <div className="loader-container">
          <DotLoader color="#36d7b7" />
        </div>
      )}
    </form>
  );
};

export default FinancialForm;




