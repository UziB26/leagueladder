export class EloCalculator {
    private kFactor: number
    private useMarginOfVictory: boolean
    
    constructor(kFactor: number = 32, useMarginOfVictory: boolean = true) {
      this.kFactor = kFactor
      this.useMarginOfVictory = useMarginOfVictory
    }
    
    expectedScore(ratingA: number, ratingB: number): number {
      return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
    }
    
    /**
     * Calculate margin of victory multiplier based on score difference.
     * This adjusts the K-factor to reward larger victories more.
     * Uses a logarithmic function to prevent excessive multipliers.
     * 
     * @param scoreDiff - The absolute difference in scores
     * @param winnerRating - The rating of the winning player
     * @param loserRating - The rating of the losing player
     * @returns Multiplier between 1.0 and ~2.0
     */
    marginOfVictoryMultiplier(scoreDiff: number, winnerRating: number, loserRating: number): number {
      if (!this.useMarginOfVictory || scoreDiff === 0) {
        return 1.0
      }
      
      // Expected score difference based on rating difference
      const ratingDiff = Math.abs(winnerRating - loserRating)
      const expectedDiff = Math.abs(winnerRating - loserRating) / 100 // Rough estimate
      
      // Calculate multiplier using logarithmic function
      // Larger score differences result in larger multipliers, but with diminishing returns
      // Formula: 1 + ln(1 + scoreDiff) / ln(1 + expectedDiff + 1)
      // This ensures multipliers are reasonable (typically 1.0 to 2.0)
      const multiplier = 1 + (Math.log(1 + scoreDiff) / Math.log(1 + Math.max(expectedDiff, 1) + 1))
      
      // Cap multiplier at 2.0 to prevent excessive rating changes
      return Math.min(multiplier, 2.0)
    }
    
    /**
     * Calculate actual score value based on match scores.
     * Returns 1.0 for win, 0.0 for loss, 0.5 for draw.
     * The margin of victory is handled separately via the multiplier.
     * 
     * @param player1Score - Score of player 1
     * @param player2Score - Score of player 2
     * @returns Score value: 1.0 if player1 wins, 0.0 if player2 wins, 0.5 for draw
     */
    calculateScoreValue(player1Score: number, player2Score: number): number {
      if (player1Score === player2Score) {
        return 0.5 // Draw
      }
      
      // Winner always gets 1.0, loser always gets 0.0
      // This ensures winners always gain rating and losers always lose rating
      return player1Score > player2Score ? 1.0 : 0.0
    }
    
    calculateNewRatings(
      ratingA: number, 
      ratingB: number, 
      scoreA: number,
      marginOfVictoryMultiplier: number = 1.0
    ): {
      newRatingA: number
      newRatingB: number
      changeA: number
      changeB: number
    } {
      const expectedA = this.expectedScore(ratingA, ratingB)
      const expectedB = 1 - expectedA
      
      // Apply margin of victory multiplier to K-factor
      const adjustedKFactor = this.kFactor * marginOfVictoryMultiplier
      
      const changeA = Math.round(adjustedKFactor * (scoreA - expectedA))
      const changeB = Math.round(adjustedKFactor * ((1 - scoreA) - expectedB))
      
      return {
        newRatingA: ratingA + changeA,
        newRatingB: ratingB + changeB,
        changeA,
        changeB
      }
    }
    
    calculateForMatch(
      player1Rating: number, 
      player2Rating: number, 
      player1Score: number, 
      player2Score: number
    ) {
      // Calculate score value based on actual scores
      const scoreA = this.calculateScoreValue(player1Score, player2Score)
      
      // Calculate margin of victory multiplier
      const scoreDiff = Math.abs(player1Score - player2Score)
      const winnerRating = player1Score > player2Score ? player1Rating : player2Rating
      const loserRating = player1Score > player2Score ? player2Rating : player1Rating
      const movMultiplier = this.marginOfVictoryMultiplier(scoreDiff, winnerRating, loserRating)
      
      return this.calculateNewRatings(player1Rating, player2Rating, scoreA, movMultiplier)
    }
  }
  
  export const elo = new EloCalculator(32, true)