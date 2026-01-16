import { Skeleton, SkeletonAvatar, SkeletonText } from "./skeleton"

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800 border-b border-gray-700">
            <div className="col-span-1">
              <Skeleton variant="text" className="h-4 w-8" />
            </div>
            <div className="col-span-5">
              <Skeleton variant="text" className="h-4 w-24" />
            </div>
            <div className="col-span-2">
              <Skeleton variant="text" className="h-4 w-16" />
            </div>
            <div className="col-span-2">
              <Skeleton variant="text" className="h-4 w-20" />
            </div>
            <div className="col-span-2">
              <Skeleton variant="text" className="h-4 w-16" />
            </div>
          </div>

          {/* Table Rows */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 last:border-b-0"
            >
              <div className="col-span-1 flex items-center">
                <Skeleton variant="circular" width={32} height={32} />
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <SkeletonAvatar size={48} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-5 w-32" />
                  <Skeleton variant="text" className="h-3 w-24" />
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <Skeleton variant="text" className="h-4 w-16" />
              </div>
              <div className="col-span-2 flex items-center">
                <Skeleton variant="text" className="h-4 w-20" />
              </div>
              <div className="col-span-2 flex items-center">
                <Skeleton variant="text" className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-lg border border-gray-700 p-4"
          >
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <Skeleton variant="circular" width={48} height={48} />
              
              {/* Player Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size={56} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="h-5 w-32" />
                    <Skeleton variant="text" className="h-4 w-24" />
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div>
                    <Skeleton variant="text" className="h-4 w-12" />
                    <Skeleton variant="text" className="h-3 w-8 mt-1" />
                  </div>
                  <div>
                    <Skeleton variant="text" className="h-4 w-12" />
                    <Skeleton variant="text" className="h-3 w-8 mt-1" />
                  </div>
                  <div>
                    <Skeleton variant="text" className="h-4 w-12" />
                    <Skeleton variant="text" className="h-3 w-8 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
