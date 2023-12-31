# Posts 📃

**This service is responsible for managing posts.**

### Routes

| Method | Route          | Auth |
| ------ | -------------- | ---- |
| GET    | **/posts**     | No   |
| GET    | **/posts/:id** | No   |

### Env Variables

| Key       | Value       |
| --------- | ----------- |
| MONGO_URI | mongodb     |
| ENV       | development |
| PORT      | 3002        |

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
