module.exports = {
    PORT: {
        type: 'number',
        default: 8080
    },
    MONGO_URL: {
        type: 'string',
        default: 'mongodb://127.0.0.1:27017/github_oauth_db'
    },
    GITHUB_CLIENT_ID: {
        type: 'string',
        default: ''
    },
    GITHUB_CLIENT_SECRET: {
        type: 'string',
        default: ''
    }
};