import { fetch, query } from 'providers/redux/reducers/rest'
export const fetchLanguage = fetch('FV_LANGUAGE', 'FVLanguage', {
  headers: { 'enrichers.document': 'ancestry' },
})
export const fetchLanguages = query('FV_LANGUAGES', 'FVLanguage', {
  headers: { 'enrichers.document': 'ancestry' },
})
