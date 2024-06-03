module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "switch-active": "#2dd4bf", // Green for active state
        "switch-inactive": "#d1d5db", // Gray for inactive state
      },
      borderColor: {
        "switch-active": "#4ade80", // Green for active state
      },
      spacing: {
        "switch-knob": "1rem", // For knob size
      },
      dropShadow: {
        redGlow: [
          "0 0px 10px rgba(255, 0, 0, 0.7)", // Red glow
          "0 0px 65px rgba(255, 0, 0, 0.2)", // Red glow
        ],
        blueGlow: [
          "0 0px 10px rgba(0, 0, 255, 0.7)", // Blue glow
          "0 0px 65px rgba(0, 0, 255, 0.2)", // Blue glow
        ],
        greenGlow: [
          "0 0px 10px rgba(0, 255, 0, 0.7)", // Green glow
          "0 0px 65px rgba(0, 255, 0, 0.2)", // Green glow
        ],
        yellowGlow: [
          "0 0px 10px rgba(255, 255, 0, 0.7)", // Yellow glow
          "0 0px 65px rgba(255, 255, 0, 0.2)", // Yellow glow
        ],
        purpleGlow: [
          "0 0px 10px rgba(128, 0, 128, 0.7)", // Purple glow
          "0 0px 65px rgba(128, 0, 128, 0.2)", // Purple glow
        ],
        tealGlow: [
          "0 0px 10px rgba(0, 255, 255, 0.7)", // Teal glow
          "0 0px 65px rgba(0, 255, 255, 0.2)", // Teal glow
        ],
        orangeGlow: [
          "0 0px 10px rgba(255, 165, 0, 0.7)", // Orange glow
          "0 0px 65px rgba(255, 165, 0, 0.2)", // Orange glow
        ],
        pinkGlow: [
          "0 0px 10px rgba(255, 192, 203, 0.7)", // Pink glow
          "0 0px 65px rgba(255, 192, 203, 0.2)", // Pink glow
        ],
        cyanGlow: [
          "0 0px 10px rgba(0, 255, 255, 0.7)", // Cyan glow
          "0 0px 65px rgba(0, 255, 255, 0.2)", // Cyan glow
        ],
        whiteGlow: [
          "0 0px 10px rgba(255, 255, 255, 0.7)", // White glow
          "0 0px 65px rgba(255, 255, 255, 0.2)", // White glow
        ],
      },
    },
  },
  plugins: [],
};
