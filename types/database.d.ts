export interface Appearance {
  theme?: string
  language?: string
}

export type UserRole = 'guest' | 'user' | 'admin' | 'superadmin' | undefined
