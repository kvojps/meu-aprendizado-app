export const ROUTES = {
  APRENDIZADOS: '/aprendizados',
  APRENDIZADO_DETAIL: '/aprendizados/:id',
  SETTINGS: '/settings',
} as const;

export function aprendizadoDetailPath(id: string): string {
  return `/aprendizados/${id}`;
}
