const Shimmer = ({ className }: { className: string }) => (
  <div className={`bg-slate-800/60 rounded-lg animate-pulse ${className}`} />
);

const LoadingSkeleton = () => (
  <div className="w-full space-y-4">
    <div className="glass rounded-2xl p-6 border-slate-800/50 space-y-4">
      <div className="flex items-center gap-3">
        <Shimmer className="w-9 h-9 rounded-lg" />
        <Shimmer className="w-32 h-5" />
      </div>
      <Shimmer className="w-full h-4" />
      <Shimmer className="w-5/6 h-4" />
      <Shimmer className="w-4/6 h-4" />
    </div>

    <div className="glass rounded-2xl p-6 border-slate-800/50 space-y-4">
      <div className="flex items-center gap-3">
        <Shimmer className="w-9 h-9 rounded-lg" />
        <Shimmer className="w-28 h-5" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <Shimmer className="w-6 h-6 rounded-full flex-shrink-0" />
          <Shimmer className={`h-4 ${i % 2 === 0 ? "w-full" : "w-5/6"}`} />
        </div>
      ))}
    </div>

    <div className="glass rounded-2xl p-6 border-slate-800/50 space-y-4">
      <div className="flex items-center gap-3">
        <Shimmer className="w-9 h-9 rounded-lg" />
        <Shimmer className="w-40 h-5" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Shimmer key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
