import { Component, inject, input, output, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { UserStore } from '../../store/user.store';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

type ListGroupSelectMode = 'select' | 'delete' | 'create' | 'add' | 'remove';
type ListGroupSelectUsage = 'create' | 'assign';

@Component({
  selector: 'app-list-group-select',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    FormsModule,
    MatIconModule,
    TitleCasePipe,
    MatInputModule,
  ],
  templateUrl: './list-group-select.component.html',
  styleUrl: './list-group-select.component.scss',
})
export class ListGroupSelectComponent {
  usage = input.required<ListGroupSelectUsage>();
  listGroupName = signal('');
  listGroups = inject(UserStore).gameListGroups;
  listGroupDeleted = output<string>();
  listGroupAdded = output<string>();
  listGroupCreated = output<string>();
  listGroupSelected = output<string>();
  listGroupRemoved = output<string>();
  userService = inject(UserService);
  mode = signal<ListGroupSelectMode>('select');
  // Set mode to 'add' onInit if in assign usage

  selectGroup(): void {
    this.listGroupSelected.emit(this.listGroupName());
  }

  handleGroupSelection(): void {
    if (this.mode() === 'select') {
      this.listGroupSelected.emit(this.listGroupName());
    } else if (this.mode() === 'create') {
      this.listGroupCreated.emit(this.listGroupName());
    } else if (this.mode() === 'add') {
      this.listGroupAdded.emit(this.listGroupName());
    } else if (this.mode() === 'remove') {
      this.listGroupRemoved.emit(this.listGroupName());
    } else if (this.mode() === 'delete') {
      this.listGroupDeleted.emit(this.listGroupName());
    }
  }
}
