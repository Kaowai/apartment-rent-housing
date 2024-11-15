import { Component, Input, OnInit } from '@angular/core';
import { Cities } from '../cities';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  constructor(private route: Router) {
    
  }
  @Input() location: Cities | undefined
}
