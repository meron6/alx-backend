#!/usr/bin/node
/**
 * Connect to Redis server via Redis client
 */
import { createClient, print } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');

  // Use MULTI to batch HSET operations
  client
    .MULTI()
    .HSET('HolbertonSchools', 'Portland', 50, print)
    .HSET('HolbertonSchools', 'Seattle', 80, print)
    .HSET('HolbertonSchools', 'New York', 20, print)
    .HSET('HolbertonSchools', 'Bogota', 20, print)
    .HSET('HolbertonSchools', 'Cali', 40, print)
    .HSET('HolbertonSchools', 'Paris', 2, print)
    .EXEC((err, replies) => {
      if (err) {
        console.error('Error executing MULTI:', err);
      } else {
        console.log('HSET replies:', replies);
        
        // Retrieve the hash data
        client.HGETALL('HolbertonSchools', (err, hashset) => {
          if (err) {
            console.error('Error retrieving hashset:', err);
          } else {
            console.log(hashset);
          }

          // Close the Redis client
          client.quit();
        });
      }
    });
});
