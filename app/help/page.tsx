"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function HelpPage() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <img 
              src="/APP LOGO.png" 
              alt="League Ladder Logo" 
              className="h-12 w-12 object-contain"
              loading="eager"
            />
            Help & Instructions
          </h1>
          <p className="text-gray-300 mt-2">Everything you need to know about League Ladder</p>
        </header>

        <div className="space-y-8">
          {/* How it Works */}
          <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">How it Works</h2>
            <ol className="list-decimal pl-5 space-y-3 text-gray-300">
              <li className="text-base">
                <strong className="text-white">Register and create your player profile</strong>
                <p className="text-sm text-gray-400 mt-1">Sign up with your email and create your gaming profile. You can customize your display name.</p>
              </li>
              <li className="text-base">
                <strong className="text-white">Join either FIFA or Table Tennis league (or both!)</strong>
                <p className="text-sm text-gray-400 mt-1">Choose the leagues you want to compete in. You can join multiple leagues.</p>
              </li>
              <li className="text-base">
                <strong className="text-white">Challenge other players to matches</strong>
                <p className="text-sm text-gray-400 mt-1">Send challenges to other players in your leagues. They can accept or decline your challenge.</p>
              </li>
              <li className="text-base">
                <strong className="text-white">Record match results to update Elo ratings</strong>
                <p className="text-sm text-gray-400 mt-1">After playing a match, report the score. Your opponent will confirm it, and Elo ratings will update automatically.</p>
              </li>
              <li className="text-base">
                <strong className="text-white">Climb the leaderboard and become #1</strong>
                <p className="text-sm text-gray-400 mt-1">Win matches to increase your Elo rating and climb the rankings. The top players are featured on the leaderboard.</p>
              </li>
            </ol>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">What is Elo rating?</h3>
                <p className="text-gray-300 text-sm">
                  Elo is a rating system that calculates your skill level based on match results. When you win, your rating goes up. When you lose, it goes down. The amount of change depends on your opponent's rating.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">How do I challenge someone?</h3>
                <p className="text-gray-300 text-sm">
                  Go to the Challenges page or use the Quick Challenge feature on the home page. Select a league and choose the player you want to challenge. They'll receive a notification and can accept or decline.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">What happens after I report a match?</h3>
                <p className="text-gray-300 text-sm">
                  Your opponent will be notified and can confirm the match result. Once confirmed, Elo ratings are automatically updated. If there's a dispute, you can contact an admin.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Can I change my username?</h3>
                <p className="text-gray-300 text-sm">
                  Yes! Go to your Profile page and click "Edit" next to your username. You can update it anytime, as long as the name isn't already taken.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">How do I join a league?</h3>
                <p className="text-gray-300 text-sm">
                  Visit the Dashboard or Leagues page and click "Join" on the league you want to join. You'll automatically get a starting Elo rating of 1000.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Can I see my match history?</h3>
                <p className="text-gray-300 text-sm">
                  Yes! Visit the Matches page to see all your recent matches, or check your player profile to see your complete match history and statistics.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">Quick Links</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/leaderboard">
                <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                  <div className="font-medium text-white">View Leaderboards</div>
                  <div className="text-sm text-gray-300">See rankings across all leagues</div>
                </div>
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard">
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                      <div className="font-medium text-white">Your Dashboard</div>
                      <div className="text-sm text-gray-300">Manage your leagues and profile</div>
                    </div>
                  </Link>
                  <Link href="/challenges">
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                      <div className="font-medium text-white">Challenges</div>
                      <div className="text-sm text-gray-300">Send and manage challenges</div>
                    </div>
                  </Link>
                  <Link href="/profile">
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                      <div className="font-medium text-white">Your Profile</div>
                      <div className="text-sm text-gray-300">View and edit your profile</div>
                    </div>
                  </Link>
                </>
              ) : (
                <Link href="/auth/login">
                  <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer">
                    <div className="font-medium text-white">Login</div>
                    <div className="text-sm text-gray-300">Sign in to get started</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
