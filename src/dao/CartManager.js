const fs = require("fs");
const Carts = require("./models/Carts.model");

class CartManager {
  constructor(path, pm) {
    this.path = path;
    this.productManager = pm;
  }

  //------------------DB---------------------------------------------
  async getCartDBbyId(id) {
    try {
      return await Carts.findById(id).populate("productos.product");
    } catch (error) {
      return error;
    }
  }

  async createCartDB(data) {
    try {
      return await Carts.create(data);
    } catch (error) {
      return error;
    }
  }

  async addProductDB(cartId, prodInfo, quantity) {
    try {
      const cart = await Carts.findById(cartId);
      const newProduct = {
        ...prodInfo,
        quantity,
      };
      if (cart.products.some((i) => i.id === prodInfo.id)) {
        await Carts.updateOne(
          { _id: cartId, "products.id": prodInfo.id },
          { $inc: { "products.$.quantity": quantity } }
        );
      } else {
        await Carts.updateOne({ $push: { products: newProduct } });
        return true;
      }

      //const newProd = cart.products.push(newProdInfo)
    } catch (error) {
      return error;
    }
  }

  //NUEVOS METODOS
 /*  async removeProductDB(cartId, productId) {
    try {
      const carrito = await this.getCartDBbyId(cartId);
      console.log(carrito);

      return true;
    } catch (error) {
      throw error;
    }
  } */

  async updateCartDB(cartId, products) {
    try {
      const cart = await Carts.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      )

      return cart;
    } catch (error) {
      throw error;
    }
  } //NO FUNCIONA

  async updateCartItem(cartId, productId, quantity) {
    try {
      const cart = await Carts.findById(cartId);
      const item = cart.productos.find(p => p.product == productId);
      if (!item) throw new Error("Producto no está en carrito");
      item.quantity = quantity;
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Carts.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');
      const productIndex = cart.productos.findIndex(p => p.product.equals(productId));
      if (productIndex === -1) throw new Error('Product not found in cart');
      cart.productos.splice(productIndex, 1);
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
  async updateProductDB(cartId, productId, quantity) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { _id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      ).populate("products.product");

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async removeAllProductsFromCartDB(cartId) {
    try {
      const cart = await Carts.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
  
      return cart;
    } catch (error) {
      throw error;
    }
  } //NO FUNCIONA

 /*  async clearCartDB(cartId) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      ).populate("products.product");

      return cart;
    } catch (error) {
      throw error;
    }
  } */

  //------------------FS---------------------------------------------
  addProductToCart(cartId, productId, quantity) {
    const carts = this.getCartsArchivo();
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const product = this.productManager.getProductById(productId);

      if (product) {
        const existingProductIndex = cart.products.findIndex(
          (p) => p.id === productId
        );
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
