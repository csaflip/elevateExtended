import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutesModel } from "../models/app-routes.model";
import { GlobalSettingsComponent } from "../../global-settings/global-settings.component";
import { ZonesSettingsComponent } from "../../zones-settings/zones-settings.component";
import { DonateComponent } from "../../donate/donate.component";
import { ShareComponent } from "../../share/share.component";
import { ReportComponent } from "../../report/report.component";
import { AdvancedMenuComponent } from "../../advanced-menu/advanced-menu.component";
import { FaqComponent } from "../../faq/faq.component";
import { ActivitiesComponent } from "../../activities/activities.component";
import { EnvTarget } from "../enums/env-target";
import { environment } from "../../../environments/environment";


@NgModule({
	imports: [
		RouterModule.forRoot(AppRoutingModule.routes(), {enableTracing: false, useHash: true})
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {

	public static routes(): Routes {

		const routes: Routes = [
			{
				path: AppRoutesModel.activities,
				component: ActivitiesComponent
			},
			{
				path: AppRoutesModel.fitnessTrend,
				loadChildren: "../../fitness-trend/fitness-trend.module#FitnessTrendModule"
			},
			{
				path: AppRoutesModel.yearProgressions,
				loadChildren: "../../year-progress/year-progress.module#YearProgressModule"
			},
			{
				path: AppRoutesModel.globalSettings,
				component: GlobalSettingsComponent
			},
			{
				path: AppRoutesModel.athleteSettings,
				loadChildren: "../../athlete-settings/athlete-settings.module#AthleteSettingsModule"
			},
			{
				path: AppRoutesModel.zonesSettings,
				component: ZonesSettingsComponent
			},
			{
				path: AppRoutesModel.zonesSettings + "/:zoneValue",
				component: ZonesSettingsComponent
			},
			{
				path: AppRoutesModel.donate,
				component: DonateComponent
			},
			{
				path: AppRoutesModel.releasesNotes,
				loadChildren: "../../releases-notes/releases-notes.module#ReleasesNotesModule"
			},
			{
				path: AppRoutesModel.share,
				component: ShareComponent
			},
			{
				path: AppRoutesModel.report,
				component: ReportComponent
			},
			{
				path: AppRoutesModel.advancedMenu,
				component: AdvancedMenuComponent
			},
			{
				path: AppRoutesModel.frequentlyAskedQuestions,
				component: FaqComponent
			},
			{
				path: "", redirectTo: AppRoutesModel.activities, pathMatch: "full"
			},
		];

		if (environment.target === EnvTarget.DESKTOP) {
			routes.push({
				path: AppRoutesModel.connectors,
				loadChildren: "../../connectors/connectors.module#ConnectorsModule"
			});
		}

		return routes;
	}

}
