const productRepository = require('../repositories/productRepository');

class InventoryService {
  async reserveStock(items) {
    console.log("InventoryService: Starting stock reservation check");
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }
    }
    
    // In a fully persistent Postgres DB, we would write lock reservations here.
    console.log("InventoryService: All items successfully reserved");
    return true;
  }

  async deductStock(items) {
    console.log("InventoryService: Starting stock deduction");
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (product) {
        const remainingStock = Math.max(0, product.stock - item.quantity);
        await productRepository.updateStock(item.productId, remainingStock);
        console.log(`InventoryService: Deducted ${item.quantity} units for product ${product.title}. Remaining: ${remainingStock}`);

        // Trigger alarm alert if stock drops below threshold
        if (remainingStock <= 5) {
          console.warn(`[ALERT] InventoryService: Product ${product.title} has low stock (${remainingStock} units left)!`);
        }
      }
    }
    return true;
  }

  async restock(items) {
    console.log("InventoryService: Starting restock action");
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (product) {
        const newStock = product.stock + item.quantity;
        await productRepository.updateStock(item.productId, newStock);
        console.log(`InventoryService: Restocked ${item.quantity} units for product ${product.title}. New total: ${newStock}`);
      }
    }
    return true;
  }
}

module.exports = new InventoryService();
