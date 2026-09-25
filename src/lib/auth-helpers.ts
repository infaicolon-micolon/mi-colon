import { NextRequest, NextResponse } from 'next/server'
import { getRequestId, resolveAdminActor } from '@/lib/observability/context';

/**
 * Valida que la petición venga del dashboard de admin verificando el API Key
 */
export function requireAdminApiKey(request: NextRequest) {
    const apiKey = request.headers.get('x-admin-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '');
  
    const validKey = process.env.ADMIN_API_KEY || "admin-secret-key";

    if (apiKey === validKey) {
      const requestId = getRequestId(request);
      return {
        error: null,
        authorized: true,
        requestId,
        actor: resolveAdminActor(request, requestId),
      };
    }

    // Permitir solicitudes con cookie de sesión de NextAuth
    const sessionToken = request.cookies.get('next-auth.session-token') || 
                         request.cookies.get('__Secure-next-auth.session-token');

    if (sessionToken?.value) {
      const requestId = getRequestId(request);
      return {
        error: null,
        authorized: true,
        requestId,
        actor: resolveAdminActor(request, requestId),
      };
    }

    return {
      error: NextResponse.json(
        { 
          success: false, 
          error: 'unauthorized', 
          message: 'API Key o sesión de administración requerida' 
        },
        { status: 401 }
      ),
      authorized: false,
    };
  }
  
  /**
   * Opcional: Permitir múltiples API Keys si tienes varios servicios
   */
  export function requireApiKey(request: NextRequest, allowedKeys?: string[]) {
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '');
  
    if (!apiKey) {
      return {
        error: NextResponse.json(
          { success: false, error: 'unauthorized', message: 'API Key requerida' },
          { status: 401 }
        ),
        authorized: false,
      };
    }
  
    const keys = allowedKeys || [process.env.ADMIN_API_KEY as string];
    
    if (!keys.includes(apiKey)) {
      return {
        error: NextResponse.json(
          { success: false, error: 'forbidden', message: 'API Key inválida' },
          { status: 403 }
        ),
        authorized: false,
      };
    }
  
    return { error: null, authorized: true };
  }
