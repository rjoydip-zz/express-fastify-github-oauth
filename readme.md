
# github-oauth

A starter github-oauth using fastify.

## Installation

```
$ git clone https://github.com/rjoydip/github-oauth.git
$ cd github-oauth
$ npm install
```

Server will start on [localhost:3000](http://localhost:3000)

## Steps

- Rename `.env.example` > `.env`
- Create github oauth app [developers](https://github.com/settings/developers)
- Copy `client id` and `client secret` and put into `.env`
- Start the server by `npm start`
- Go to the `http://localhost:3000` > click on `Signin with github`
- After compliting the process of oauth you will get a response which will look like below

### Response

```json
{
  "body": {
    "access_token": "0a93dd4b20dc92938524f4ec6feb1be91c8982af",
    "token_type": "bearer",
    "scope": "repo"
  }
}
```

> Note: You can check the `access_token` working or not through this api > `https://api.github.com/user?access_token=<YOUR ACCESS TOKEN>`

## License

MIT © [Joydip Roy](https://github.com/rjoydip/github-oauth/LICENSE)