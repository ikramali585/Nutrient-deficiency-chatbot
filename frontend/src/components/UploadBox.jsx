import React from 'react'

const UploadBox = ({ onFileSelect, onError, maxSizeMB = 5, accept = 'image/*' }) => {
  // Validates selected file and forwards it to parent
  const handleChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      onError?.(`File too large. Max size is ${maxSizeMB}MB.`)
      event.target.value = ''
      return
    }

    onFileSelect?.(file)
  }

  return (
    // Upload card
    <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6">
      {/* Upload trigger and file input */}
      <label className="flex cursor-pointer flex-col items-center justify-center gap-4 text-center">
        <span className="text-lg font-semibold text-slate-800">Upload Rice Leaf Image</span>
        <span className="text-sm text-slate-600">Accepted: {accept}. Max: {maxSizeMB}MB.</span>
        <span className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Choose File</span>
        {/* Hidden native input */}
        <input type="file" accept={accept} onChange={handleChange} className="hidden" />
      </label>
    </div>
  )
}

export default UploadBox
