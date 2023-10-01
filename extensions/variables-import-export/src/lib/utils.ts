import type {CodeMessage} from './types';

export function assertNever(_value: never, msg: string): never {
  throw new Error(msg);
}

export function postCodeMessage(message: CodeMessage): void {
  parent.postMessage({pluginMessage: message}, '*');
}
