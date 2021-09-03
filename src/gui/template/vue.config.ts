import path from "path"

module.exports = {
    outputDir: path.resolve(__dirname, "./dist/vue/"),
    publicPath: process.env.NODE_ENV == "production" ? "./" : "/",
    pages: {
        index: {
            entry: path.resolve(__dirname, "./src/vue/Vue.ts")
        }
    }
}