import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { BillingComponent } from './components/billing/billing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { EmergencyComponent } from './components/emergency/emergency.component';
import { LabReportComponent } from './components/lab-report/lab-report.component';
import { LoginComponent } from './components/login/login.component';
import { PatientsComponent } from './components/patients/patients.component';
import { PharmacyComponent } from './components/pharmacy/pharmacy.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'doctors', component: DoctorsComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'emergency', component: EmergencyComponent },
  { path: 'lab-reports', component: LabReportComponent },
  { path: 'pharmacy', component: PharmacyComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
