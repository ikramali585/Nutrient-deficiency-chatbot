const ResultCard = ({ result, loading, loadingSeconds = 0 }) => {
  // ==========Loading placeholder state================
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />
          <span>Analyzing image {loadingSeconds}s</span>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-2/3 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
        </div>
      </div>
    )
  }

  // =========Empty state before analysis runs=====================
  if (!result) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
        Upload an image to see analysis results.
      </div>
    )
  }

  return (
    // ===========Prediction details state=================
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-900">Prediction Result</h3>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm text-emerald-700">Detected Deficiency</p>
        <p className="text-lg font-bold text-emerald-900">{result.label}</p>
      </div>
      <p className="text-sm text-slate-700">
        Confidence: <span className="font-semibold">{Math.round(result.confidence * 100)}%</span>
      </p>
      <p className="text-sm text-slate-700">{result.recommendation}</p>
    </div>
  )
}

export default ResultCard
