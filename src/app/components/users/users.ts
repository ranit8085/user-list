import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/users';
import { User } from '../../models/users';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {

  users = signal<User[]>([]);
  paginatedUsers = signal<User[]>([]);
  keyNames = <string[]>([]);
  selectedUser: User | null = null;
  userView: User | null = null;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  editingIndex = signal<number | null>(null);

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.fetchUsersList()
      .subscribe((data: User[]) => {
        this.users.set(JSON.parse(JSON.stringify(data)));
        localStorage.setItem('users', JSON.stringify(this.users()));
        this.keyNames = this.users().length ? Object.keys(this.users()[0]) : [];
        this.totalPages = Math.ceil(this.users().length / this.itemsPerPage);
        this.paginatedUsers.set(this.users().slice(0, this.itemsPerPage))
      }
      );
  }

  selectUser(user: User) {
    if (this.editingIndex() === null) {
      this.userView = this.users()?.find((u: User) => u.id === user.id) || null;
      this.userService.setSelectedUser(this.userView);
      this.router.navigate(['/user-view', user.id]);
    }
  }

  editUser(user: User, index: number, row: HTMLTableRowElement) {
    if (!this.selectedUser) {
      this.selectedUser = this.users()?.find(u => u.id === user.id) || null;
      this.editingIndex.set(this.editingIndex() === index ? null : index);
      setTimeout(() => {
        row.focus(), 5000;
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  setPaginatedUsers() {
    this.paginatedUsers.set(this.users().slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    ));
  }

  previousPage() {
    this.currentPage = Math.max(this.currentPage - 1, 1);
    this.selectedUser = null;
    this.editingIndex.set(null);
    this.setPaginatedUsers()

  }

  nextPage() {
    this.currentPage = Math.min(this.currentPage + 1, this.totalPages);
    this.selectedUser = null;
    this.editingIndex.set(null);
    this.setPaginatedUsers()
  }

  cancelEdit() {
    this.selectedUser = null;
    this.editingIndex.set(null);
    this.users.set(localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users') || '[]') : []);
    this.setPaginatedUsers();
  }

  saveUser() {
    if (this.selectedUser && this.editingIndex() !== null) {
      const index = this.users().findIndex(u => u.id === this.selectedUser?.id);
      if (index !== -1) {
        const updatedUsers = [...this.users()];
        updatedUsers[index] = this.selectedUser;
        this.users.set(updatedUsers);
        this.setPaginatedUsers();
      }
      this.selectedUser = null;
      this.editingIndex.set(null);
    }
  }
}
