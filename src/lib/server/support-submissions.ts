import { sendMail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';

const BOT_MIN_ELAPSED_MS = 2000;

export const SUPPORT_CONTACT_RATE_LIMIT = {
  limit: 20,
  windowMs: 10 * 60 * 1000,
} as const;

export const CATEGORY_SUGGESTION_RATE_LIMIT = {
  limit: 20,
  windowMs: 10 * 60 * 1000,
} as const;

type ValidationError = {
  kind: 'error';
  code: 'validation_error';
  message: string;
};

type IgnoredSubmission = {
  kind: 'ignored';
  message: string;
};

type ValidSubmission<T> = {
  kind: 'ok';
  data: T;
};

export type SubmissionValidationResult<T> = ValidationError | IgnoredSubmission | ValidSubmission<T>;

export type SupportContactInput = {
  name: string | null;
  email: string;
  topic: 'general' | 'bug' | 'improvement';
  message: string;
  origin: string | null;
  url: string | null;
  context: unknown;
};

export type CategorySuggestionInput = {
  suggestedName: string;
  description: string | null;
  email: string | null;
  userId: string | null;
  origin: string | null;
  url: string | null;
  context: unknown;
  relatedCategoryId: string | null;
  perspective: 'provider' | 'seeker' | null;
};

function shouldIgnoreSubmission(website: unknown, openedAt: unknown): boolean {
  if (typeof website === 'string' && website.trim().length > 0) {
    return true;
  }

  if (typeof openedAt === 'number' && openedAt > 0) {
    return Date.now() - openedAt < BOT_MIN_ELAPSED_MS;
  }

  return false;
}

export function validateSupportContactPayload(payload: unknown): SubmissionValidationResult<SupportContactInput> {
  const body = (payload ?? {}) as Record<string, unknown>;

  if (shouldIgnoreSubmission(body.website, body.openedAt)) {
    return {
      kind: 'ignored',
      message: 'Mensaje recibido.',
    };
  }

  if (typeof body.email !== 'string' || body.email.trim().length === 0) {
    return {
      kind: 'error',
      code: 'validation_error',
      message: 'El email es obligatorio.',
    };
  }

  if (typeof body.message !== 'string' || body.message.trim().length === 0) {
    return {
      kind: 'error',
      code: 'validation_error',
      message: 'El mensaje es obligatorio.',
    };
  }

  const topic = body.topic === 'bug' || body.topic === 'improvement' ? body.topic : 'general';

  return {
    kind: 'ok',
    data: {
      name:
        typeof body.name === 'string' && body.name.trim().length > 0
          ? body.name.trim().slice(0, 80)
          : null,
      email: body.email.trim().slice(0, 120),
      topic,
      message: body.message.trim().slice(0, 4000),
      origin: typeof body.origin === 'string' ? body.origin : null,
      url: typeof body.url === 'string' ? body.url : null,
      context: body.context,
    },
  };
}

export async function createSupportContactSubmission(input: SupportContactInput): Promise<{ id: string }> {
  const severity =
    input.topic === 'bug' ? 'high' : input.topic === 'improvement' ? 'medium' : 'low';
  const title =
    input.topic === 'bug'
      ? 'Reporte de problema desde la web'
      : input.topic === 'improvement'
        ? 'Sugerencia de mejora desde la web'
        : 'Consulta general desde la web';

  const report = await prisma.bugReport.create({
    data: {
      title,
      description: input.message,
      status: 'open',
      severity,
      userEmail: input.email,
      context: {
        origin: input.origin ?? undefined,
        url: input.url ?? undefined,
        topic: input.topic,
        name: input.name ?? undefined,
        extra: input.context ?? undefined,
      },
    },
  });

  try {
    const notificationEmail = process.env.SUPPORT_NOTIFICATION_EMAIL || 'infaicolon@gmail.com';
    await sendMail({
      to: notificationEmail,
      subject: `[Mi Colón - Soporte] ${title}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #006F4B;">Nuevo mensaje de contacto / soporte</h2>
          <p><strong>De:</strong> ${input.name || 'Anónimo'} (${input.email})</p>
          <p><strong>Tipo / Asunto:</strong> ${title}</p>
          <p><strong>Origen:</strong> ${input.origin || 'N/A'}</p>
          <p><strong>Página:</strong> ${input.url || 'N/A'}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #006F4B;">Mensaje:</h3>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${input.message}</p>
        </div>
      `,
      text: `Nuevo mensaje de soporte\nDe: ${input.name || 'Anónimo'} (${input.email})\nMensaje: ${input.message}`,
    });
  } catch (mailError) {
    console.error('Error enviando notificación por email de soporte:', mailError);
  }

  return { id: report.id };
}

export function validateCategorySuggestionPayload(
  payload: unknown
): SubmissionValidationResult<CategorySuggestionInput> {
  const body = (payload ?? {}) as Record<string, unknown>;

  if (shouldIgnoreSubmission(body.website, body.openedAt)) {
    return {
      kind: 'ignored',
      message: 'Sugerencia registrada.',
    };
  }

  if (typeof body.suggestedName !== 'string' || body.suggestedName.trim().length === 0) {
    return {
      kind: 'error',
      code: 'validation_error',
      message: 'El nombre de la categoria sugerida es obligatorio.',
    };
  }

  const userId = typeof body.userId === 'string' && body.userId.trim().length > 0 ? body.userId : null;
  const email = typeof body.email === 'string' && body.email.trim().length > 0 ? body.email.trim() : null;

  if (!userId && !email) {
    return {
      kind: 'error',
      code: 'validation_error',
      message: 'Debe proporcionar un email si no hay usuario autenticado.',
    };
  }

  return {
    kind: 'ok',
    data: {
      suggestedName: body.suggestedName.trim().slice(0, 150),
      description:
        typeof body.description === 'string' && body.description.trim().length > 0
          ? body.description.trim().slice(0, 2000)
          : null,
      email: email ? email.slice(0, 120) : null,
      userId,
      origin: typeof body.origin === 'string' ? body.origin : null,
      url: typeof body.url === 'string' ? body.url : null,
      context: body.context,
      relatedCategoryId:
        typeof body.relatedCategoryId === 'string' && body.relatedCategoryId.trim().length > 0
          ? body.relatedCategoryId
          : null,
      perspective:
        body.perspective === 'provider' || body.perspective === 'seeker'
          ? body.perspective
          : null,
    },
  };
}

export async function createCategorySuggestionSubmission(
  input: CategorySuggestionInput
): Promise<{ id: string }> {
  const suggestion = await prisma.categorySuggestion.create({
    data: {
      title: input.suggestedName,
      description: input.description,
      status: 'open',
      userId: input.userId,
      userEmail: input.email,
      origin: input.origin,
      url: input.url,
      context: input.context ?? undefined,
      relatedCategoryId: input.relatedCategoryId,
      perspective: input.perspective,
    },
  });

  try {
    const notificationEmail = process.env.SUPPORT_NOTIFICATION_EMAIL || 'infaicolon@gmail.com';
    await sendMail({
      to: notificationEmail,
      subject: `[Mi Colón] Nueva sugerencia de categoría: ${input.suggestedName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #006F4B;">Nueva sugerencia de categoría</h2>
          <p><strong>Categoría sugerida:</strong> ${input.suggestedName}</p>
          <p><strong>Email remitente:</strong> ${input.email || 'No proporcionado'}</p>
          <p><strong>Perspectiva:</strong> ${input.perspective === 'provider' ? 'Ofrece el servicio (Profesional)' : input.perspective === 'seeker' ? 'Busca el servicio (Vecino)' : 'General'}</p>
          <p><strong>Origen:</strong> ${input.origin || 'N/A'}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #006F4B;">Detalles:</h3>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${input.description || 'Sin descripción adicional'}</p>
        </div>
      `,
      text: `Nueva sugerencia de categoría: ${input.suggestedName}\nEmail: ${input.email || 'N/A'}\nDescripción: ${input.description || 'Sin descripción'}`,
    });
  } catch (mailError) {
    console.error('Error enviando notificación por email de sugerencia:', mailError);
  }

  return { id: suggestion.id };
}
