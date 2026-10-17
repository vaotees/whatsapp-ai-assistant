import { NextResponse, type NextRequest } from 'next/server'

// Os leads têm nome, telefone e e-mail: o painel e a API ficam atrás de HTTP Basic auth.
export function proxy(request: NextRequest) {
  const user = process.env.DASHBOARD_USER
  const password = process.env.DASHBOARD_PASSWORD
  if (!user || !password) {
    return new NextResponse('Painel desativado: defina DASHBOARD_USER e DASHBOARD_PASSWORD.', { status: 503 })
  }

  const [scheme, encoded] = (request.headers.get('authorization') ?? '').split(' ')
  if (scheme === 'Basic' && encoded && safeEqual(decode(encoded), `${user}:${password}`)) {
    return NextResponse.next()
  }

  return new NextResponse('Autenticação necessária.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Leads", charset="UTF-8"' },
  })
}

function decode(value: string) {
  try {
    return new TextDecoder().decode(Uint8Array.from(atob(value), (c) => c.charCodeAt(0)))
  } catch {
    return ''
  }
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/leads/:path*'],
}
