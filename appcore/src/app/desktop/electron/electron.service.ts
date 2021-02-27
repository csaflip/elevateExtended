import { Inject, Injectable } from "@angular/core";
import { LoggerService } from "../../shared/services/logging/logger.service";
import { Platform } from "@elevate/shared/enums";
import { ElevateException } from "@elevate/shared/exceptions";
import { OpenDialogSyncOptions } from "electron";
import { name as appName } from "../../../../../desktop/package.json";
import { BridgeApi } from "@elevate/shared/electron";

@Injectable()
export class ElectronService {
  public readonly api: BridgeApi;

  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {
    this.forwardHtmlLinkClicksToDefaultBrowser();
    this.api = (window as any).api as BridgeApi;
  }

  public forwardHtmlLinkClicksToDefaultBrowser(): void {
    document.querySelector("body").addEventListener("click", (event: any) => {
      if (event.target.tagName.toLowerCase() === "a" && !event.target.attributes.download) {
        event.preventDefault();
        this.openExternalUrl(event.target.href);
      }
    });
  }

  public userDirectorySelection(): Promise<string> {
    const options: OpenDialogSyncOptions = {
      properties: ["openDirectory", "showHiddenFiles"]
    };
    return this.api.showOpenDialogSync(options).then(paths => {
      return paths && paths.length > 0 ? paths[0] : null;
    });
  }

  public openExternalUrl(url: string): void {
    this.api.shell.openExternal(url);
  }

  public openItem(path: string): void {
    this.api.shell.openPath(path);
  }

  public showItemInFolder(itemPath: string): void {
    this.existsSync(itemPath).then(exists => {
      if (!exists) {
        throw new ElevateException("Item path do not exists");
      }
      this.api.shell.showItemInFolder(itemPath);
    });
  }

  public openLogsFolder(): void {
    this.getLogsPath().then(path => {
      this.openItem(path);
    });
  }

  public openAppDataFolder(): void {
    this.getAppDataPath().then(path => {
      this.openItem(path);
    });
  }

  public minimizeApp(): void {
    this.api.minimizeApp().then(() => this.logger.debug("Minimize handled"));
  }

  public enableFullscreen(): Promise<void> {
    return this.api.enableFullscreen().then(() => this.logger.debug("Fullscreen enabled"));
  }
  public disableFullscreen(): Promise<void> {
    return this.api.disableFullscreen().then(() => this.logger.debug("Fullscreen disabled"));
  }

  public isFullscreen(): Promise<boolean> {
    return this.api.isFullscreen();
  }

  public closeApp(): void {
    this.api.closeApp().then(() => this.logger.debug("Close handled"));
  }

  public restartApp(): void {
    this.api.restartApp().then(() => this.logger.debug("Restart handled"));
  }

  public resetApp(): void {
    this.api.resetApp().then(() => this.logger.debug("Reset handled"));
  }

  public getPath(
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
  ): Promise<string> {
    return this.api.getPath(name);
  }

  public getAppDataPath(): Promise<string> {
    return this.getPath("appData").then(pathResult => {
      return `${pathResult}/${appName}`;
    });
  }

  public getLogsPath(): Promise<string> {
    return this.getAppDataPath().then(path => {
      return Promise.resolve(`${path}/logs`);
    });
  }

  public existsSync(path: string): Promise<boolean> {
    return this.api.existsSync(path);
  }

  public isDirectory(path: string): Promise<boolean> {
    return this.existsSync(path).then(exists => {
      if (!exists) {
        return Promise.resolve(false);
      } else {
        return this.api.isDirectory(path);
      }
    });
  }

  public isFile(path: string): Promise<boolean> {
    return this.existsSync(path).then(exists => {
      if (!exists) {
        return Promise.resolve(false);
      } else {
        return this.api.isFile(path);
      }
    });
  }

  public getPlatform(): Platform {
    return this.api.nodePlatform as Platform;
  }

  public isWindows(): boolean {
    return this.api.nodePlatform === Platform.WINDOWS;
  }

  public isLinux(): boolean {
    return this.api.nodePlatform === Platform.LINUX;
  }

  public isMacOS(): boolean {
    return this.api.nodePlatform === Platform.MACOS;
  }
}
