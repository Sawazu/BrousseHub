import { useMemo, useRef, useState } from 'react'
import { CheckIcon, ImageIcon, UploadIcon } from './icons'
import { formatKamas } from '../lib/format'
import { parseRunePurchases, type ParsedRunePurchase } from '../lib/runePurchaseParser'

type ScreenshotRuneImportProps = {
  onImport: (purchases: ParsedRunePurchase[]) => void
}

const MAX_FILES = 8
const MAX_FILE_SIZE = 12 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

function getOtsuThreshold(values: Uint8Array) {
  const histogram = new Uint32Array(256)
  let totalLuminance = 0

  for (const value of values) {
    histogram[value] += 1
    totalLuminance += value
  }

  let backgroundWeight = 0
  let backgroundSum = 0
  let bestVariance = -1
  let bestThreshold = 128
  const total = values.length

  for (let threshold = 0; threshold < 256; threshold += 1) {
    backgroundWeight += histogram[threshold]
    if (!backgroundWeight) continue

    const foregroundWeight = total - backgroundWeight
    if (!foregroundWeight) break

    backgroundSum += threshold * histogram[threshold]
    const backgroundMean = backgroundSum / backgroundWeight
    const foregroundMean = (totalLuminance - backgroundSum) / foregroundWeight
    const variance = backgroundWeight * foregroundWeight * (backgroundMean - foregroundMean) ** 2

    if (variance > bestVariance) {
      bestVariance = variance
      bestThreshold = threshold
    }
  }

  return {
    threshold: bestThreshold,
    mean: total ? totalLuminance / total : 128,
  }
}

