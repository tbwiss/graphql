module.exports = {
  // eslint-disable-next-line global-require
  presets: [require('@neo4j-ndl/base/lib/optimised.config')],
  prefix: "", // Remove "n-" prefix from Design System Library
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{html,ts,tsx,css}", "./public/**/*.html"],
  theme: {
    extend: {
      height: {
        "content-container": "calc(100vh - 4rem)",
      },
      width: {
        "editor-container": "calc(100% - (24rem + 24rem))",
        "login": "30rem"
      },
      colors: {
        draculaDark: "#282A36",
        contentBlue: "#F6F7FA",
      },
    },
  },
  plugins: [],
}