## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Examples for slot game config can be used at time of setup

{
"name": "Disco Fever",
"theme": "Disco",
"type": "cascading",
"reels": 6,
"rows": 4,
"paylines": 50,
"symbols": {
"discoBall": { "payout": 150, "special": true },
"microphone": { "payout": 80 }
},
"config": {
"cascadeMultiplier": 2.5,
"maxCascades": 7
},
"betConfig": {
"minBet": 5,
"maxBet": 500,
"betIncrements": [5, 10, 50, 100, 500]
},
"isActive": true,
"colyseusSettings": {
"roomName": "cascadingReelsRoom",
"maxPlayers": 50,
"sessionDuration": 600
}
}

## Redis Streams (Persistent & Fast Alternative to Pub/Sub)

Unlike Redis Pub/Sub, Redis Streams stores messages so they can be processed later.

Install Redis & ioredis
pnpm add ioredis
