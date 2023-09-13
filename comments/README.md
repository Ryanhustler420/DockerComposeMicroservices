# Comments 💬

**This service is responsible for managing comments of posts.**

### Routes

| Method | Route                      | Auth |
| ------ | -------------------------- | ---- |
| GET    | **/comments**              | No   |
| GET    | **/comments/:id**          | No   |
| GET    | **/comments/post/:postid** | No   |

### Env Variables

| Key       | Value       |
| --------- | ----------- |
| MONGO_URI | mongodb     |
| ENV       | development |
| PORT      | 3003        |

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
