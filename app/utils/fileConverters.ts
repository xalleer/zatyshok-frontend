export function base64ToBlob(base64: string): Blob {
    const [meta, data] = base64.split(',')
    const mime = meta.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
    const binary = atob(data)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return new Blob([bytes], { type: mime })
}

export function base64ToFile(base64: string, filename: string): File {
    const blob = base64ToBlob(base64)
    return new File([blob], filename, { type: blob.type })
}