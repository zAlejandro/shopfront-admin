// Un solo punto de entrada: VITE_DATA_SOURCE=mock (datos de prueba) | api (backend + Supabase Auth)
import {api as mock,assetUrl} from './api.mock.js'
import {api as real} from './api.real.js'
export {assetUrl}
export const api=(import.meta.env.VITE_DATA_SOURCE||'mock')==='mock'?mock:real
