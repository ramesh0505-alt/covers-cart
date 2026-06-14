const db = require('../models/db');

class ProductRepository {
  async findById(productId) {
    if (db.prisma) {
      try {
        return await db.prisma.product.findUnique({
          where: { id: productId }
        });
      } catch (e) {
        console.error("Repository: db.prisma product fetch failed, using fallback.", e.message);
      }
    }
    return db.fallbackProducts.find(p => p.id === productId) || null;
  }

  async updateStock(productId, newStock) {
    if (db.prisma) {
      try {
        return await db.prisma.product.update({
          where: { id: productId },
          data: { stock: newStock }
        });
      } catch (e) {
        console.error("Repository: db.prisma stock update failed, using fallback.", e.message);
      }
    }
    const product = db.fallbackProducts.find(p => p.id === productId);
    if (product) {
      product.stock = newStock;
      return product;
    }
    return null;
  }

  async listAllActive() {
    if (db.prisma) {
      try {
        return await db.prisma.product.findMany({
          where: { status: 'PUBLISHED' }
        });
      } catch (e) {
        console.error("Repository: db.prisma active listing failed, using fallback.", e.message);
      }
    }
    return db.fallbackProducts;
  }
}

module.exports = new ProductRepository();
