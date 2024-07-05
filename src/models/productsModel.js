import fs from ('fs');
import path from ('path');

const PRODUCTS_FILE_PATH = path.join(__dirname, '../data/productos.json');

const productsModel = {
    getAllProducts: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    },
    getProductById: (productId) => {
        return new Promise((resolve, reject) => {
            fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const products = JSON.parse(data);
                    const product = products.find(p => p.id == productId);
                    if (product) {
                        resolve(product);
                    } else {
                        reject(new Error('Product not found'));
                    }
                }
            });
        });
    },
    addProduct: (newProductData) => {
        return new Promise((resolve, reject) => {
            fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const products = JSON.parse(data);
                    const newProduct = {
                        id: Math.max(...products.map(p => p.id), 0) + 1,
                        ...newProductData
                    };
                    products.push(newProduct);
                    fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(newProduct);
                        }
                    });
                }
            });
        });
    },
    updateProductById: (productId, updatedProductData) => {
        return new Promise((resolve, reject) => {
            fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let products = JSON.parse(data);
                    const index = products.findIndex(p => p.id == productId);
                    if (index !== -1) {
                        products[index] = {
                            ...products[index],
                            ...updatedProductData,
                            id: productId // Ensure id remains unchanged
                        };
                        fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(products[index]);
                            }
                        });
                    } else {
                        reject(new Error('Product not found'));
                    }
                }
            });
        });
    },
    deleteProductById: (productId) => {
        return new Promise((resolve, reject) => {
            fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let products = JSON.parse(data);
                    const index = products.findIndex(p => p.id == productId);
                    if (index !== -1) {
                        products.splice(index, 1);
                        fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        reject(new Error('Product not found'));
                    }
                }
            });
        });
    }
};

module.exports = productsModel;
