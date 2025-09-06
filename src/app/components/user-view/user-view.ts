import { Component, computed } from '@angular/core';
import { UserService } from '../../services/users';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-view.html',
  styleUrl: './user-view.css'
})
export class UserView {

  constructor(private userService: UserService, private router: Router) { }

  detailsView = computed(() => this.userService.selectedUser());

  goBack() {
    this.userService.setSelectedUser(null);
    this.router.navigate(['/users']);
  }

}
