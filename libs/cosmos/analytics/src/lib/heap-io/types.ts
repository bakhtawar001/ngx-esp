export interface HeapIoOptions {
  secureCookie?: boolean;
  disableTextCapture?: boolean;
  debug?: boolean;
}

export interface HeapIoConfig {
  appId: string;
  enabled?: boolean;
  options?: HeapIoOptions;
}
