import { Inject, Injectable } from "@angular/core";
import { OpenResourceResolver } from "../open-resource-resolver";
import { ElectronService } from "../../../../desktop/electron/electron.service";
import { ActivityService } from "../../activity/activity.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AppRoutes } from "../../../models/app-routes";
import { ConnectorType } from "@elevate/shared/sync";

@Injectable()
export class DesktopOpenResourceResolver extends OpenResourceResolver {
  constructor(
    @Inject(ElectronService) protected readonly electronService: ElectronService,
    @Inject(ActivityService) protected readonly activityService: ActivityService,
    @Inject(Router) protected readonly router: Router,
    @Inject(MatSnackBar) protected readonly snackBar: MatSnackBar
  ) {
    super(snackBar);
  }

  public openLink(path: string): void {
    // Check if not a web url and verify file exists on file system
    if (!path.startsWith("http") && !this.electronService.existsSync(path)) {
      this.snackBar.open(`Path to file "${path}" do not exists`, "Close");
      return;
    }

    this.electronService.openExternalUrl(path);
  }

  public openActivity(id: number | string): void {
    this.router.navigate([`${AppRoutes.activity}/${id}`]);
  }

  public openSourceActivity(id: number | string, sourceType: ConnectorType): void {
    this.activityService.getById(id).then(activity => {
      if (activity) {
        if (sourceType === ConnectorType.STRAVA && activity.extras?.strava_activity_id > 0) {
          this.openStravaActivity(activity.extras.strava_activity_id);
        } else if (sourceType === ConnectorType.FILE && activity.extras?.fs_activity_location?.path) {
          const itemPath = activity.extras.fs_activity_location.path;
          try {
            this.showItemInFolder(itemPath);
          } catch (err) {
            this.snackBar.open(`Activity file "${itemPath}" don't exists.`, "Close");
          }
        } else {
          this.snackBar.open(`Unable to open activity.`, "Close");
        }
      } else {
        this.snackBar.open(`Activity with id ${id} not found`, "Close");
      }
    });
  }

  public showItemInFolder(itemPath: string): void {
    this.electronService.showItemInFolder(itemPath);
  }
}
