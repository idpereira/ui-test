import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export interface User {
  name: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Input() edit;

  @Output() userModified = new EventEmitter();

  userForm: FormGroup;
  isEditing = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('edit' in changes) {
      this.isEditing = this.edit?.value;
    }
  }

  private createForm() {
    this.userForm = this.formBuilder.group({
      name: [this.user?.name, Validators.required]
    });
  }

  editUser() {
    this.isEditing = true;
  }

  updateUser() {
    if (this.userForm.valid) {
      this.isEditing = false;
      this.user.name = this.userForm.get('name').value;
      this.userModified.emit({action: 'update', newValue: this.user.name});
    }
  }

  deleteUser() {
    this.userModified.emit({action: 'delete'});
  }
}
