import crypto from 'crypto'

const PASSPHRASE = 'your-secret-passphrase' // Em produção, usar uma passphrase segura

export function generateJWT(payload: any): string {
  // Header com algoritmo HS256
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  // Converter header para Base64URL
  const headerEncoded = Buffer.from(JSON.stringify(header))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  
  // Converter payload para Base64URL
  const payloadEncoded = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  
  // Criar signature usando HMAC-SHA256
  const signatureInput = `${headerEncoded}.${payloadEncoded}`
  const signature = crypto
    .createHmac('sha256', PASSPHRASE)
    .update(signatureInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  
  // Retornar JWT completo
  return `${headerEncoded}.${payloadEncoded}.${signature}`
}