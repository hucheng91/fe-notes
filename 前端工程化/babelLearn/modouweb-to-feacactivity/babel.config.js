module.exports = api => {
    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "debug": true,
                    "useBuiltIns": "usage",
                    "targets": {
                        "browsers": ["android>4.0"]
                    }
                }
            ]
        ],
        "plugins": [
            [
                "@babel/plugin-proposal-class-properties",
                {
                    "loose": true
                }
            ]
        ],
    }

}