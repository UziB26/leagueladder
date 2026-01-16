# Elo Rating Calculator Documentation

## Overview

The League Ladder application uses an **Elo rating system** to rank players competitively. The Elo system is a method for calculating the relative skill levels of players in zero-sum games (where one player's gain is another's loss). This implementation includes enhancements like **margin of victory** multipliers to better reflect match outcomes.

## Table of Contents

1. [What is Elo Rating?](#what-is-elo-rating)
2. [Basic Elo Formula](#basic-elo-formula)
3. [Implementation Details](#implementation-details)
4. [Configuration](#configuration)
5. [Key Components](#key-components)
6. [Examples](#examples)
7. [Edge Cases](#edge-cases)

---

## What is Elo Rating?

Elo rating is a numerical system that represents a player's skill level. Key characteristics:

- **Starting Rating**: All new players start at **1000 points**
- **Zero-Sum**: When one player gains rating points, their opponent loses an equal amount
- **Dynamic**: Ratings adjust after every match based on:
  - The opponent's rating (beating a higher-rated player = more points)
  - The match outcome (win/loss/draw)
  - The margin of victory (larger wins = more points)

---

## Basic Elo Formula

### Expected Score Calculation

The system first calculates the **expected score** (probability of winning) for each player:

```
Expected Score (Player A) = 1 / (1 + 10^((Rating B - Rating A) / 400))
Expected Score (Player B) = 1 - Expected Score (Player A)
```

**Key Points:**
- If both players have equal ratings (1000 vs 1000), expected score = **0.5** (50% chance each)
- A 200-point rating difference means the higher-rated player has ~75% expected score
- A 400-point difference means ~91% expected score

### Rating Update Formula

After a match, ratings are updated using:

```
New Rating = Old Rating + K × (Actual Score - Expected Score)
```

Where:
- **K** = K-factor (default: **32** in this system)
- **Actual Score** = 1 for win, 0.5 for draw, 0 for loss
- **Expected Score** = Calculated probability from ratings

**Example:**
- Player A (1200) vs Player B (1000)
- Expected Score A = 0.76, Expected Score B = 0.24
- If A wins (Actual = 1.0):
  - Change A = 32 × (1.0 - 0.76) = **+8 points**
  - Change B = 32 × (0.0 - 0.24) = **-8 points**
  - New Rating A = 1208, New Rating B = 992

---

## Implementation Details

### 1. Expected Score (`expectedScore`)

Calculates the probability that Player A will win based on current ratings.

```typescript
expectedScore(ratingA: number, ratingB: number): number
```

**Formula:**
```
E_A = 1 / (1 + 10^((R_B - R_A) / 400))
```

**Examples:**
- Equal ratings (1000 vs 1000): `E_A = 0.5` (50% chance)
- 200-point advantage (1200 vs 1000): `E_A ≈ 0.76` (76% chance)
- 400-point advantage (1400 vs 1000): `E_A ≈ 0.91` (91% chance)

### 2. Score Value Calculation (`calculateScoreValue`)

Converts actual match scores into a value between 0 and 1 for rating calculation.

```typescript
calculateScoreValue(player1Score: number, player2Score: number): number
```

**Logic:**
- **Draw** (equal scores): Returns `0.5`
- **Close matches** (margin < 10% of total): Returns `1.0` for winner, `0.0` for loser
- **Large margins** (margin ≥ 10% of total): Uses score ratio to reward larger victories

**Examples:**
- Close win: 11-10 → Returns `1.0` (standard win)
- Large win: 21-5 → Returns `21/26 ≈ 0.81` (rewarded for margin)
- Draw: 10-10 → Returns `0.5`

### 3. Margin of Victory Multiplier (`marginOfVictoryMultiplier`)

Adjusts the K-factor based on how decisive the victory was. This rewards players for larger wins.

```typescript
marginOfVictoryMultiplier(scoreDiff: number, winnerRating: number, loserRating: number): number
```

**Formula:**
```
Multiplier = 1 + ln(1 + scoreDiff) / ln(1 + expectedDiff + 1)
Capped at 2.0 maximum
```

**Key Points:**
- Multiplier ranges from **1.0 to 2.0**
- Larger score differences = larger multipliers
- Uses logarithmic function to prevent excessive multipliers
- Only applies when `useMarginOfVictory = true`

**Examples:**
- Close win (11-10, diff=1): Multiplier ≈ **1.0-1.2**
- Moderate win (21-15, diff=6): Multiplier ≈ **1.3-1.5**
- Large win (21-5, diff=16): Multiplier ≈ **1.6-2.0** (capped)

### 4. Rating Update (`calculateNewRatings`)

Calculates new ratings after a match.

```typescript
calculateNewRatings(
  ratingA: number,
  ratingB: number,
  scoreA: number,
  marginOfVictoryMultiplier: number = 1.0
)
```

**Formula:**
```
Adjusted K = K × MarginOfVictoryMultiplier
Change A = Round(Adjusted K × (Actual Score A - Expected Score A))
Change B = Round(Adjusted K × (Actual Score B - Expected Score B))
New Rating A = Rating A + Change A
New Rating B = Rating B + Change B
```

**Properties:**
- **Zero-Sum**: `Change A + Change B = 0` (for equal ratings)
- **Rounded**: Changes are rounded to integers
- **Symmetric**: If A wins, A gains what B loses

### 5. Complete Match Calculation (`calculateForMatch`)

The main method that combines all components to calculate ratings for a complete match.

```typescript
calculateForMatch(
  player1Rating: number,
  player2Rating: number,
  player1Score: number,
  player2Score: number
)
```

**Process:**
1. Calculate score value from actual scores
2. Calculate margin of victory multiplier
3. Calculate expected scores from ratings
4. Apply margin multiplier to K-factor
5. Calculate rating changes
6. Return new ratings and changes

---

## Configuration

### K-Factor

The **K-factor** determines how much ratings can change per match.

- **Default**: `32` (standard competitive setting)
- **Higher K** = More volatile ratings (faster changes)
- **Lower K** = More stable ratings (slower changes)

**Common K-Factor Values:**
- `16`: Conservative (used for established players)
- `32`: Standard (default in this system)
- `64`: Aggressive (used for new players or rapid changes)

### Margin of Victory

- **Enabled by default**: `true`
- **When enabled**: Larger victories result in bigger rating changes
- **When disabled**: All wins result in the same rating change (regardless of score)

---

## Key Components

### Class: `EloCalculator`

```typescript
class EloCalculator {
  constructor(kFactor: number = 32, useMarginOfVictory: boolean = true)
  
  expectedScore(ratingA: number, ratingB: number): number
  marginOfVictoryMultiplier(scoreDiff: number, winnerRating: number, loserRating: number): number
  calculateScoreValue(player1Score: number, player2Score: number): number
  calculateNewRatings(ratingA: number, ratingB: number, scoreA: number, marginOfVictoryMultiplier: number): RatingResult
  calculateForMatch(player1Rating: number, player2Rating: number, player1Score: number, player2Score: number): RatingResult
}
```

### Return Type: `RatingResult`

```typescript
interface RatingResult {
  newRatingA: number    // Player A's new rating
  newRatingB: number    // Player B's new rating
  changeA: number       // Rating change for Player A (can be negative)
  changeB: number       // Rating change for Player B (can be negative)
}
```

### Instance: `elo`

A pre-configured instance used throughout the application:

```typescript
export const elo = new EloCalculator(32, true)
```

---

## Examples

### Example 1: Equal Ratings, Close Win

**Scenario:**
- Player A: 1000 rating
- Player B: 1000 rating
- Score: A wins 11-10

**Calculation:**
1. Expected Score A = 0.5 (50% chance)
2. Score Value = 1.0 (close win, standard)
3. Margin Multiplier = ~1.1 (small margin)
4. Adjusted K = 32 × 1.1 = 35.2
5. Change A = Round(35.2 × (1.0 - 0.5)) = **+18 points**
6. Change B = Round(35.2 × (0.0 - 0.5)) = **-18 points**

**Result:**
- New Rating A: **1018**
- New Rating B: **982**

### Example 2: Upset Victory (Lower-Rated Player Wins)

**Scenario:**
- Player A: 1000 rating (underdog)
- Player B: 1200 rating (favorite)
- Score: A wins 21-15

**Calculation:**
1. Expected Score A = 0.24 (24% chance - underdog!)
2. Score Value = 21/36 ≈ 0.58 (moderate margin)
3. Margin Multiplier = ~1.4 (decent margin)
4. Adjusted K = 32 × 1.4 = 44.8
5. Change A = Round(44.8 × (0.58 - 0.24)) = **+15 points**
6. Change B = Round(44.8 × (0.42 - 0.76)) = **-15 points**

**Result:**
- New Rating A: **1015** (big gain for upset!)
- New Rating B: **1185** (significant loss)

### Example 3: Expected Victory (Higher-Rated Player Wins)

**Scenario:**
- Player A: 1200 rating (favorite)
- Player B: 1000 rating (underdog)
- Score: A wins 21-19

**Calculation:**
1. Expected Score A = 0.76 (76% chance - expected)
2. Score Value = 1.0 (close win)
3. Margin Multiplier = ~1.1 (small margin)
4. Adjusted K = 32 × 1.1 = 35.2
5. Change A = Round(35.2 × (1.0 - 0.76)) = **+8 points**
6. Change B = Round(35.2 × (0.0 - 0.24)) = **-8 points**

**Result:**
- New Rating A: **1208** (small gain - expected win)
- New Rating B: **992** (small loss)

### Example 4: Draw

**Scenario:**
- Player A: 1000 rating
- Player B: 1000 rating
- Score: 10-10 (draw)

**Calculation:**
1. Expected Score A = 0.5
2. Score Value = 0.5 (draw)
3. Margin Multiplier = 1.0 (no margin)
4. Adjusted K = 32 × 1.0 = 32
5. Change A = Round(32 × (0.5 - 0.5)) = **0 points**
6. Change B = Round(32 × (0.5 - 0.5)) = **0 points**

**Result:**
- New Rating A: **1000** (no change)
- New Rating B: **1000** (no change)

### Example 5: Large Victory with Margin Bonus

**Scenario:**
- Player A: 1000 rating
- Player B: 1000 rating
- Score: A wins 21-5 (decisive victory)

**Calculation:**
1. Expected Score A = 0.5
2. Score Value = 21/26 ≈ 0.81 (large margin)
3. Margin Multiplier = ~1.8 (large margin bonus)
4. Adjusted K = 32 × 1.8 = 57.6
5. Change A = Round(57.6 × (0.81 - 0.5)) = **+18 points**
6. Change B = Round(57.6 × (0.19 - 0.5)) = **-18 points**

**Result:**
- New Rating A: **1018** (bonus for large win)
- New Rating B: **982**

---

## Edge Cases

### Both Scores Are Zero

If both players have a score of 0, the system treats it as a draw:
- Score Value = `0.5`
- No rating changes occur

### Very Large Score Differences

The margin of victory multiplier is **capped at 2.0** to prevent excessive rating swings from extremely lopsided matches.

### Rating Convergence

When players of equal skill play many matches:
- Over time, ratings converge toward their true skill level
- If players are truly equal, ratings stay close to starting value (1000)
- If one player is consistently better, their rating will rise while the other's falls

### Upset Victories

When a lower-rated player beats a higher-rated player:
- The underdog gains **more points** than usual
- The favorite loses **more points** than usual
- This reflects the unexpected nature of the result

---

## Mathematical Properties

### Zero-Sum Property

For any match between players with equal ratings:
```
Change A + Change B = 0
```

This ensures the total rating pool remains constant (assuming equal starting ratings).

### Expected Value

Over many matches, a player's rating should converge to their true skill level:
- If consistently outperforming their rating → rating increases
- If consistently underperforming → rating decreases

### Transitivity

If Player A > Player B and Player B > Player C, then:
- Player A should have a higher rating than Player C
- The system naturally enforces this through match results

---

## Usage in League Ladder

### Per-League Ratings

Each player maintains **separate ratings** for each league:
- Table Tennis league rating
- FIFA league rating

Ratings are independent - performing well in one league doesn't affect the other.

### Rating Updates

Ratings are updated:
- **Only** when matches are **completed** (not pending confirmation)
- After **opponent confirmation** (if opponent confirmation is enabled)
- Immediately when matches are reported (if auto-confirmation is enabled)

### Rating History

All rating changes are tracked in the `rating_updates` table:
- Old rating
- New rating
- Change amount
- Match ID
- Timestamp

This allows for:
- Rating history visualization
- Match voiding (reverting ratings)
- Statistical analysis

---

## Testing

The Elo calculator is thoroughly tested with:
- **48 test cases** covering all methods
- Edge case handling
- Integration tests
- Rating stability tests

See `src/lib/elo.test.ts` for complete test coverage.

---

## References

- [Elo Rating System (Wikipedia)](https://en.wikipedia.org/wiki/Elo_rating_system)
- [FIDE Rating Regulations](https://www.fide.com/fide/handbook.html?id=172&view=article) (Chess rating system)
- [Glicko Rating System](https://en.wikipedia.org/wiki/Glicko_rating_system) (Alternative rating system)

---

## Summary

The League Ladder Elo system provides:
- ✅ **Fair rankings** based on match results
- ✅ **Dynamic adjustments** that reflect player skill
- ✅ **Margin of victory** rewards for decisive wins
- ✅ **Upset protection** (lower-rated players gain more for wins)
- ✅ **Transparent calculations** (all formulas documented)
- ✅ **Per-league isolation** (separate ratings for each game type)

This ensures competitive, accurate, and engaging rankings for all players!
