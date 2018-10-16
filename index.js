"use strict";

const fastifyEnv = require('fastify-env');
const fastify = require('fastify');
const request = require('superagent');
const config = require('dotenv').config().parsed;

const isDev = process.env.NODE_ENV !== 'production';

const app = fastify({
    logger: isDev
});

app.get('/github/callback', async (req, reply) => {
    const {
        err,
        body
    } = await request.post('https://github.com/login/oauth/access_token')
        .send({
            ...req.query,
            client_id: app.env.GITHUB_CLIENT_ID,
            client_secret: app.env.GITHUB_CLIENT_SECRET
        })
        .set('Accept', 'application/json');
    return {
        err,
        body
    };
});

app.get('/', async (request, reply) => {
    await reply.type('text/html').send(
        `
        <html>
            <head>
                <title>Github signin</title>
            </head>
            <body>
                <a href="https://github.com/login/oauth/authorize?client_id=${app.env.GITHUB_CLIENT_ID}&scope=repo" alt="signin with github">Signin with github</a>
            </body>
        </html>
        `
    );
});

(async () => {
    await app.register(fastifyEnv, {
        confKey: 'env',
        schema: {
            type: 'object',
            properties: require('./properties'),
        },
        data: config,
    });
    await app.ready();
    await app.listen(app.env.PORT);
})();