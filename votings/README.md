# Votings ☝️

**This service is responsible for managing votes. Like showing who is voted the most**

### Routes

| Method | Route        | Auth |
| ------ | ------------ | ---- |
| GET    | **/votings** | No   |

### Env Variables

| Key        | Value       |
| ---------- | ----------- |
| MONGO_URI  | mongodb     |
| ENV        | development |
| PORT       | 3003        |
| REDIS_HOST | redis       |
| REDIS_PORT | 6379        |

### Npm

- `npm i`
- `npm start`

### Docker

- `docker build -t app .`
- `docker images`
- `docker run -it ${IMAGE_ID} sh`

### Stack

- Express
- Axios

### Docker Compose

- `docker compose up --build`
- `docker compose down`
