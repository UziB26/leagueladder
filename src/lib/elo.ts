export class EloCalculator {
    private kFactor: number
    
    constructor(kFactor: number = 32) {
      this.kFactor = kFactor
    }
    
    expectedScore(ratingA: number, ratingB: number): number {
      return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
    }
    
    calculateNewRatings(ratingA: number, ratingB: number, scoreA: number): {
      newRatingA: number
      newRatingB: number
      changeA: number
      changeB: number
    } {
      const expectedA = this.expectedScore(ratingA, ratingB)
      const expectedB = 1 - expectedA
      
      const changeA = Math.round(this.kFactor * (scoreA - expectedA))
      const changeB = Math.round(this.kFactor * ((1 - scoreA) - expectedB))
      
      return {
        newRatingA: ratingA + changeA,
        newRatingB: ratingB + changeB,
        changeA,
        changeB
      }
    }
    
    calculateForMatch(player1Rating: number, player2Rating: number, player1Score: number, player2Score: number) {
      let scoreA: number
      
      if (player1Score > player2Score) {
        scoreA = 1 // Player 1 wins
      } else if (player1Score < player2Score) {
        scoreA = 0 // Player 2 wins
      } else {
        scoreA = 0.5 // Draw
      }
      
      return this.calculateNewRatings(player1Rating, player2Rating, scoreA)
    }
  }
  
  export const elo = new EloCalculator(32)