import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../components/header/header';

@Component({
  imports: [RouterLink, Header],
  selector: 'app-landing-page',
  styleUrl: './landing-page.scss',
  templateUrl: './landing-page.html',
})
export class LandingPage {}
