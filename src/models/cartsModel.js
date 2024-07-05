import fs from ('fs');
import path from ('path');

const CARTS_FILE_PATH = path.join(__dirname, '../data/carrito.json');

const cartsModel = {
    createCart: () => {
        const newCart = {
            id: Date.now().toString(),
            products: []
        };
        return new Promise((resolve, reject) => {
            fs.readFile(CARTS_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const carts = JSON.parse(data);
                    carts.push(newCart);
                    fs.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(newCart);
                        }
                    });
                }
            });
        });
    },
    getProductsInCartById: (cartId) => {
        return new Promise((resolve, reject) => {
            fs.readFile(CARTS_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const carts = JSON.parse(data);
                    const cart = carts.find(c => c.id === cartId);
                    if (cart) {
                        resolve(cart.products);
                    } else {
                        reject(new Error('Cart not found'));
                    }
                }
            });
        });
    },
    addProductToCart: (cartId, productId, productQuantity) => {
        return new Promise((resolve, reject) => {
            fs.readFile(CARTS_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const carts = JSON.parse(data);
                    const cartIndex = carts.findIndex(c => c.id === cartId);
                    if (cartIndex !== -1) {
                        const cart = carts[cartIndex];
                        const existingProductIndex = cart.products.findIndex(p => p.product === productId);
                        if (existingProductIndex !== -1) {
                            cart.products[existingProductIndex].quantity += productQuantity;
                        } else {
                            cart.products.push({ product: productId, quantity: productQuantity });
                        }
                        fs.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        reject(new Error('Cart not found'));
                    }
                }
            });
        });
    }
};

module.exports = cartsModel;
