const fs = require("fs");

class CartManager {
  constructor(path, pm){
    this.path = path;
    this.productManager = pm;
  }

  addProductToCart(cartId, productId, quantity) {
    const carts = this.getCartsArchivo();
    const cartIndex = carts.findIndex(c => c.id === cartId);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const product = this.productManager.getProductById(productId);

      if (product) {
        const existingProductIndex = cart.products.findIndex(p => p.id === productId);
        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          cart.products.push({ id: productId, quantity });
        }
        this.saveCartsArchivo(carts);
      }
    }
  }

  getCarts() {
    return this.getCartsArchivo();
  }

  getCartsById(id) {
    const carts = this.getCartsArchivo();
    const cart = carts.find((c) => c.id == id);

    return cart || null;
  }

  getCartsArchivo() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.writeFileSync(this.path, "[]");
      }
      const cartsData = fs.readFileSync(this.path, "utf-8");
      const carts = JSON.parse(cartsData);
      return carts;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  saveCartsArchivo(carts) {
    fs.writeFileSync(this.path, JSON.stringify(carts));
  }
}

module.exports = CartManager;
