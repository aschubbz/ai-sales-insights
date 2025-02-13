const { computeAnalytics } = require('../src/analytics');

describe('computeAnalytics (unit tests)', () => {
  test('handles empty array', () => {
    const result = computeAnalytics([]);
    expect(result).toEqual({
      totalSales: 0,
      averageSales: 0,
      bestCategory: null,
      salesPerCategory: {}
    });
  });

  test('computes correct metrics for sample data', () => {
    const salesData = [
      { category: 'Gadgets', amount: 120.5 },
      { category: 'Widgets', amount: 45.0 },
      { category: 'Gadgets', amount: 200.0 }
    ];

    const result = computeAnalytics(salesData);
    expect(result.totalSales).toBeCloseTo(365.5);
    expect(result.averageSales).toBeCloseTo(121.8333);
    expect(result.bestCategory).toBe('Gadgets');
    expect(result.salesPerCategory).toEqual({
      Gadgets: 320.5,
      Widgets: 45
    });
  });

  test('computes bestCategory correctly if multiple categories tie', () => {
    const salesData = [
      { category: 'CatA', amount: 100 },
      { category: 'CatB', amount: 100 }
    ];
    const result = computeAnalytics(salesData);
    // By default, if there's a tie, we pick the first with the max.
    expect(result.bestCategory).toBe('CatA');
  });
});
