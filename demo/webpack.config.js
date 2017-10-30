module.exports = {
    entry: './index.ts',
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            reportFiles: ["**/*.{ts,js}"]
                        }
                    }
                ]
            }
        ]
    }
};
