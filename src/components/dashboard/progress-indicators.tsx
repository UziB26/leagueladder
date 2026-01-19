"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Target, 
  CheckCircle2, 
  Circle, 
  Users, 
  Gamepad2, 
  TrendingUp,
  Award,
  Star
} from "lucide-react"

interface UserStats {
  leaguesJoined: number
  challengesCreated: number
  matchesPlayed: number
  matchesWon: number
  currentRank: number | null
  totalPlayers: number
}

interface NextStep {
  id: string
  title: string
  description: string
  action: {
    label: string
    href: string
  }
  completed: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

export function ProgressIndicators() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [nextSteps, setNextSteps] = useState<NextStep[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    if (session) {
      fetchUserStats()
    }
  }, [session])

  // Listen for events that should trigger stats refresh
  useEffect(() => {
    if (!session) return

    const handleStatsRefresh = () => {
      fetchUserStats()
    }

    // Listen for various events that affect stats
    window.addEventListener('league:joined', handleStatsRefresh)
    window.addEventListener('challenge:created', handleStatsRefresh)
    window.addEventListener('match:reported', handleStatsRefresh)
    window.addEventListener('match:confirmed', handleStatsRefresh)
    window.addEventListener('leaderboard:refresh', handleStatsRefresh)
    
    return () => {
      window.removeEventListener('league:joined', handleStatsRefresh)
      window.removeEventListener('challenge:created', handleStatsRefresh)
      window.removeEventListener('match:reported', handleStatsRefresh)
      window.removeEventListener('match:confirmed', handleStatsRefresh)
      window.removeEventListener('leaderboard:refresh', handleStatsRefresh)
    }
  }, [session])

  const fetchUserStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        calculateNextSteps(data.stats)
        calculateAchievements(data.stats)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateNextSteps = (stats: UserStats) => {
    const steps: NextStep[] = []

    // Step 1: Join a league
    if (stats.leaguesJoined === 0) {
      steps.push({
        id: 'join-league',
        title: 'Join Your First League',
        description: 'Get started by joining a Table Tennis or FIFA league',
        action: {
          label: 'Browse Leagues',
          href: '/leagues'
        },
        completed: false
      })
    } else {
      steps.push({
        id: 'join-league',
        title: 'Join Your First League',
        description: 'Get started by joining a Table Tennis or FIFA league',
        action: {
          label: 'Browse Leagues',
          href: '/leagues'
        },
        completed: true
      })
    }

    // Step 2: Create a challenge
    if (stats.challengesCreated === 0 && stats.leaguesJoined > 0) {
      steps.push({
        id: 'create-challenge',
        title: 'Challenge Another Player',
        description: 'Issue your first challenge to start competing',
        action: {
          label: 'Create Challenge',
          href: '/challenges'
        },
        completed: false
      })
    } else if (stats.challengesCreated > 0) {
      steps.push({
        id: 'create-challenge',
        title: 'Challenge Another Player',
        description: 'Issue your first challenge to start competing',
        action: {
          label: 'Create Challenge',
          href: '/challenges'
        },
        completed: true
      })
    }

    // Step 3: Play a match
    if (stats.matchesPlayed === 0 && stats.challengesCreated > 0) {
      steps.push({
        id: 'play-match',
        title: 'Play Your First Match',
        description: 'Report a match result to update your ranking',
        action: {
          label: 'Report Match',
          href: '/matches'
        },
        completed: false
      })
    } else if (stats.matchesPlayed > 0) {
      steps.push({
        id: 'play-match',
        title: 'Play Your First Match',
        description: 'Report a match result to update your ranking',
        action: {
          label: 'Report Match',
          href: '/matches'
        },
        completed: true
      })
    }

    setNextSteps(steps)
  }

  const calculateAchievements = (stats: UserStats) => {
    const achievements: Achievement[] = [
      {
        id: 'first-league',
        title: 'League Member',
        description: 'Join your first league',
        icon: 'trophy',
        unlocked: stats.leaguesJoined > 0,
        progress: stats.leaguesJoined,
        maxProgress: 1
      },
      {
        id: 'first-challenge',
        title: 'Challenger',
        description: 'Create your first challenge',
        icon: 'target',
        unlocked: stats.challengesCreated > 0,
        progress: stats.challengesCreated,
        maxProgress: 1
      },
      {
        id: 'first-match',
        title: 'First Match',
        description: 'Complete your first match',
        icon: 'gamepad',
        unlocked: stats.matchesPlayed > 0,
        progress: stats.matchesPlayed,
        maxProgress: 1
      },
      {
        id: 'five-matches',
        title: 'Getting Started',
        description: 'Play 5 matches',
        icon: 'star',
        unlocked: stats.matchesPlayed >= 5,
        progress: stats.matchesPlayed,
        maxProgress: 5
      },
      {
        id: 'ten-matches',
        title: 'Veteran',
        description: 'Play 10 matches',
        icon: 'award',
        unlocked: stats.matchesPlayed >= 10,
        progress: stats.matchesPlayed,
        maxProgress: 10
      },
      {
        id: 'first-win',
        title: 'Winner',
        description: 'Win your first match',
        icon: 'trophy',
        unlocked: stats.matchesWon > 0,
        progress: stats.matchesWon,
        maxProgress: 1
      }
    ]

    setAchievements(achievements)
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
          <div className="h-4 bg-gray-800 rounded w-2/3"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const completionPercentage = nextSteps.length > 0
    ? (nextSteps.filter(s => s.completed).length / nextSteps.length) * 100
    : 0

  const unlockedAchievements = achievements.filter(a => a.unlocked).length
  const totalAchievements = achievements.length

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Your Progress
          </h3>
          <span className="text-2xl font-bold text-blue-500">
            {Math.round(completionPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{stats.leaguesJoined}</div>
            <div className="text-sm text-gray-400">Leagues</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.challengesCreated}</div>
            <div className="text-sm text-gray-400">Challenges</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.matchesPlayed}</div>
            <div className="text-sm text-gray-400">Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.matchesWon}</div>
            <div className="text-sm text-gray-400">Wins</div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Next Steps
          </h3>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  step.completed
                    ? 'bg-green-900/20 border-green-700/50'
                    : 'bg-gray-800/50 border-gray-700'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-white mb-1">
                    {index + 1}. {step.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">{step.description}</p>
                  {!step.completed && (
                    <Button
                      size="sm"
                      className="min-h-[44px] md:min-h-0"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (step.action.href) {
                          // If already on the target page, force navigation
                          if (pathname === step.action.href) {
                            window.location.href = step.action.href
                          } else {
                            router.push(step.action.href)
                          }
                        }
                      }}
                    >
                      {step.action.label}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements
          </h3>
          <span className="text-sm text-gray-400">
            {unlockedAchievements} / {totalAchievements}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = getIconComponent(achievement.icon)
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-yellow-900/20 border-yellow-700/50'
                    : 'bg-gray-800/30 border-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-gray-700 text-gray-500'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {achievement.title}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          achievement.unlocked
                            ? 'bg-yellow-500'
                            : 'bg-gray-700'
                        }`}
                        style={{
                          width: `${Math.min(
                            (achievement.progress / achievement.maxProgress) * 100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.progress} / {achievement.maxProgress}
                    </p>
                  </div>
                )}
                {!achievement.unlocked && achievement.id === 'first-league' && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      className="w-full min-h-[44px] md:min-h-0 text-xs"
                      onClick={() => {
                        router.push('/dashboard')
                      }}
                    >
                      Join League
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'trophy':
      return Trophy
    case 'target':
      return Target
    case 'gamepad':
      return Gamepad2
    case 'star':
      return Star
    case 'award':
      return Award
    default:
      return Award
  }
}
