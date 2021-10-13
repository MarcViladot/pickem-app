module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            animation: {
                'blink': 'blink .5s infinite alternate',
            },
            keyframes: {
                blink: {
                    '0%': { opacity: .3},
                    '50%': {opacity: .6},
                    '100%': {opacity: 1}
                }
            },
            height: {
                100: '100px',
                150: '150px'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};

