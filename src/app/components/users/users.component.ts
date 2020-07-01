import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {UsersService} from "../../services/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User, UserComponent} from "../user/user.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChildren(UserComponent) userComponentList: QueryList<UserComponent>;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  addUserForm: FormGroup;
  users: User[];

  // using an object instead of a boolean so when it's sent to a child's @Input it can trigger a change
  editAllUsers = {value: false};

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
    this.createAddUserForm();
  }

  private getUsers() {
    this.usersService.getUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        data => {
          this.users = data;
        },
        error => {
          this.users = [];
          console.log('Error fetching users');
        }
      )
  }

  private createAddUserForm() {
    this.addUserForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  addUser() {
    this.users.push({name: this.addUserForm.get('name').value});
    this.addUserForm.get('name').setValue('');
    this.addUserForm.get('name').setErrors(null);
  }

  deleteAll() {
    this.users = [];
  }

  editAll() {
    this.editAllUsers = {value: true};
  }

  saveAll() {
    this.userComponentList.forEach(userComponent => userComponent.updateUser());
  }

  userModified(userModifiedObject, index) {
    if (userModifiedObject?.action === 'delete') {
      this.users.splice(index, 1);
    } else if (userModifiedObject?.action === 'update' && this.editAllUsers.value) {
      this.editAllUsers = {value: false};
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
