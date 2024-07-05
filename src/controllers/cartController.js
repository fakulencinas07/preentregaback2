import fs from 'fs';
import path from 'path';
import { generateId } from '../utils/idGenerator.js';

const dataPath = path.join('data', 'carts.json');

export const createCart = (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const id = generateId(data);
    const newCart = { id, products: [] };

    data.push(newCart);
    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.status(201).json(newCart);
};

export const getCartProducts = (req, res) => {
    const { cid } = req.params;
    const data = JSON.parse(fs.readFileSync(dataPath));
    const cart = data.find(c => c.id === cid);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

export const addProductToCart = (req, res) => {
    const { cid, pid } = req.params;
    const data = JSON.parse(fs.readFileSync(dataPath));
    const cartIndex = data.findIndex(c => c.id === cid);

    if (cartIndex !== -1) {
        const productIndex = data[cartIndex].products.findIndex(p => p.product === pid);

        if (productIndex !== -1) {
            data[cartIndex].products[productIndex].quantity += 1;
        } else {
            data[cartIndex].products.push({ product: pid, quantity: 1 });
        }

        fs.writeFileSync(dataPath, JSON.stringify(data));
        res.json(data[cartIndex]);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
};

