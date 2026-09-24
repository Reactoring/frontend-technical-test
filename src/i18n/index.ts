import { fr } from './fr'

export type TranslationKey = keyof typeof fr

// French is the only locale for now: adding one means adding a dictionary with the same keys.
export function t(key: TranslationKey, params: Record<string, string> = {}) {
  return fr[key].replace(/\{(\w+)\}/g, (placeholder, name: string) => params[name] || placeholder)
}
