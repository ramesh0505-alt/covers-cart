const db = require('../models/db');

exports.getReviews = async (req, res) => {
  const showAll = req.query.all === 'true';

  if (db.prisma) {
    try {
      const reviews = await db.prisma.review.findMany({
        where: showAll ? {} : { isApproved: true },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(reviews);
    } catch (err) {
      console.error("Prisma fetch reviews failed, using fallback:", err.message);
    }
  }

  // Fallback
  let reviews = db.fallbackReviews;
  if (!showAll) {
    reviews = reviews.filter(r => r.isApproved);
  }
  // Populate mock product link
  const reviewsWithProducts = reviews.map(r => {
    const product = db.fallbackProducts.find(p => p.id === r.productId);
    return { ...r, product };
  });

  // Sort by createdAt desc
  reviewsWithProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(reviewsWithProducts);
};

exports.createReview = async (req, res) => {
  const { rating, comment, productId, reviewerName, image, userId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    rating: parseInt(rating) || 5,
    comment: comment || "",
    productId,
    reviewerName: reviewerName || "Verified Buyer",
    image: image || null,
    userId: userId || null,
    isApproved: reviewerName ? true : false, // Admin manual additions are auto-approved
    createdAt: new Date().toISOString()
  };

  if (db.prisma) {
    try {
      const dbReview = await db.prisma.review.create({
        data: {
          rating: newReview.rating,
          comment: newReview.comment,
          productId: newReview.productId,
          reviewerName: newReview.reviewerName,
          image: newReview.image,
          userId: newReview.userId,
          isApproved: newReview.isApproved
        }
      });
      return res.status(201).json(dbReview);
    } catch (err) {
      console.error("Prisma create review failed, using fallback:", err.message);
    }
  }

  // Fallback
  db.fallbackReviews.unshift(newReview);
  res.status(201).json(newReview);
};

exports.approveReview = async (req, res) => {
  const { id } = req.params;

  if (db.prisma) {
    try {
      const updated = await db.prisma.review.update({
        where: { id },
        data: { isApproved: true }
      });
      return res.json(updated);
    } catch (err) {
      console.error("Prisma approve review failed:", err.message);
    }
  }

  // Fallback
  const review = db.fallbackReviews.find(r => r.id === id);
  if (review) {
    review.isApproved = true;
    return res.json(review);
  }
  res.status(404).json({ error: "Review not found" });
};

exports.featureReview = async (req, res) => {
  const { id } = req.params;

  if (db.prisma) {
    try {
      // Find the review to toggle its featured status.
      // Note: Assuming a 'featured' column exists. If not, this is caught and fallback is used.
      const existing = await db.prisma.review.findUnique({ where: { id } });
      if (existing) {
        const updated = await db.prisma.review.update({
          where: { id },
          data: { featured: !existing.featured }
        });
        return res.json(updated);
      }
    } catch (err) {
      console.error("Prisma feature review failed:", err.message);
    }
  }

  // Fallback
  const review = db.fallbackReviews.find(r => r.id === id);
  if (review) {
    review.featured = !review.featured;
    return res.json(review);
  }
  res.status(404).json({ error: "Review not found" });
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  if (db.prisma) {
    try {
      await db.prisma.review.delete({
        where: { id }
      });
      return res.json({ success: true });
    } catch (err) {
      console.error("Prisma delete review failed:", err.message);
    }
  }

  // Fallback
  db.fallbackReviews = db.fallbackReviews.filter(r => r.id !== id);
  res.json({ success: true });
};
