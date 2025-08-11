import { NextRequest, NextResponse } from 'next/server'
import { generateJWT } from '@/lib/jwt'

const WEBHOOK_URL = 'https://n8nwebhook-ops.agencialendaria.ai/webhook/93c9471c-a0fa-49a2-acd7-7e061e5ec156'

export async function POST(request: NextRequest) {
  try {
    const { subject } = await request.json()

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      )
    }

    // Gerar ID de usuário aleatório
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Gerar JWT token
    const jwtToken = generateJWT({ id: userId })

    // Fazer requisição para o webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ subject })
    })

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed: ${webhookResponse.statusText}`)
    }

    const webhookData = await webhookResponse.json()

    // Retornar a resposta do webhook junto com o userId gerado
    return NextResponse.json({
      ...webhookData,
      userId
    })

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}