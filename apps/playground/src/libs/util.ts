export function shortAccount(account: string, length = 4) {
  return account.slice(0, length + 2) + '...' + account.slice(-length)
}
