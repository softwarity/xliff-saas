import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import '../../web-components/icon';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './how-it-works.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HowItWorksComponent {}