#!/usr/bin/node
/**
 * Stock check with Redis and Express
 */
import { promisify } from 'util';
import { createClient } from 'redis';
import express from 'express';

const redisClient = createClient();

redisClient.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

const listProducts = [
  { Id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { Id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { Id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { Id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

function transform(product) {
  return {
    itemId: product.Id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
  };
}

function getItemById(id) {
  return listProducts.find(product => product.Id === id);
}

function getItems() {
  return listProducts.map(transform);
}

async function reserveStockById(itemId, stock) {
  const SET = promisify(redisClient.SET).bind(redisClient);
  try {
    await SET(`item.${itemId}`, stock);
  } catch (err) {
    throw new Error(`Could not reserve stock for item ${itemId}: ${err.message}`);
  }
}

async function getCurrentReservedStockById(itemId) {
  const GET = promisify(redisClient.GET).bind(redisClient);
  try {
    const stock = await GET(`item.${itemId}`);
    return stock === null ? 0 : parseInt(stock, 10);
  } catch (err) {
    throw new Error(`Could not fetch reserved stock for item ${itemId}: ${err.message}`);
  }
}

const app = express();

app.get('/list_products', (req, res) => {
  res.json(getItems());
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  }
  
  try {
    const reservedStock = await getCurrentReservedStockById(itemId);
    item.currentQuantity = item.stock - reservedStock;
    res.json(transform(item));
  } catch (err) {
    res.status(500).json({ status: 'Error fetching product stock', error: err.message });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return res.status(404).json({ status: 'Product not found' });
  }

  try {
    const reservedStock = await getCurrentReservedStockById(itemId);
    if (reservedStock >= item.stock) {
      return res.status(400).json({ status: 'Not enough stock available', itemId });
    }
    await reserveStockById(itemId, reservedStock + 1);
    res.json({ status: 'Reservation confirmed', itemId });
  } catch (err) {
    res.status(500).json({ status: 'Error reserving product', error: err.message });
  }
});

async function clearRedisStock() {
  const SET = promisify(redisClient.SET).bind(redisClient);
  return Promise.all(listProducts.map((item) => SET(`item.${item.Id}`, 0)));
}

app.listen(1245, async () => {
  await clearRedisStock();
  console.log('API available on localhost via port 1245');
});