async function prepareScreenshotForOcr(file: File) {
  const bitmap = await createImageBitmap(file)
  const cropLeft = Math.round(bitmap.width * 0.055)
  const cropRight = Math.round(bitmap.width * 0.01)
  const cropWidth = Math.max(1, bitmap.width - cropLeft - cropRight)
  const scale = Math.min(2.5, Math.max(1.6, 1050 / cropWidth))

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(cropWidth * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    bitmap.close()
    throw new Error('Impossible de préparer la capture pour la lecture.')
  }

  context.imageSmoothingEnabled = false
  context.drawImage(bitmap, cropLeft, 0, cropWidth, bitmap.height, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data
  const grayscale = new Uint8Array(pixels.length / 4)

  for (let pixel = 0, grayIndex = 0; pixel < pixels.length; pixel += 4, grayIndex += 1) {
    grayscale[grayIndex] = Math.round(pixels[pixel] * 0.299 + pixels[pixel + 1] * 0.587 + pixels[pixel + 2] * 0.114)
  }

  const { threshold, mean } = getOtsuThreshold(grayscale)
  const darkBackground = mean < 128

  for (let pixel = 0, grayIndex = 0; pixel < pixels.length; pixel += 4, grayIndex += 1) {
    const value = grayscale[grayIndex]
    const isText = darkBackground ? value > threshold : value < threshold
    const binary = isText ? 0 : 255
    pixels[pixel] = binary
    pixels[pixel + 1] = binary
    pixels[pixel + 2] = binary
    pixels[pixel + 3] = 255
  }

  context.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}

function sanitizeFiles(files: File[]) {
  return files
    .filter((file) => ACCEPTED_TYPES.has(file.type) && file.size <= MAX_FILE_SIZE)
    .slice(0, MAX_FILES)
}

export function ScreenshotRuneImport({ onImport }: ScreenshotRuneImportProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [purchases, setPurchases] = useState<ParsedRunePurchase[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [rawText, setRawText] = useState('')
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastImportedCount, setLastImportedCount] = useState(0)

  const selectedPurchases = useMemo(
    () => purchases.filter((purchase) => selectedIds.has(purchase.id)),
    [purchases, selectedIds],
  )

  const selectedTotal = selectedPurchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0)
  const selectedQuantity = selectedPurchases.reduce((sum, purchase) => sum + purchase.quantity, 0)

  async function analyze(nextFiles: File[]) {
    if (!nextFiles.length || isAnalyzing) return

    setIsAnalyzing(true)
    setError('')
    setPurchases([])
    setSelectedIds(new Set())
    setRawText('')
    setProgress(0)
    setLastImportedCount(0)

    try {
      setStatus('Chargement du moteur OCR…')
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('fra')
      const allPurchases: ParsedRunePurchase[] = []
      const rawBlocks: string[] = []

      try {
        for (let index = 0; index < nextFiles.length; index += 1) {
          const file = nextFiles[index]
          setStatus(`Lecture ${index + 1}/${nextFiles.length} — ${file.name}`)
          const preparedImage = await prepareScreenshotForOcr(file)
          const result = await worker.recognize(preparedImage)
          const text = result.data.text ?? ''
          rawBlocks.push(`--- ${file.name} ---\n${text}`)
          allPurchases.push(...parseRunePurchases(text, file.name, index))
          setProgress(((index + 1) / nextFiles.length) * 100)
        }
      } finally {
        await worker.terminate()
      }

      setPurchases(allPurchases)
      setSelectedIds(new Set(allPurchases.map((purchase) => purchase.id)))
      setRawText(rawBlocks.join('\n\n'))
      setStatus(allPurchases.length ? `${allPurchases.length} ligne${allPurchases.length > 1 ? 's' : ''} d’achat reconnue${allPurchases.length > 1 ? 's' : ''}.` : 'Aucune ligne d’achat de rune reconnue.')
    } catch (caughtError) {
      console.error(caughtError)
      setError('La lecture de la capture a échoué. Essaie une capture plus nette ou recadrée sur le chat.')
      setStatus('')
    } finally {
      setIsAnalyzing(false)
    }
  }

  function useFiles(nextFiles: File[]) {
    if (isAnalyzing) return
    const sanitized = sanitizeFiles(nextFiles)

    if (!sanitized.length) {
      setError('Ajoute une image PNG, JPG ou WEBP de moins de 12 Mo.')
      return
    }

    setFiles(sanitized)
    if (sanitized.length < nextFiles.length) {
      setError(`Certaines images ont été ignorées. Maximum : ${MAX_FILES} captures de 12 Mo.`)
    } else {
      setError('')
    }
    void analyze(sanitized)
  }

  function togglePurchase(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function importSelected() {
    if (!selectedPurchases.length) return
    onImport(selectedPurchases)
    setLastImportedCount(selectedPurchases.length)
    setSelectedIds(new Set())
  }

  return (
    <section className="screenshot-import" onPaste={(event) => {
      const pastedFiles = [...event.clipboardData.files].filter((file) => file.type.startsWith('image/'))
      if (pastedFiles.length) {
        event.preventDefault()
        useFiles(pastedFiles)
      }
    }}>
      <div className="ocr-upload-panel">
        <div className="ocr-section-heading">
          <div>
            <span className="ocr-eyebrow"><ImageIcon /> Import screenshot</span>
            <h2>Récupérer les achats de runes</h2>
          </div>
          <span className="badge badge-positive">OCR local</span>
        </div>

        <p className="ocr-description">
          Broussehub ne garde que les lignes du type <strong>100 x [Rune Do Terre] (132 215 kamas)</strong>.
          Quantité, nom de rune et kamas sont extraits automatiquement.
        </p>

        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          disabled={isAnalyzing}
          onChange={(event) => {
            useFiles([...(event.currentTarget.files ?? [])])
            event.currentTarget.value = ''
          }}
        />

        <button
          className={`ocr-dropzone${isAnalyzing ? ' is-loading' : ''}`}
          type="button"
          disabled={isAnalyzing}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            useFiles([...event.dataTransfer.files])
          }}
        >
          <span className="ocr-dropzone-icon"><UploadIcon /></span>
          <span className="ocr-dropzone-title">Dépose tes captures du chat ici</span>
          <span className="ocr-dropzone-copy">ou clique pour choisir jusqu’à {MAX_FILES} images</span>
          <span className="ocr-dropzone-copy">Tu peux aussi coller une capture avec Ctrl + V.</span>
        </button>

        {files.length > 0 ? <div className="ocr-files">{files.map((file) => <span key={`${file.name}-${file.size}`} className="ocr-file-chip">{file.name}</span>)}</div> : null}

        {isAnalyzing || status ? (
          <div className="ocr-progress-block" aria-live="polite">
            <div className="ocr-progress-copy"><span>{status}</span><strong>{Math.round(progress)} %</strong></div>
            <div className="ocr-progress"><span style={{ width: `${progress}%` }} /></div>
          </div>
        ) : null}

        {error ? <p className="ocr-error" role="alert">{error}</p> : null}
        <p className="ocr-privacy">La reconnaissance s’effectue dans ton navigateur. Les captures ne sont pas envoyées à Broussehub.</p>
      </div>

      <div className="ocr-results-panel">
        <div className="ocr-section-heading">
          <div>
            <span className="ocr-eyebrow"><CheckIcon /> Résultat</span>
            <h2>Lignes reconnues</h2>
          </div>
          <span className="badge">{purchases.length} détectée{purchases.length > 1 ? 's' : ''}</span>
        </div>

        {purchases.length ? (
          <>
            <p className="ocr-overlap-warning">Si deux captures se chevauchent, décoche ici les achats présents deux fois avant l’import.</p>
            <div className="ocr-result-list">
              {purchases.map((purchase) => (
                <label key={purchase.id} className={`ocr-result-row${selectedIds.has(purchase.id) ? ' is-selected' : ''}`}>
                  <input type="checkbox" checked={selectedIds.has(purchase.id)} onChange={() => togglePurchase(purchase.id)} />
                  <span className="ocr-result-main">
                    <strong>{purchase.quantity.toLocaleString('fr-FR')} x [{purchase.rune}]</strong>
                    <small>{purchase.sourceName}</small>
                  </span>
                  <span className="ocr-result-price">{formatKamas(purchase.totalPrice)}</span>
                </label>
              ))}
            </div>

            <div className="ocr-result-footer">
              <div>
                <span className="ocr-result-total-label">Sélection</span>
                <strong>{selectedQuantity.toLocaleString('fr-FR')} runes · {formatKamas(selectedTotal)}</strong>
              </div>
              <button className="btn btn-primary" type="button" disabled={!selectedPurchases.length} onClick={importSelected}>
                <CheckIcon /> Ajouter à la session ({selectedPurchases.length})
              </button>
            </div>
          </>
        ) : (
          <div className="ocr-empty-state">
            <ImageIcon />
            <strong>{isAnalyzing ? 'Lecture en cours…' : 'Aucun achat détecté pour le moment'}</strong>
            <span>Les messages privés, créations de runes et autres lignes du chat sont ignorés.</span>
          </div>
        )}

        {lastImportedCount ? <p className="ocr-imported"><CheckIcon /> {lastImportedCount} ligne{lastImportedCount > 1 ? 's' : ''} ajoutée{lastImportedCount > 1 ? 's' : ''} au Tracker FM.</p> : null}

        {rawText ? <details className="ocr-diagnostic"><summary>Diagnostic : voir le texte OCR brut</summary><pre>{rawText}</pre></details> : null}
      </div>
    </section>
  )
}
