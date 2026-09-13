import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
})
export class ClientHeaderComponent {}
