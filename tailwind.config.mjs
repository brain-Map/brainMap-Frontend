/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D52A0',
        secondary: '#7091E6',
        value1: '#8697C4',
        value2: '#ADBBDA',
        value3: '#EDE8F5',
        success: '#4CAF50',
        danger: '#FF6B6B',
        info: '#00B8D9',
        accent: '#F4D06F',
      },
    },
  },
  plugins: [],
};
