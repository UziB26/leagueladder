import { EloCalculator } from './elo'

describe('EloCalculator', () => {
  let calculator: EloCalculator

  beforeEach(() => {
    calculator = new EloCalculator(32, true)
  })

  describe('expectedScore', () => {
    it('should return 0.5 when ratings are equal', () => {
      const expected = calculator.expectedScore(1000, 1000)
      expect(expected).toBeCloseTo(0.5, 5)
    })

    it('should return > 0.5 when player A has higher rating', () => {
      const expected = calculator.expectedScore(1200, 1000)
      expect(expected).toBeGreaterThan(0.5)
      expect(expected).toBeLessThan(1)
    })

    it('should return < 0.5 when player A has lower rating', () => {
      const expected = calculator.expectedScore(1000, 1200)
      expect(expected).toBeLessThan(0.5)
      expect(expected).toBeGreaterThan(0)
    })

    it('should handle large rating differences', () => {
      const expected = calculator.expectedScore(2000, 1000)
      expect(expected).toBeGreaterThan(0.9)
    })

    it('should handle negative rating differences', () => {
      const expected = calculator.expectedScore(800, 1000)
      expect(expected).toBeLessThan(0.1)
    })
  })

  describe('marginOfVictoryMultiplier', () => {
    it('should return 1.0 when margin of victory is disabled', () => {
      const calc = new EloCalculator(32, false)
      const multiplier = calc.marginOfVictoryMultiplier(10, 1000, 1000)
      expect(multiplier).toBe(1.0)
    })

    it('should return 1.0 when score difference is 0', () => {
      const multiplier = calculator.marginOfVictoryMultiplier(0, 1000, 1000)
      expect(multiplier).toBe(1.0)
    })

    it('should return multiplier > 1.0 for larger score differences', () => {
      const multiplier = calculator.marginOfVictoryMultiplier(10, 1000, 1000)
      expect(multiplier).toBeGreaterThan(1.0)
      expect(multiplier).toBeLessThanOrEqual(2.0)
    })

    it('should cap multiplier at 2.0', () => {
      const multiplier = calculator.marginOfVictoryMultiplier(1000, 1000, 1000)
      expect(multiplier).toBeLessThanOrEqual(2.0)
    })

    it('should return higher multiplier for larger score differences', () => {
      const smallMultiplier = calculator.marginOfVictoryMultiplier(1, 1000, 1000)
      const largeMultiplier = calculator.marginOfVictoryMultiplier(20, 1000, 1000)
      expect(largeMultiplier).toBeGreaterThan(smallMultiplier)
    })
  })

  describe('calculateScoreValue', () => {
    it('should return 0.5 for draws', () => {
      const score = calculator.calculateScoreValue(5, 5)
      expect(score).toBe(0.5)
    })

    it('should return 0.5 when both scores are 0', () => {
      const score = calculator.calculateScoreValue(0, 0)
      expect(score).toBe(0.5)
    })

    it('should return 1.0 when player1 wins in close match', () => {
      const score = calculator.calculateScoreValue(11, 10)
      expect(score).toBe(1.0)
    })

    it('should return 0.0 when player2 wins in close match', () => {
      const score = calculator.calculateScoreValue(10, 11)
      expect(score).toBe(0.0)
    })

    it('should return score ratio for larger margins', () => {
      const score = calculator.calculateScoreValue(21, 5)
      expect(score).toBeGreaterThan(0.5)
      expect(score).toBeLessThan(1.0)
    })

    it('should handle very large score differences', () => {
      const score = calculator.calculateScoreValue(100, 0)
      expect(score).toBeGreaterThan(0.9)
    })
  })

  describe('calculateNewRatings', () => {
    it('should increase winner rating when higher rated player wins', () => {
      const result = calculator.calculateNewRatings(1200, 1000, 1.0, 1.0)
      expect(result.newRatingA).toBeGreaterThan(1200)
      expect(result.newRatingB).toBeLessThan(1000)
    })

    it('should increase winner rating when lower rated player wins (upset)', () => {
      const result = calculator.calculateNewRatings(1000, 1200, 1.0, 1.0)
      expect(result.newRatingA).toBeGreaterThan(1000)
      expect(result.newRatingB).toBeLessThan(1200)
      // Upset should result in larger rating change
      expect(result.changeA).toBeGreaterThan(16) // More than half of K-factor
    })

    it('should handle draws correctly', () => {
      const result = calculator.calculateNewRatings(1000, 1000, 0.5, 1.0)
      expect(result.newRatingA).toBe(1000)
      expect(result.newRatingB).toBe(1000)
      expect(result.changeA).toBe(0)
      expect(result.changeB).toBe(0)
    })

    it('should apply margin of victory multiplier', () => {
      const withoutMov = calculator.calculateNewRatings(1000, 1000, 1.0, 1.0)
      const withMov = calculator.calculateNewRatings(1000, 1000, 1.0, 2.0)
      
      expect(withMov.changeA).toBeGreaterThan(withoutMov.changeA)
      expect(Math.abs(withMov.changeA)).toBeCloseTo(Math.abs(withoutMov.changeA) * 2, 0)
    })

    it('should maintain zero-sum property (changeA + changeB = 0 for equal ratings)', () => {
      const result = calculator.calculateNewRatings(1000, 1000, 1.0, 1.0)
      expect(result.changeA + result.changeB).toBe(0)
    })

    it('should round rating changes', () => {
      const result = calculator.calculateNewRatings(1000, 1000, 1.0, 1.0)
      expect(Number.isInteger(result.changeA)).toBe(true)
      expect(Number.isInteger(result.changeB)).toBe(true)
    })
  })

  describe('calculateForMatch', () => {
    it('should calculate ratings for a match with equal ratings', () => {
      const result = calculator.calculateForMatch(1000, 1000, 21, 19)
      
      expect(result.newRatingA).toBeGreaterThan(1000)
      expect(result.newRatingB).toBeLessThan(1000)
      expect(result.changeA).toBeGreaterThan(0)
      expect(result.changeB).toBeLessThan(0)
    })

    it('should handle draws correctly', () => {
      const result = calculator.calculateForMatch(1000, 1000, 10, 10)
      
      // For equal ratings and draw, ratings should remain the same
      expect(result.newRatingA).toBe(1000)
      expect(result.newRatingB).toBe(1000)
    })

    it('should give larger rating changes for larger victories', () => {
      const closeWin = calculator.calculateForMatch(1000, 1000, 11, 10)
      const largeWin = calculator.calculateForMatch(1000, 1000, 21, 5)
      
      expect(largeWin.changeA).toBeGreaterThan(closeWin.changeA)
    })

    it('should handle upset victories (lower rated player wins)', () => {
      const result = calculator.calculateForMatch(1000, 1200, 21, 19)
      
      expect(result.newRatingA).toBeGreaterThan(1000)
      expect(result.newRatingB).toBeLessThan(1200)
      // Upset should result in larger rating change for winner
      expect(result.changeA).toBeGreaterThan(16)
    })

    it('should handle expected victories (higher rated player wins)', () => {
      const result = calculator.calculateForMatch(1200, 1000, 21, 19)
      
      expect(result.newRatingA).toBeGreaterThan(1200)
      expect(result.newRatingB).toBeLessThan(1000)
      // Expected win should result in smaller rating change
      expect(result.changeA).toBeLessThan(16)
    })

    it('should work with different K-factors', () => {
      const calc32 = new EloCalculator(32, true)
      const calc16 = new EloCalculator(16, true)
      
      const result32 = calc32.calculateForMatch(1000, 1000, 21, 19)
      const result16 = calc16.calculateForMatch(1000, 1000, 21, 19)
      
      expect(Math.abs(result32.changeA)).toBeGreaterThan(Math.abs(result16.changeA))
    })

    it('should handle edge case scores', () => {
      const result = calculator.calculateForMatch(1000, 1000, 1, 0)
      expect(result.newRatingA).toBeGreaterThan(1000)
      expect(result.newRatingB).toBeLessThan(1000)
    })

    it('should handle very large scores', () => {
      const result = calculator.calculateForMatch(1000, 1000, 100, 50)
      expect(result.newRatingA).toBeGreaterThan(1000)
      expect(result.newRatingB).toBeLessThan(1000)
    })
  })

  describe('Integration tests', () => {
    it('should maintain rating stability over multiple matches', () => {
      let ratingA = 1000
      let ratingB = 1000
      
      // Play 10 matches where A wins 5 and B wins 5
      for (let i = 0; i < 5; i++) {
        const result1 = calculator.calculateForMatch(ratingA, ratingB, 21, 19)
        ratingA = result1.newRatingA
        ratingB = result1.newRatingB
        
        const result2 = calculator.calculateForMatch(ratingB, ratingA, 21, 19)
        ratingB = result2.newRatingA
        ratingA = result2.newRatingB
      }
      
      // Ratings should be close to original (within reasonable range)
      expect(ratingA).toBeGreaterThan(950)
      expect(ratingA).toBeLessThan(1050)
      expect(ratingB).toBeGreaterThan(950)
      expect(ratingB).toBeLessThan(1050)
    })

    it('should converge ratings when one player consistently wins', () => {
      let ratingA = 1000
      let ratingB = 1000
      
      // Player A wins 10 matches in a row
      for (let i = 0; i < 10; i++) {
        const result = calculator.calculateForMatch(ratingA, ratingB, 21, 15)
        ratingA = result.newRatingA
        ratingB = result.newRatingB
      }
      
      expect(ratingA).toBeGreaterThan(ratingB)
      expect(ratingA - ratingB).toBeGreaterThan(50) // Significant difference
    })
  })
})
