export const MS = 1
export const SECONDS = MS * 1000
export const MINUTES = SECONDS * 60
export const HOURS = MINUTES * 60
export const DAYS = HOURS * 24

export function seconds(value: number) {
  return SECONDS * value
}

export function minutes(value: number) {
  return MINUTES * value
}

export function hours(value: number) {
  return HOURS * value
}

export function days(value: number) {
  return DAYS * value
}
