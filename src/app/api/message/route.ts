import { NextRequest, NextResponse } from 'next/server'
import { generateJWT } from '@/lib/jwt'

const WEBHOOK_URL = 'https://n8nwebhook-ops.agencialendaria.ai/webhook/acedc887-dfbd-4073-bc0a-8d74160d1539'

export async function POST(request: NextRequest) {
  try {
    const { text, chatId, userId } = await request.json()

    if (!text || !chatId || !userId) {
      return NextResponse.json(
        { error: 'Text, chatId, and userId are required' },
        { status: 400 }
      )
    }

    // Gerar JWT token com os dados necessários
    const jwtToken = generateJWT({
      chatId,
      userId,
      planId: 'plan-id',
      text
    })

    // Fazer requisição para o webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        text,
        chatId
      })
    })

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed: ${webhookResponse.statusText}`)
    }

    const webhookData = await webhookResponse.json()

    // Retornar a resposta do webhook
    return NextResponse.json(webhookData)

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}