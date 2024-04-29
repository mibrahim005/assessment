import React, { useState } from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const data = [
  { id: 0, value: 60, color: "#d76c66" },
  { id: 1, value: 35, color: "#f5cf7c" },
  { id: 2, value: 20, color: "#ea973b" },
  { id: 3, value: 20, color: "#2fb183" },
];

const size = {
  width: 500,
  height: 500,
};

const StyledText = styled("text")(({ color }) => ({
  fill: color,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 50,
  fontWeight: "bold",
}));

function PieCenterLabel({ children, cx, cy, color }) {
  return (
    <StyledText x={cx} y={cy} color={color}>
      {children}
    </StyledText>
  );
}

function App() {
  const [inputValue, setInputValue] = useState(600);
  const center = size.width / 2;
  const centerHeight = size.height / 2;
  const outerRadius = 110;
  const numTicks = 20;

  const ticks = Array.from({ length: numTicks }, (_, i) => {
    const angle = ((i / numTicks) * 180 - 175) * (Math.PI / 180);
    const newOuterRadius = 80;
    const newTickRadius = newOuterRadius + 2;
    return {
      x1: center + Math.cos(angle) * newOuterRadius,
      y1: centerHeight + Math.sin(angle) * newOuterRadius,
      x2: center + Math.cos(angle) * newTickRadius,
      y2: centerHeight + Math.sin(angle) * newTickRadius,
    };
  });

  const total = data.reduce((acc, item) => acc + item.value, 0);

  const calculatePointerPosition = (value) => {
    let newValue = value / 2;
    const normalizedValue = (newValue / 1000) * 180;
    const angleInRadians = ((normalizedValue - 90) * Math.PI) / 90;

    let sum = 0;
    let segmentColor = "#ffffff";
    for (let i = 0; i < data.length; i++) {
      sum += data[i].value;
      if (value <= (sum / total) * 1000) {
        segmentColor = data[i].color;
        break;
      }
    }

    return {
      x: center + Math.cos(angleInRadians) * outerRadius,
      y: size.height / 2 + Math.sin(angleInRadians) * outerRadius + 2,
      color: segmentColor,
    };
  };

  const pointerPosition = calculatePointerPosition(inputValue);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#252733",
      }}
    >
      <Box position="relative" width={size.width} height={size.height}>
        <TextField
          label="Enter Value (0-1000)"
          type="number"
          variant="outlined"
          value={inputValue}
          onChange={(e) =>
            setInputValue(
              Math.min(1000, Math.max(0, parseInt(e.target.value, 10)))
            )
          }
          inputProps={{ min: "0", max: "1000", step: "1" }}
          sx={{
            position: "absolute",
            top: 20,
            left: center - 80,
            zIndex: 2,
            color: "white",
            width: "150px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiInputBase-input": { color: "white" },
          }}
        />
        <PieChart
          series={[
            {
              data,
              innerRadius: 120,
              outerRadius: 100,
              startAngle: -90,
              endAngle: 90,
              paddingAngle: 1,
              cornerRadius: 10,
              cx: center,
              cy: centerHeight,
            },
          ]}
          {...size}
        >
          <PieCenterLabel
            cx={center}
            cy={centerHeight}
            color={pointerPosition.color}
          >
            {inputValue}
          </PieCenterLabel>
        </PieChart>
        <svg
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: "3px" }}
        >
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="13"
                floodColor={pointerPosition.color}
                floodOpacity="0.5"
              />
            </filter>
          </defs>
          {ticks.map((tick) => (
            <line
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="#716e71"
              strokeWidth="2"
            />
          ))}
          <circle
            cx={pointerPosition.x}
            cy={pointerPosition.y}
            r={18}
            fill={pointerPosition.color}
            filter="url(#shadow)"
          />
          <circle
            cx={pointerPosition.x}
            cy={pointerPosition.y}
            r={7}
            fill="white"
          />
        </svg>
      </Box>
    </Box>
  );
}

export default App;
