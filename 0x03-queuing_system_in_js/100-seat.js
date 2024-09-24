#!/usr/bin/node
/**
 * Seat Reservation API with Redis and Kue
 */
import { promisify } from 'util';
import { createClient } from 'redis';
import { createQueue } from 'kue';
import express from 'express';

let reservationEnabled = true;
const redisClient = createClient();

redisClient.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

const reserveSeat = promisify(redisClient.SET).bind(redisClient);
const getCurrentAvailableSeats = promisify(redisClient.GET).bind(redisClient);

async function decreaseSeatCount() {
  const DECR = promisify(redisClient.DECR).bind(redisClient);
  return DECR('available_seats');
}

const queue = createQueue();

const app = express();

app.get('/available_seats', async (req, res) => {
  try {
    const seats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: seats });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to fetch available seats' });
  }
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const job = queue.create('reserve_seat', { task: 'reserve a seat' })
    .on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    })
    .on('failed', (err) => {
      console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
    })
    .save((err) => {
      if (err) {
        return res.json({ status: 'Reservation failed' });
      }
      return res.json({ status: 'Reservation in process' });
    });
});

app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      let availableSeats = await getCurrentAvailableSeats();

      if (availableSeats <= 0) {
        reservationEnabled = false;
        return done(new Error('Not enough seats available'));
      }

      await decreaseSeatCount();
      availableSeats -= 1;

      if (availableSeats === 0) {
        reservationEnabled = false;
      }

      return done();
    } catch (err) {
      return done(new Error('Error processing seat reservation'));
    }
  });
});

app.listen(1245, async () => {
  try {
    await reserveSeat('available_seats', 50);
    reservationEnabled = true;
    console.log('API available on localhost via port 1245');
  } catch (err) {
    console.log('Error initializing available seats:', err.message);
  }
});
