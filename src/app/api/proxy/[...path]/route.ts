import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;

  return proxy(req, resolvedParams.path);
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return proxy(req, resolvedParams.path);
}

async function proxy(req: Request, path: string[]) {
  try {
    const url = `http://localhost:3022/${path.join('/')}`;

    const body = ['POST', 'PUT', 'PATCH'].includes(req.method || '') ? await req.text() : undefined;

    const authHeader = req.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const res = await fetch(url, {
      method: req.method,
      headers,
      body,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const errorText = await res.text();

      // пытаемся распарсить JSON из ошибки
      let errorMessage = errorText;
      try {
        const parsedError = JSON.parse(errorText);
        if (parsedError.message) {
          errorMessage = parsedError.message;
        }
      } catch (parseError) {
        console.log(parseError);
      }

      return NextResponse.json({
        error: 'Backend request failed',
        status: res.status,
        message: errorMessage
      }, { status: res.status });
    }

    // проверяем, есть ли содержимое в ответе
    const responseText = await res.text();
    let data = {};

    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        return NextResponse.json({
          error: 'Invalid JSON response from backend',
          details: responseText
        }, { status: 500 });
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    if (err.code === 'ECONNREFUSED') {
      return NextResponse.json({
        error: 'Backend server is not running. Please start the backend on port 3022.'
      }, { status: 503 });
    }
    return NextResponse.json({
      error: 'Proxy request failed',
      details: err.message
    }, { status: 500 });
  }
}
