import 'server-only';

export function isAuthorized(req: Request): boolean {
  const required = process.env.ADMIN_TOKEN;
  if (!required) return true; // open by default when not configured
  const provided = req.headers.get('x-admin-token') || '';
  return provided === required;
}
