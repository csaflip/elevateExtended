import { ClearStorageDataOptions, IpcRendererEvent, OpenDialogSyncOptions, Shell } from "electron";
import { Channel } from "./channels.enum";

export interface BridgeApi {
  // App actions
  minimizeApp: () => Promise<void>;
  enableFullscreen: () => Promise<void>;
  disableFullscreen: () => Promise<void>;
  isFullscreen: () => Promise<boolean>;
  closeApp: () => Promise<void>;
  restartApp: () => Promise<void>;
  resetApp: () => Promise<void>;
  invoke: (channel: Channel, ...args: any[]) => Promise<any>;
  receive: (channel: Channel, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;

  // File operations
  existsSync: (path: string | URL) => Promise<boolean>;
  isDirectory: (path: string | URL) => Promise<boolean>;
  isFile: (path: string | URL) => Promise<boolean>;

  // Remote electron stuff
  electronVersion: string;
  nodePlatform: string;
  shell: Shell;
  showOpenDialogSync: (options: OpenDialogSyncOptions) => Promise<string[] | undefined>;
  clearStorageData: (options?: ClearStorageDataOptions) => Promise<void>;
  getPath: (
    name:
      | "home"
      | "appData"
      | "userData"
      | "cache"
      | "temp"
      | "exe"
      | "module"
      | "desktop"
      | "documents"
      | "downloads"
      | "music"
      | "pictures"
      | "videos"
      | "recent"
      | "logs"
      | "pepperFlashSystemPlugin"
      | "crashDumps"
  ) => Promise<string>;
}
