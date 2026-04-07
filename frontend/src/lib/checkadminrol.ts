/**
 * Comprueba si el argumento (usuario o role) representa un administrador.
 * Acepta una cadena con el role o un objeto que contenga `role`.
 * Devuelve `true` sólo si el role es exactamente "ADMIN".
 */
export default function checkAdminRole(subject: any): boolean {
  if (!subject) return false;
  if (typeof subject === "string") return subject === "ADMIN";
  if (typeof subject === "object") {
    const role = subject.role ?? subject.user?.role ?? subject.roleName ?? null;
    return role === "ADMIN";
  }
  return false;
}
