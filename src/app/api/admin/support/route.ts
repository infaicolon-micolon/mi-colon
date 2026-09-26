import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApiKey } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  const { error } = requireAdminApiKey(request);
  if (error) return error;

  try {
    const [bugReports, categorySuggestions] = await Promise.all([
      prisma.bugReport.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.categorySuggestion.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bugReports,
        categorySuggestions,
      },
    });
  } catch (err) {
    console.error('Error al obtener soporte en admin:', err);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Error al obtener mensajes de soporte' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { error } = requireAdminApiKey(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { type, id, status } = body;

    if (!type || !id || !status) {
      return NextResponse.json(
        { success: false, error: 'bad_request', message: 'Faltan parámetros requeridos (type, id, status)' },
        { status: 400 }
      );
    }

    if (type === 'contact' || type === 'bug') {
      const updated = await prisma.bugReport.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'suggestion') {
      const updated = await prisma.categorySuggestion.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, error: 'bad_request', message: 'Tipo no válido' },
      { status: 400 }
    );
  } catch (err) {
    console.error('Error al actualizar estado de soporte en admin:', err);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Error al actualizar el estado' },
      { status: 500 }
    );
  }
}
