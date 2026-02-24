import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSlider from '../components/HeroSlider'
import UploadBox from '../components/UploadBox'
import ImagePreview from '../components/ImagePreview'
import ResultCard from '../components/ResultCard'
import ChatBox from '../components/ChatBox'

const Home = ({
  previewUrl,
  error,
  result,
  analysisLoading,
  analysisSeconds,
  chatLoading,
  chatSeconds,
  messages,
  chatHistory,
  onFileSelect,
  onUploadError,
  onRemovePreview,
  onSend,
  onClearHistory,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===**Sticky top navigation**====*/}
      <Header />

      <main>
        {/*==========****Hero section****=============== */}
        <section className="pt-10 pb-4 md:pt-16 md:pb-6">
          <div className="mx-auto max-w-6xl px-4">
            <HeroSlider />
          </div>
        </section>

        {/* ==========***Image analysis section***============*/}
        <section id="image-analysis" className="pt-4 pb-4 md:pt-6 md:pb-6">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-emerald-700 md:text-3xl">
                Image Analysis
              </h2>
              <p className="mt-1 text-sm md:text-lg text-slate-600">Upload a rice crop leaf image for deficiency detection.</p>
            </div>

            {/* ==========Upload error alert ==============*/}
            {error ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : null}

            {/* ====Rearranged analysis layout==== */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* ===Left column: upload + results==== */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <UploadBox
                    onFileSelect={onFileSelect}
                    onError={onUploadError}
                    maxSizeMB={5}
                    accept="image/*"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <ResultCard result={result} loading={analysisLoading} loadingSeconds={analysisSeconds} />
                </div>
              </div>

              {/* ===Right column: image preview==== */}
              <div className="flex rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {previewUrl ? (
                  <ImagePreview previewUrl={previewUrl} onRemove={onRemovePreview} className="w-full" />
                ) : (
                  <div className="flex w-full flex-1 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                    Upload an image to preview it here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ====***AgriBot chat section***===== */}
        <section id="agribot" className="pt-4 pb-10 md:pt-6 md:pb-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">AgriBot</h2>
              <ChatBox messages={messages} onSend={onSend} loading={chatLoading} loadingSeconds={chatSeconds} chatHistory={chatHistory} onClearHistory={onClearHistory} />
            </div>
          </div>
        </section>
      </main>

      {/* ====***Footer section***=====*/}
      <Footer />
    </div>
  )
}

export default Home
