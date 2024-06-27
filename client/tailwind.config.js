/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-green": "#37ba36",
      },
      gridTemplateColumns: {
        noFriendsList: "0 1fr",
        noConversation: "1fr 0",
        "20rem": "20rem 1fr",
        "24rem": "24rem 1fr",
      },
      animation: {
        wiggle: "wiggle .5s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [],
  },
  darkMode: "class",
};
