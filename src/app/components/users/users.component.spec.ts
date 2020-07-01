import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {UsersComponent} from './users.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {UserComponent} from "../user/user.component";
import {UsersService} from "../../services/users.service";
import {mockUsername, mockUserService} from "../../../jestGlobalMocks";

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersComponent, UserComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;

    spyOn<any>(component, 'getUsers').and.callThrough();
    spyOn<any>(component, 'createAddUserForm').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['getUsers']).toHaveBeenCalled();
    expect(component['createAddUserForm']).toHaveBeenCalled();
  });

  it('Form should be invalid', () => {
    expect(component.addUserForm.valid).toBeFalsy();
  });

  it('Add button should be disabled', () => {
    const addButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#add');
    expect(addButton.disabled).toBeTruthy();
  });

  it('Form should be valid', () => {
    component.addUserForm.get('name').setValue(mockUsername);
    fixture.detectChanges();

    expect(component.addUserForm.valid).toBeTruthy();
  });

  it('Add button should be enabled after filling "Add New User" form', () => {
    const addButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#add');

    component.addUserForm.get('name').setValue(mockUsername);
    fixture.detectChanges();

    expect(component.addUserForm.valid).toBeTruthy();
    expect(addButton.disabled).toBeFalsy();
  });

  it('Adding a user should call addUser() and make it appear in the table', () => {
    const addButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#add');
    spyOn(component, 'addUser').and.callThrough();
    expect(component.users.length).toBe(2);

    component.addUserForm.get('name').setValue(mockUsername);
    fixture.detectChanges();

    expect(component.addUserForm.valid).toBeTruthy();
    expect(addButton.disabled).toBeFalsy();

    addButton.click();
    fixture.detectChanges();

    expect(component.addUser).toHaveBeenCalled();
    expect(component.users.length).toBe(3);
  });

  it('Edit All and Delete All buttons should be enabled and Save All should not exist', () => {
    const editAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#edit-all');
    const deleteAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#delete-all');
    const saveAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#save-all');

    expect(editAllButton.disabled).toBeFalsy();
    expect(deleteAllButton.disabled).toBeFalsy();
    expect(saveAllButton).toBeNull();
  });

  it('Clicking Edit All button should make it and Delete All disappear and Save All be shown', () => {
    let editAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#edit-all');
    let deleteAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#delete-all');
    let saveAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#save-all');

    expect(editAllButton.disabled).toBeFalsy();
    expect(deleteAllButton.disabled).toBeFalsy();
    expect(saveAllButton).toBeNull();

    editAllButton.click();
    fixture.detectChanges();

    editAllButton = fixture.elementRef.nativeElement.querySelector('#edit-all');
    deleteAllButton = fixture.elementRef.nativeElement.querySelector('#delete-all');
    saveAllButton = fixture.elementRef.nativeElement.querySelector('#save-all');

    expect(editAllButton).toBeNull();
    expect(deleteAllButton).toBeNull();
    expect(saveAllButton.disabled).toBeFalsy();
  });

  it('Clicking Delete All should remove all users and make Edit All and Delete All buttons disappear', () => {
    let deleteAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#delete-all');
    spyOn(component, 'deleteAll').and.callThrough();
    expect(component.users.length).toBe(2);

    deleteAllButton.click();
    fixture.detectChanges();

    const editAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#edit-all');
    deleteAllButton = fixture.elementRef.nativeElement.querySelector('#delete-all');

    expect(editAllButton).toBeNull();
    expect(deleteAllButton).toBeNull();
    expect(component.deleteAll).toHaveBeenCalled();
    expect(component.users.length).toBe(0);
  });

  it('Clicking Save All button should call saveAll() and updateUser() in child components', () => {
    spyOn(component, 'saveAll').and.callThrough();
    spyOn(component, 'userModified').and.callThrough();
    component.userComponentList.forEach(userComponent => spyOn(userComponent, 'updateUser').and.callThrough());
    const editAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#edit-all');

    editAllButton.click();
    fixture.detectChanges();

    const saveAllButton: HTMLInputElement = fixture.elementRef.nativeElement.querySelector('#save-all');

    saveAllButton.click();
    fixture.detectChanges();

    expect(component.saveAll).toHaveBeenCalled();
    expect(component.userModified).toHaveBeenCalledTimes(2);
    component.userComponentList.forEach(userComponent => expect(userComponent.updateUser).toHaveBeenCalled());
  });
});
