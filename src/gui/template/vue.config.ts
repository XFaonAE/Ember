import path from "path";

module.exports = {
    outputDir: path.resolve(__dirname, "./dist/vue/"),
    pages: {
        index: {
            entry: path.resolve(__dirname, "./src/vue/Vue.ts")
        }
    }
}