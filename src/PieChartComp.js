import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#36d7b7", "#ff6b6b", "#ffa502"]; // profit, loss, risk

const PieChartComp = ({ data }) => {
  const chartData = [
    { name: "Profit", value: data.profit || 0 },
    { name: "Loss", value: data.loss || 0 },
    { name: "Risk", value: data.risk || 0 },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Stock Analysis Breakdown</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx={200}
          cy={150}
          labelLine={false}
          outerRadius={120}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComp;

