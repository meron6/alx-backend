# Queuing System in JavaScript

## Project Overview

This project involves creating a queuing system using JavaScript, Node.js, Express, Redis, and Kue. The goal is to build a basic Express app that interacts with a Redis server and manages job queues using Kue.

## Learning Objectives

By the end of this project, you should be able to:

- Run a Redis server on your machine.
- Perform basic operations with the Redis client.
- Use a Redis client with Node.js for basic operations.
- Store hash values in Redis.
- Handle asynchronous operations with Redis.
- Use Kue as a queue system.
- Build a basic Express app interacting with a Redis server.
- Build a basic Express app interacting with a Redis server and queue.

## Requirements

- All code will be compiled/interpreted on Ubuntu 18.04, Node 12.x, and Redis 5.0.7.
- All files should end with a new line.
- A `README.md` file at the root of the project folder is mandatory.
- Your code should use the `.js` extension.

## Installation

### Redis Installation

1. Download and extract Redis:
    ```bash
    $ wget http://download.redis.io/releases/redis-6.0.10.tar.gz
    $ tar xzf redis-6.0.10.tar.gz
    $ cd redis-6.0.10
    ```

2. Compile Redis:
    ```bash
    $ make
    ```

3. Start Redis in the background:
    ```bash
    $ src/redis-server &
    ```

4. Verify Redis is running:
    ```bash
    $ src/redis-cli ping
    PONG
    ```

5. Set and get a value using Redis client:
    ```bash
    127.0.0.1:[Port]> set Holberton School
    OK
    127.0.0.1:[Port]> get Holberton
    "School"
    ```

6. Stop the Redis server:
    ```bash
    $ ps aux | grep redis-server
    $ kill [PID_OF_Redis_Server]
    ```

### Project Setup

1. Clone the repository:
    ```bash
    $ git clone https://github.com/yourusername/alx-backend.git
    $ cd alx-backend/0x03-queuing_system_in_js
    ```

2. Install dependencies:
    ```bash
    $ npm install
    ```

3. Copy the `dump.rdb` file from the `redis-5.0.7` directory into the root of the project.

## Usage

1. Start the Redis server:
    ```bash
    $ src/redis-server &
    ```

2. Run the Express app:
    ```bash
    $ npm start
    ```

3. Create a job by sending a POST request to `/job` with the job data.

## Example Code

Here's a basic example to get you started:

```javascript
const express = require('express');
const redis = require('redis');
const kue = require('kue');

const client = redis.createClient();
const queue = kue.createQueue();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/job', (req, res) => {
  const job = queue.create('example', {
    title: 'Example Job',
    data: req.body
  }).save((err) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(`Job created with ID: ${job.id}`);
  });
});

queue.process('example', (job, done) => {
  console.log(`Processing job ${job.id}`);
  done();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
