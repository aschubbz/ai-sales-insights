/**
 * Computes analytics from an array of sales records.
 * Each record is assumed to have:
 *   { category: string, amount: number, state?: string (optional) }
 *
 * @param {Array} sales - array of objects like {category, amount}
 * @returns {Object} {
 *   totalSales,
 *   averageSales,
 *   bestCategory,
 *   salesPerCategory,
 *   bestState,
 *   salesPerState,
 * }
 */
function computeAnalytics(sales) {
  if (!Array.isArray(sales) || sales.length === 0) {
    return {
      totalSales: 0,
      averageSales: 0,
      bestCategory: null,
      salesPerCategory: {},
      bestState: null,
      salesPerState: {}
    };
  }

  let totalSales = 0;
  const salesPerCategory = {};
  const salesPerState = {};

  // Accumulate amounts by category and state
  for (const record of sales) {
    const { category, amount, state } = record;
    if (!salesPerCategory[category]) {
      salesPerCategory[category] = 0;
    }
    salesPerCategory[category] += amount;

    if (state) {
      if (!salesPerState[state]) {
        salesPerState[state] = 0;
      }
      salesPerState[state] += amount;
    }

    totalSales += amount;
  }

  // Find bestCategory by max total
  let bestCategory = null;
  let maxCatSales = 0;
  for (const [cat, catSales] of Object.entries(salesPerCategory)) {
    if (catSales > maxCatSales) {
      maxCatSales = catSales;
      bestCategory = cat;
    }
  }

  // Find bestState by max total (or null if no states at all)
  let bestState = null;
  let maxStateSales = 0;
  for (const [st, stSales] of Object.entries(salesPerState)) {
    if (stSales > maxStateSales) {
      maxStateSales = stSales;
      bestState = st;
    }
  }

  // Calculate average
  const averageSales = totalSales / sales.length;

  return {
    totalSales,
    averageSales,
    bestCategory,
    salesPerCategory,
    bestState,
    salesPerState
  };
}

module.exports = {
  computeAnalytics
};
