import { sanitizeUUID, sanitizeInteger, sanitizeString } from '../sanitize'

/**
 * Validate match data before saving to database
 */
export interface MatchData {
  player1Id: string
  player2Id: string
  leagueId: string
  player1Score: number
  player2Score: number
  challengeId?: string
  status?: string
}

export interface ValidationResult<T = MatchData> {
  valid: boolean
  errors: string[]
  sanitized?: T
}

/**
 * Validate match data before database operations
 */
export function validateMatchData(data: Partial<MatchData>): ValidationResult<MatchData> {
  const errors: string[] = []

  // Validate required fields
  if (!data.player1Id) {
    errors.push('Player 1 ID is required')
  } else {
    const sanitized = sanitizeUUID(data.player1Id)
    if (!sanitized) {
      errors.push('Invalid Player 1 ID format')
    }
  }

  if (!data.player2Id) {
    errors.push('Player 2 ID is required')
  } else {
    const sanitized = sanitizeUUID(data.player2Id)
    if (!sanitized) {
      errors.push('Invalid Player 2 ID format')
    }
  }

  if (!data.leagueId) {
    errors.push('League ID is required')
  } else {
    const sanitized = sanitizeUUID(data.leagueId)
    if (!sanitized) {
      errors.push('Invalid League ID format')
    }
  }

  // Validate scores
  if (data.player1Score === undefined || data.player1Score === null) {
    errors.push('Player 1 score is required')
  } else {
    const sanitized = sanitizeInteger(data.player1Score, 0, 1000)
    if (sanitized === null) {
      errors.push('Player 1 score must be a valid integer between 0 and 1000')
    }
  }

  if (data.player2Score === undefined || data.player2Score === null) {
    errors.push('Player 2 score is required')
  } else {
    const sanitized = sanitizeInteger(data.player2Score, 0, 1000)
    if (sanitized === null) {
      errors.push('Player 2 score must be a valid integer between 0 and 1000')
    }
  }

  // Validate players are different
  if (data.player1Id && data.player2Id && data.player1Id === data.player2Id) {
    errors.push('Players cannot play against themselves')
  }

  // Validate at least one score is greater than 0
  if (
    data.player1Score !== undefined &&
    data.player2Score !== undefined &&
    data.player1Score === 0 &&
    data.player2Score === 0
  ) {
    errors.push('At least one player must have a score greater than 0')
  }

  // Validate challenge ID if provided
  if (data.challengeId) {
    const sanitized = sanitizeUUID(data.challengeId)
    if (!sanitized) {
      errors.push('Invalid Challenge ID format')
    }
  }

  // Validate status if provided
  if (data.status && !['pending', 'pending_confirmation', 'completed', 'voided', 'disputed'].includes(data.status)) {
    errors.push('Invalid match status')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  // Return sanitized data
  return {
    valid: true,
    errors: [],
    sanitized: {
      player1Id: sanitizeUUID(data.player1Id!)!,
      player2Id: sanitizeUUID(data.player2Id!)!,
      leagueId: sanitizeString(data.leagueId!)!,
      player1Score: sanitizeInteger(data.player1Score!, 0, 1000)!,
      player2Score: sanitizeInteger(data.player2Score!, 0, 1000)!,
      challengeId: data.challengeId ? (sanitizeUUID(data.challengeId) ?? undefined) : undefined,
      status: data.status || 'pending_confirmation',
    },
  }
}

/**
 * Validate challenge data before saving
 */
export interface ChallengeData {
  challengerId: string
  challengeeId: string
  leagueId: string
}

export function validateChallengeData(
  data: Partial<ChallengeData>
): ValidationResult<ChallengeData> {
  const errors: string[] = []

  if (!data.challengerId) {
    errors.push('Challenger ID is required')
  } else {
    const sanitized = sanitizeUUID(data.challengerId)
    if (!sanitized) {
      errors.push('Invalid Challenger ID format')
    }
  }

  if (!data.challengeeId) {
    errors.push('Challengee ID is required')
  } else {
    const sanitized = sanitizeUUID(data.challengeeId)
    if (!sanitized) {
      errors.push('Invalid Challengee ID format')
    }
  }

  if (!data.leagueId) {
    errors.push('League ID is required')
  } else {
    // League IDs are strings like 'tt_league', 'fifa_league', not UUIDs
    const sanitized = sanitizeString(data.leagueId)
    if (!sanitized || sanitized.length === 0) {
      errors.push('Invalid League ID format')
    }
  }

  // Validate players are different
  if (
    data.challengerId &&
    data.challengeeId &&
    data.challengerId === data.challengeeId
  ) {
    errors.push('Cannot challenge yourself')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      challengerId: sanitizeUUID(data.challengerId!)!,
      challengeeId: sanitizeUUID(data.challengeeId!)!,
      leagueId: sanitizeString(data.leagueId!)!,
    },
  }
}

/**
 * Validate that players exist and are in the league
 */
export function validatePlayerLeagueMembership(
  playerId: string,
  leagueId: string,
  db: any
): { valid: boolean; error?: string } {
  // Check player exists
  const player = db.prepare('SELECT id FROM players WHERE id = ?').get(playerId)
  if (!player) {
    return { valid: false, error: 'Player not found' }
  }

  // Check league exists
  const league = db.prepare('SELECT id FROM leagues WHERE id = ?').get(leagueId)
  if (!league) {
    return { valid: false, error: 'League not found' }
  }

  // Check player is in league
  const membership = db
    .prepare(
      'SELECT id FROM league_memberships WHERE player_id = ? AND league_id = ? AND is_active = 1'
    )
    .get(playerId, leagueId)
  if (!membership) {
    return {
      valid: false,
      error: 'Player is not a member of this league',
    }
  }

  return { valid: true }
}
