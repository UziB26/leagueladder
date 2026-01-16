import { Skeleton, SkeletonAvatar, SkeletonText } from "./skeleton"

export function PlayerProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <SkeletonAvatar size={120} className="flex-shrink-0" />
          
          {/* Profile Info */}
          <div className="flex-1 w-full text-center md:text-left space-y-4">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-8 w-48 mx-auto md:mx-0" />
              <Skeleton variant="text" className="h-4 w-32 mx-auto md:mx-0" />
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton variant="text" className="h-6 w-12 mx-auto" />
                  <Skeleton variant="text" className="h-4 w-16 mx-auto mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rating History Section */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <Skeleton variant="text" className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <SkeletonAvatar size={40} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-4 w-32" />
                  <Skeleton variant="text" className="h-3 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton variant="text" className="h-5 w-16" />
                <Skeleton variant="text" className="h-5 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Matches Section */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <Skeleton variant="text" className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <SkeletonAvatar size={40} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-4 w-40" />
                  <Skeleton variant="text" className="h-3 w-28" />
                </div>
              </div>
              <Skeleton variant="text" className="h-5 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
