function computeAnalytics(sales) {
    let totalSales = 0;
    const salesPerCategory = {};
  
    // Accumulate amounts by category
    for (const record of sales) {
      const { category, amount } = record;
      if (!salesPerCategory[category]) {
        salesPerCategory[category] = 0;
      }
      salesPerCategory[category] += amount;
      totalSales += amount;
    }
  
    // Find the best category (the one with the highest total)
    let bestCategory = null;
    let maxSales = 0;
    for (const [cat, catSales] of Object.entries(salesPerCategory)) {
      if (catSales > maxSales) {
        maxSales = catSales;
        bestCategory = cat;
      }
    }
  
    // Calculate average sales
    const averageSales = totalSales / sales.length;
  
    return {
      totalSales,
      averageSales,
      bestCategory,
      salesPerCategory
    };
  }
  
  module.exports = {
    computeAnalytics
  };
  