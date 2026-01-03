/**
 * Validates that a string is a valid Ethereum address
 * Must be in format: 0x followed by 40 hexadecimal characters
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

