import React, { useState } from "react";
import FinancialForm from "./Financialform";
import Result from "./Result";
import PieChartComp from "./PieChartComp";
import StockGraph from "./StockGraph";
import "./App.css"; // background video styles

function App() {
  const [result, setResult] = useState("");
  const [stockName, setStockName] = useState("");
  const [profitLoss, setProfitLoss] = useState({
    profit: 50,
    loss: 30,
    risk: 20,
  }); // dummy values

  return (
    <div className="App">
      {/* 🎥 Background Video */}
      <video autoPlay loop muted id="bg-video">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="content">
        <header>
          <h1>📈 Stock Sight</h1>
        </header>

        {/* Stock Input Form */}
        <FinancialForm
          setResult={setResult}
          setStockName={setStockName}
          setProfitLoss={setProfitLoss}
        />

        {/* Yahoo Finance Graph */}
        <section className="graph-section">
          <StockGraph stockName={stockName} />
        </section>

        {/* Gemini Result */}
        <section className="result-section">
          <Result result={result} stockName={stockName} />
        </section>

        {/* Pie Chart */}
        <section className="chart-section">
          <PieChartComp data={profitLoss} />
        </section>
      </div>
    </div>
  );
}

export default App;

