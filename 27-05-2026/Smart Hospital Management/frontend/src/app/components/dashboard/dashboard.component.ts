import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { Statistics } from '../../core/models/statistics.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: Statistics | null = null;
  error = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStatistics().subscribe({
      next: data => this.stats = data,
      error: err => this.error = err.error?.message || 'Unable to load statistics.'
    });
  }
}
