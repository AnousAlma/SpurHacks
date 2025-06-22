/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export interface FocusPacket {
  focused: boolean;
  ts: number;
}

export interface ExamApi {
  onFocusState: (cb: (pkt: FocusPacket) => void) => void;
  reportVisibility: (visible: boolean) => void;
  runCode: (lang: string, src: string, idToken: string) => Promise<string>;
  askAssistant: (question: string, context: string, idToken: string) => Promise<{ answer: string }>;
}

const api: ExamApi = {
  onFocusState(cb) {
    ipcRenderer.on('focus-state', (_e, data: FocusPacket) => cb(data));
  },

  reportVisibility(visible) {
    ipcRenderer.send('page-visibility', { visible, ts: Date.now() });
  },

  runCode(lang, src, idToken) {
    return ipcRenderer.invoke('run-code', { lang, src, token: idToken });
  },

  askAssistant: (question: string, context: string, idToken: string) =>
    ipcRenderer.invoke('ai-ask', { question, context, idToken }),

};

contextBridge.exposeInMainWorld('examApi', api);

export type ElectronHandler = typeof electronHandler;

