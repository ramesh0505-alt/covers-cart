const db = require('../models/db');

exports.getAllProducts = async (req, res) => {
  try {
    let products;
    if (db.prisma) {
      try {
        products = await db.prisma.product.findMany({ include: { category: true } });
      } catch (dbErr) {
        console.log("Prisma products fetch error, falling back to memory:", dbErr.message);
        products = db.fallbackProducts.map(p => ({
          ...p,
          category: db.fallbackCategories.find(c => c.id === p.categoryId)
        }));
      }
    } else {
      products = db.fallbackProducts.map(p => ({
        ...p,
        category: db.fallbackCategories.find(c => c.id === p.categoryId)
      }));
    }
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    let product;
    if (db.prisma) {
      try {
        product = await db.prisma.product.findUnique({ where: { id }, include: { category: true } });
      } catch (dbErr) {
        console.log("Prisma product detail error, falling back to memory:", dbErr.message);
        product = db.fallbackProducts.find(p => p.id === id);
      }
    } else {
      product = db.fallbackProducts.find(p => p.id === id);
    }
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createProduct = async (req, res) => {
  const { title, description, price, salePrice, images, stock, deviceModels, materials, categoryId } = req.body;
  try {
    let newProduct;
    if (db.prisma) {
      try {
        newProduct = await db.prisma.product.create({
          data: { 
            title, 
            description, 
            price: parseFloat(price), 
            salePrice: salePrice ? parseFloat(salePrice) : null, 
            images, 
            stock: parseInt(stock), 
            deviceModels, 
            materials, 
            categoryId 
          }
        });
      } catch (dbErr) {
        console.log("Prisma product creation error, falling back to memory:", dbErr.message);
        newProduct = { 
          id: `prod-${Date.now()}`, 
          title, 
          description, 
          price: parseFloat(price), 
          salePrice: salePrice ? parseFloat(salePrice) : null, 
          images, 
          stock: parseInt(stock), 
          deviceModels, 
          materials, 
          categoryId 
        };
        db.fallbackProducts.push(newProduct);
      }
    } else {
      newProduct = { 
        id: `prod-${Date.now()}`, 
        title, 
        description, 
        price: parseFloat(price), 
        salePrice: salePrice ? parseFloat(salePrice) : null, 
        images, 
        stock: parseInt(stock), 
        deviceModels, 
        materials, 
        categoryId 
      };
      db.fallbackProducts.push(newProduct);
    }
    res.status(201).json(newProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.prisma) {
      try {
        await db.prisma.product.delete({ where: { id } });
      } catch (dbErr) {
        console.log("Prisma product deletion error, falling back to memory:", dbErr.message);
        db.fallbackProducts = db.fallbackProducts.filter(p => p.id !== id);
      }
    } else {
      db.fallbackProducts = db.fallbackProducts.filter(p => p.id !== id);
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, salePrice, images, stock, deviceModels, materials, categoryId } = req.body;
  try {
    let updatedProduct;
    if (db.prisma) {
      try {
        updatedProduct = await db.prisma.product.update({
          where: { id },
          data: { 
            title, 
            description, 
            price: parseFloat(price), 
            salePrice: salePrice ? parseFloat(salePrice) : null, 
            images, 
            stock: parseInt(stock), 
            deviceModels, 
            materials, 
            categoryId 
          }
        });
      } catch (dbErr) {
        console.log("Prisma product update error, falling back to memory:", dbErr.message);
        const idx = db.fallbackProducts.findIndex(p => p.id === id);
        if (idx === -1) return res.status(404).json({ error: "Product not found" });
        updatedProduct = {
          ...db.fallbackProducts[idx],
          title,
          description,
          price: parseFloat(price),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          images,
          stock: parseInt(stock),
          deviceModels,
          materials,
          categoryId
        };
        db.fallbackProducts[idx] = updatedProduct;
      }
    } else {
      const idx = db.fallbackProducts.findIndex(p => p.id === id);
      if (idx === -1) return res.status(404).json({ error: "Product not found" });
      updatedProduct = {
        ...db.fallbackProducts[idx],
        title,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        images,
        stock: parseInt(stock),
        deviceModels,
        materials,
        categoryId
      };
      db.fallbackProducts[idx] = updatedProduct;
    }
    res.json(updatedProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ids must be an array" });
  try {
    if (db.prisma) {
      try {
        await db.prisma.product.deleteMany({ where: { id: { in: ids } } });
      } catch (dbErr) {
        console.log("Prisma bulk delete error, falling back to memory:", dbErr.message);
        db.fallbackProducts = db.fallbackProducts.filter(p => !ids.includes(p.id));
      }
    } else {
      db.fallbackProducts = db.fallbackProducts.filter(p => !ids.includes(p.id));
    }
    res.json({ success: true, message: `${ids.length} products deleted` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.bulkUpdateProducts = async (req, res) => {
  const { ids, data } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ids must be an array" });
  try {
    if (db.prisma) {
      try {
        await db.prisma.product.updateMany({
          where: { id: { in: ids } },
          data
        });
      } catch (dbErr) {
        console.log("Prisma bulk update error, falling back to memory:", dbErr.message);
        db.fallbackProducts = db.fallbackProducts.map(p => {
          if (ids.includes(p.id)) return { ...p, ...data };
          return p;
        });
      }
    } else {
      db.fallbackProducts = db.fallbackProducts.map(p => {
        if (ids.includes(p.id)) return { ...p, ...data };
        return p;
      });
    }
    res.json({ success: true, message: `${ids.length} products updated` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

