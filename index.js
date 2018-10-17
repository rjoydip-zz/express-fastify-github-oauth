"use strict";

const fs = require("fs");
const path = require("path");
const fastify = require("fastify");
const express = require("express");
const request = require("superagent");
const dotenv = require("dotenv");
const yaml = require('js-yaml');
const isDev = process.env.NODE_ENV !== "production";

const gitScope = yaml.safeLoad(fs.readFileSync('./scope.yml', 'utf8'));

let config = null;

const getScope = () => Object.keys(gitScope).filter(i => gitScope[i]).join(',');

config = dotenv.config({
    path: path.resolve(process.cwd(), '.env')
}).parsed;

if (isDev) {
    config = Object.assign(config, dotenv.config({
        path: path.resolve(process.cwd(), '.env.development')
    }).parsed);
} else {
    config = Object.assign(config, dotenv.config({
        path: path.resolve(process.cwd(), '.env.production')
    }).parsed);
}

const isExpress = process.env.PROJECT_TYPE === "express";

const app = isExpress ?
    express() :
    fastify({
        logger: isDev
    });

app.get("/github/callback", async (req, res) => {
    const {
        err,
        body
    } = await request
        .post("https://github.com/login/oauth/access_token")
        .send({
            ...req.query,
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET
        })
        .set("Accept", "application/json");
    return await res.type("application/json").send({
        err,
        body
    });
});

app.get("/", async (req, res) => {
    return await res.type("text/html").send(
        `
        <html>
            <head>
                <title>Github signin</title>
            </head>
            <body>
                <a href="https://github.com/login/oauth/authorize?client_id=${
                process.env.GITHUB_CLIENT_ID
                }&scope=${getScope()}" alt="signin with github">Signin with github</a>
            </body>
        </html>
        `
    );
});

(async () => {
    if (isExpress) {
        app.listen(process.env.PORT, () => {
            if (isDev) {
                console.log(`Express server is running on port: ${process.env.PORT}`);
            }
        });
    } else {
        await app.ready();
        await app.listen(process.env.PORT);
    }
})();