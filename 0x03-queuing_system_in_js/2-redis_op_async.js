#!/usr/bin/node
/**
 * Connect to Redis server via Redis client
 */
import { promisify } from 'util';
import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const SET = promisify(client.set).bind(client);
const GET = promisify(client.get).bind(client);

async function setNewSchool(schoolName, value) {
  try {
    const response = await SET(schoolName, value);
    console.log(response); // Logs the response from SET, typically "OK"
  } catch (error) {
    console.log('Error setting value:', error.toString());
  }
}

async function displaySchoolValue(schoolName) {
  try {
    const value = await GET(schoolName);
    console.log(value);
  } catch (error) {
    console.log('Error retrieving value:', error.toString());
  }
}

(async () => {
  await displaySchoolValue('Holberton');
  await setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
  
  // Close the Redis client
  client.quit();
})();
