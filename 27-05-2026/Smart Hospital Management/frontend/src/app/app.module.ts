import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { BillingComponent } from './components/billing/billing.component';
import { EmergencyComponent } from './components/emergency/emergency.component';
import { LabReportComponent } from './components/lab-report/lab-report.component';
import { PharmacyComponent } from './components/pharmacy/pharmacy.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    PatientsComponent,
    DoctorsComponent,
    AppointmentsComponent,
    BillingComponent,
    EmergencyComponent,
    LabReportComponent,
    PharmacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
