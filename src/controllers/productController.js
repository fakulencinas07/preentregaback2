import fs from 'fs';
import path from 'path';
import { generateId } from '../utils/idGenerator.js';

const dataPath = path.join('data', 'products.json');

export const getAllProducts = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const data = JSON.parse(fs.readFileSync(dataPath));
    const products = limit ? data.slice(0, limit) : data;
    res.json(products);
};

export const getProductById = (req, res) => {
    const { pid } = req.params;
    const data = JSON.parse(fs.readFileSync(dataPath));
    const product = data.find(p => p.id === pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const addProduct = (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    const data = JSON.parse(fs.readFileSync(dataPath));
    const id = generateId(data);

    const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
    data.push(newProduct);
    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.status(201).json(newProduct);
};

export const updateProduct = (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    delete updateData.id;

    const data = JSON.parse(fs.readFileSync(dataPath));
    const productIndex = data.findIndex(p => p.id === pid);

    if (productIndex !== -1) {
        data[productIndex] = { ...data[productIndex], ...updateData };
        fs.writeFileSync(dataPath, JSON.stringify(data));
        res.json(data[productIndex]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const deleteProduct = (req, res) => {
    const { pid } = req.params;
    const data = JSON.parse(fs.readFileSync(dataPath));
    const newData = data.filter(p => p.id !== pid);

    if (newData.length !== data.length) {
        fs.writeFileSync(dataPath, JSON.stringify(newData));
        res.json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

