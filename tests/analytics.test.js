const { computeAnalytics } = require('../src/analytics');

describe('computeAnalytics (unit tests)', () => {
  test('handles empty array', () => {
    const result = computeAnalytics([]);
    expect(result).toEqual({
      totalSales: 0,
      averageSales: 0,
      bestCategory: null,
      bestState: null,
      salesPerCategory: {},
      salesPerState: {}
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

  describe('computeAnalytics with state (unit tests)', () => {
    test('tracks sales by state correctly', () => {
      const salesData = [
        { category: 'Widgets', amount: 100, state: 'CA' },
        { category: 'Gadgets', amount: 50, state: 'NY' },
        { category: 'Widgets', amount: 150, state: 'NY' },
        { category: 'Widgets', amount: 200 } // no state
      ];
  
      // Totals:
      //  - totalSales = 100 + 50 + 150 + 200 = 500
      //  - averageSales = 500 / 4 = 125
      //  - bestCategory = 'Widgets' (450 total vs. 50 for Gadgets)
      //  - salesPerCategory = { Widgets: 450, Gadgets: 50 }
      //
      // State breakdown:
      //  - CA: 100
      //  - NY: 200 (50 + 150)
      //  - (no state): 200 (not aggregated in salesPerState, we skip it)
      //
      // bestState = 'NY' (200 > 100)
  
      const result = computeAnalytics(salesData);
  
      expect(result.totalSales).toBe(500);
      expect(result.averageSales).toBe(125);
      expect(result.bestCategory).toBe('Widgets');
      expect(result.salesPerCategory).toEqual({
        Widgets: 450,
        Gadgets: 50
      });
      expect(result.salesPerState).toEqual({
        CA: 100,
        NY: 200
      });
      expect(result.bestState).toBe('NY');
    });
  });
  
});
