import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ElectronService } from "../../shared/services/electron/electron.service";
import { DesktopVersionsProvider } from "../../shared/services/versions/impl/desktop-versions-provider.service";
import { VERSIONS_PROVIDER, VersionsProvider } from "../../shared/services/versions/versions-provider.interface";

@Component({
    selector: "app-guard",
    templateUrl: "./desktop-pre-run-guard-dialog.component.html",
    styleUrls: ["./desktop-pre-run-guard-dialog.component.scss"]
})
export class DesktopPreRunGuardDialogComponent implements OnInit {

    public athleteMachineId: string;
    public releaseUrl: string;

    constructor(public electronService: ElectronService,
                @Inject(VERSIONS_PROVIDER) public versionsProvider: VersionsProvider,
                @Inject(MAT_DIALOG_DATA) athleteMachineId: string) {
        this.athleteMachineId = athleteMachineId;
    }

    public ngOnInit(): void {
        this.releaseUrl = (<DesktopVersionsProvider> this.versionsProvider).getLatestReleaseUrl();
    }

    public closeApp(): void {
        this.electronService.remote.getCurrentWindow().close();
    }
}
