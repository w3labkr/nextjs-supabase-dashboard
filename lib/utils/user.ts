export function generateUserRole(role: string) {
  return {
    role,
    isGuest: role === 'guest',
    isUser: role === 'user',
    isAdmin: role?.includes('admin'),
    isSuperAdmin: role === 'superadmin',
  }
}
