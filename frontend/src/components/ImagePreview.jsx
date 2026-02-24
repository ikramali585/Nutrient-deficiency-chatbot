const ImagePreview = ({ previewUrl, onRemove, className = 'mt-6' }) => {
  // ====Skip rendering when no preview exists=====
  if (!previewUrl) return null

  return (
    // ===========Preview section====================
    <div className={`${className} mx-auto flex h-full w-full flex-col px-3 pt-4`}>
      {/* =====Header row with remove action =====*/}
      <div className="flex items-center justify-between px-1 pb-4">
        <p className="text-sm font-medium text-slate-700">Image Preview</p>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          Remove
        </button>
      </div>

      {/* =================Preview image================ */}
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-1 flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2 sm:h-80">
          <img
            src={previewUrl}
            alt="Selected crop"
            className="h-full w-full object-contain object-center"
          />
        </div>
      </div>
    </div>
  )
}

export default ImagePreview
