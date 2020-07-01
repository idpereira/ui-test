import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {UserComponent} from './user.component';
import {Component, ViewChild} from "@angular/core";
import {mockUsers} from "../../../jestGlobalMocks";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

describe('UserComponent', () => {
  let hostTestingComponent: HostTestingComponent;
  let hostTestingFixture: ComponentFixture<HostTestingComponent>;
  let component: UserComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent, HostTestingComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    hostTestingFixture = TestBed.createComponent(HostTestingComponent);
    hostTestingComponent = hostTestingFixture.componentInstance;
    // hostTestingComponent.users = mockUsers;
    // hostTestingComponent.user = hostTestingComponent.users[0];
    hostTestingFixture.detectChanges();

    component = hostTestingComponent.userComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Form should be valid', () => {
    expect(component.userForm.valid).toBeTruthy();
  });

  it('Edit and Delete buttons should be enabled and Save should not exist', () => {
    const editButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.edit-button');
    const deleteButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.delete-button');
    const saveButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.save-button');

    expect(editButton.disabled).toBeFalsy();
    expect(deleteButton.disabled).toBeFalsy();
    expect(saveButton).toBeNull();
  });

  it('Clicking Edit button should make it and Delete disappear and Save be shown', () => {
    let editButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.edit-button');
    let deleteButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.delete-button');
    let saveButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.save-button');

    expect(editButton.disabled).toBeFalsy();
    expect(deleteButton.disabled).toBeFalsy();
    expect(saveButton).toBeNull();

    editButton.click();
    hostTestingFixture.detectChanges();

    editButton = hostTestingFixture.elementRef.nativeElement.querySelector('.edit-button');
    deleteButton = hostTestingFixture.elementRef.nativeElement.querySelector('.delete-button');
    saveButton = hostTestingFixture.elementRef.nativeElement.querySelector('.save-button');

    expect(editButton).toBeNull();
    expect(deleteButton).toBeNull();
    expect(saveButton.disabled).toBeFalsy();
  });

  it('Clicking Edit should call editUser()', () => {
    spyOn(component, 'editUser').and.callThrough();

    expect(component.isEditing).toBeFalsy();

    const editButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.edit-button');
    editButton.click();
    hostTestingFixture.detectChanges();

    expect(component.editUser).toHaveBeenCalled();
    expect(component.isEditing).toBeTruthy();
  });

  it('Clicking Delete should emit an event', () => {
    spyOn(component, 'deleteUser').and.callThrough();
    spyOn(component.userModified, 'emit').and.callThrough();
    spyOn(hostTestingComponent, 'userModified').and.callThrough();

    expect(component.isEditing).toBeFalsy();

    const deleteButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.delete-button');
    deleteButton.click();
    hostTestingFixture.detectChanges();

    const action = {action: 'delete'};
    expect(component.deleteUser).toHaveBeenCalled();
    expect(component.userModified.emit).toHaveBeenCalledWith(action);
    expect(hostTestingComponent.userModified).toHaveBeenCalledWith(action);
  });

  it('Updating user should modify their name and emit an event', () => {
    spyOn(component, 'updateUser').and.callThrough();
    spyOn(component.userModified, 'emit').and.callThrough();
    spyOn(hostTestingComponent, 'userModified').and.callThrough();
    hostTestingFixture.detectChanges();

    expect(component.isEditing).toBeFalsy();
    expect(component.userForm.get('name').value).toBe('John Doe');

    const editButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.edit-button');
    editButton.click();
    hostTestingFixture.detectChanges();

    const newName = 'Johnny Doe';
    component.userForm.get('name').setValue(newName);
    hostTestingFixture.detectChanges();

    expect(component.isEditing).toBeTruthy();

    const saveButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.save-button');
    saveButton.click();
    hostTestingFixture.detectChanges();

    const action = {action: 'update', newValue: newName};
    expect(component.updateUser).toHaveBeenCalled();
    expect(component.isEditing).toBeFalsy();
    expect(component.userModified.emit).toHaveBeenCalledWith(action);
    expect(hostTestingComponent.userModified).toHaveBeenCalledWith(action);
  });

  it('Save button should be disabled', () => {
    const editButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.edit-button');
    editButton.click();
    hostTestingFixture.detectChanges();

    let saveButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.save-button');
    expect(saveButton.disabled).toBeFalsy();

    component.userForm.get('name').setValue('');
    hostTestingFixture.detectChanges();

    saveButton = hostTestingFixture.elementRef.nativeElement.querySelector('.save-button');
    expect(saveButton.disabled).toBeTruthy();
  });

  it('Modifying editAllUsers in parent component should change User component', () => {
    let editButton: HTMLInputElement = hostTestingFixture.elementRef.nativeElement.querySelector('.edit-button');

    expect(component.isEditing).toBeFalsy();
    expect(hostTestingComponent.editAllUsers.value).toBeFalsy();
    expect(editButton).not.toBeNull();

    hostTestingComponent.editAllUsers = {value: true};
    hostTestingFixture.detectChanges();

    editButton = hostTestingFixture.elementRef.nativeElement.querySelector('.edit-button');

    expect(component.isEditing).toBeTruthy();
    expect(hostTestingComponent.editAllUsers.value).toBeTruthy();
    expect(editButton).toBeNull();
  });

  // HostTestingComponent used to pass user and edit values to UserComponent
  @Component({
    selector: 'app-test-host-component',
    template: '<app-user [user]="user" [edit]="editAllUsers" (userModified)="userModified($event)"></app-user>'
  })
  class HostTestingComponent {
    @ViewChild(UserComponent, {static: true})
    userComponent: UserComponent;

    users = mockUsers;
    user = this.users[0];
    editAllUsers = {value: false};

    userModified = (event) => {
    };
  }
});
