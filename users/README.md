# Comments 💬

**This service is responsible for managing users.**

### Routes

| Method | Route          | Auth |
| ------ | -------------- | ---- |
| GET    | **/users**     | No   |
| GET    | **/users/:id** | No   |

### Env Variables

| Key  | Value       |
| ---- | ----------- |
| ENV  | development |
| PORT | 3001        |

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
