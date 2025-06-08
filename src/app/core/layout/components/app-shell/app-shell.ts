import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar";
import { Topbar } from "../topbar/topbar";
import { CardModule } from 'primeng/card';
import { WelcomeCard } from '../welcome-card/welcome-card';
import { RoomListComponent } from '../room-list/room-list.component';

@Component({
  selector: 'app-app-shell',
  imports: [SidebarComponent, Topbar, CardModule, WelcomeCard, RoomListComponent],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss'
})
export class AppShell {

}
