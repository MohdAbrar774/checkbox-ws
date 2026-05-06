# 🚀 Real-Time Checkbox Grid (WebSockets + Redis)

A **real-time distributed web application** where multiple users can interact with a shared grid of checkboxes and see updates instantly across all connected clients.

Built to demonstrate:

* ⚡ Real-time systems (WebSockets)
* 🧠 Distributed state management (Redis / Valkey)
* 🛡️ Custom rate limiting
* 🏗️ Scalable backend architecture

---

## 🧠 Overview

This project allows users to toggle checkboxes in a shared grid.

When a checkbox is updated:

1. Client emits event via WebSocket
2. Server validates + rate limits
3. State is updated in Redis
4. Update is broadcast to all clients (via Pub/Sub)


## 🎥 Project Walkthrough

A complete walkthrough of the project architecture, real-time communication flow, Redis integration, rate limiting logic, and deployment process is available here:

🔗 YouTube Walkthrough: [Watch the Video](https://youtu.be/XGlb93NXiFI)

---

## ⚙️ Tech Stack

### Frontend

* HTML
* CSS
* Vanilla JavaScript

### Backend

* Node.js
* Express
* Socket.IO

### Infrastructure

* Redis / Valkey
* Redis Pub/Sub
* Docker (for Redis)

---

## 🏗️ Architecture

```
Client (Browser)
     ↕ WebSocket
Node.js Server
     ↕
Redis (State Store)
     ↕
Pub/Sub (Broadcast Updates)
```

---

## 🔥 Features

* ✅ Real-time checkbox updates across all users
* ✅ Redis-backed shared state
* ✅ Pub/Sub for multi-instance scalability
* ✅ Custom rate limiting (no external libraries)
* ✅ Socket-based communication
* ✅ Clean modular backend structure
* ✅ Environment-based configuration

---

## 📁 Project Structure

```
.
│   .env
│   docker-compose.yml
│   env.example
│   index.js
│   package-lock.json
│   package.json
│   pnpm-lock.yaml
│   redis-connection.js
│   
├───public
│       index.html
│       
└───src ├───Currently Avoid it
       

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/checkbox-ws.git
cd checkbox-ws
```

---

### 2. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

### 3. Start Redis (Docker)

```bash
docker-compose up -d
```

Verify:

```bash
docker ps
```

You should see:

```
0.0.0.0:6379->6379/tcp
```

---

### 4. Install dependencies

```bash
npm install
```

---

### 5. Run the server

```bash
node index.js
```

---

### 6. Open in browser

```
http://localhost:5000
```

---

## 📡 API Endpoints

### Health Check

```
GET /health
```

### Get Checkbox State

```
GET /checkboxes
```

Response:

```json
{
  "checkboxes": [true, false, ...]
}
```

---

## 🔌 WebSocket Events

### Client → Server

```js
"client:checkbox:change"
{
  index: number,
  checked: boolean
}
```

---

### Server → Client

```js
"server:checkbox:change"
{
  index: number,
  checked: boolean
}
```

---

### Error Event

```js
"server:error"
{
  error: string
}
```

---

## 🧮 State Management

* Stored in Redis under key:

```
checkbox-state-v1
```

* Format:

```js
[false, true, false, ...]
```

---

## ⚡ Rate Limiting

Custom implementation using Redis:

* Key:

```
rate:limiting:{socketId}
```

* Logic:
* One action allowed every ~5.5 seconds
* Prevents spam clicks

---

## 🛡️ Security Considerations

* Input validation on socket events
* Rate limiting per socket
* Controlled broadcast flow
* Error handling for Redis failures

---

## 🚀 Future Improvements

* 🔥 Redis Bitmap (memory optimization for 1M checkboxes)
* 📉 Virtualized rendering (frontend performance)
* 🧪 Load testing (k6 / Artillery)
* 📊 Monitoring & logging (Prometheus / Grafana)
* 🔐 Full OAuth2 / OIDC integration
* 🌐 Multi-instance deployment (horizontal scaling)

---

## 🧠 Key Learnings

* Designing real-time systems with WebSockets
* Handling distributed state with Redis
* Implementing Pub/Sub architecture
* Building custom rate limiting logic
* Managing frontend performance constraints

---

## 🤝 Contributing

Feel free to open issues or submit pull requests.

---

## 📜 License

MIT License

---

## 👨‍💻 Author

Built by a developer exploring **real-time distributed systems** 🚀
