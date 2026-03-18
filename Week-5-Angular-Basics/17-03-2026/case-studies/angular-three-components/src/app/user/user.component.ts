import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userName = 'Alex Kumar';
  userRole = 'Application User';
  userStatus = 'Active';

}
