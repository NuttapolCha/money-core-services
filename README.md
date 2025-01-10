# Money Core Services

Core economy system for the XXX game!

## System Overview

[API Endpoints](./docs/API.md)

![Database Schema](./docs/dbdiagram.png)

## Completed Features

- [x] Create new user with initial 1000 GEM
- [x] Users able to transfer their GEM with double-entry book keeping methodology
- [x] Users able to view their GEM account and balance
- [x] Users able to view their transactions with pagination
- [x] Logger with JSON structure on production environment (simple colorized for local development)
- [ ] E2E tests

## Developing Features

- Requests validation and returning appropriate status code rather than always 500.
- Authentication: clients will need to obtained access token before using the restricted API, currently we use `user-id` as the request header to identify who is making the request.
- Event Broker: every transaction emits the event to the event broker which any services can be subsribe to and do whatever they want.

## Development Setup

**Prerequisite**

- Docker
- Nodejs

By the end of this guide, you are expecting to see services running on your local machine with PostgreSQL database running on your Docker container.

1. Create your own `.env` file

   ```sh
   cp .env.example .env
   ```

2. Start services' dependencies. Currently we have only PostgreSQL

   ```sh
   docker compose -f docker-compose-db.yaml up -d
   ```

3. Migrate schema so that your schema is up to date

   ```sh
   npm run schema:up
   ```

   If you want to migrate schema, please generate the `.sql` file using the following command

   ```sh
   npm run schema:gen
   ```

4. Start the desire service

   ```sh
   # for user-service
   npm run dev:user

   # for gem-service
   npm run dev:gem
   ```

5. To drop the database and data

   ```sh
   docker compose -f docker-compose-db.yaml down --volumes
   ```
