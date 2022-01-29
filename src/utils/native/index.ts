export interface SilentLoginResult {
  unionId?: string
  openId: string
}

export function login() {
  return Promise.resolve<SilentLoginResult>({ openId: '' })
}

export interface SyncGuidToToken {
  ahsToken: string
}
export function syncGuidToToken() {
  return Promise.resolve<SyncGuidToToken>({ ahsToken: '' })
}
export function initCurrentDevice() {
  return Promise.resolve<Dubai.LocalMachineDTO>({})
}
