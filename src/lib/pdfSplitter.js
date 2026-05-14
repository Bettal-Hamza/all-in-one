import { PDFDocument } from 'pdf-lib'

export async function splitPdf(file, onProgress = () => {}) {
  const arrayBuffer = await file.arrayBuffer()
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  const totalPages = srcDoc.getPageCount()

  if (totalPages === 0) {
    throw new Error('This PDF has no pages.')
  }

  const results = []

  for (let i = 0; i < totalPages; i++) {
    const newDoc = await PDFDocument.create()
    const [copiedPage] = await newDoc.copyPages(srcDoc, [i])
    newDoc.addPage(copiedPage)
    const pdfBytes = await newDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const baseName = file.name.replace(/\.pdf$/i, '')
    const filename = `${baseName}_page_${i + 1}.pdf`
    results.push({ url, filename })
    onProgress(i + 1, totalPages)

    // Yield to the event loop so React can repaint the progress bar
    if (i < totalPages - 1) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  return results
}
