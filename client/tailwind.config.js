/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        noFriendsList: "0 1fr",
        "20rem": "20rem 1fr",
        "24rem": "24rem 1fr",
      },
    },
  },
  plugins: [],
};
