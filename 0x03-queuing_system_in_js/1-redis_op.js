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
  
  // Call the functions once connected
  displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
});

// Function to set a new school value
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

// Function to display the school value
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.log('Error retrieving value:', err);
    } else {
      console.log(value);
    }
    
    // Close the client after retrieving the value
    client.quit();
  });
}
