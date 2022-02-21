import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/EntityClasses/user';
import { EditUserModal } from './modals/editUserModal';
import { UsersService } from './service/users-srv.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  userList!: User[];
  showUser: boolean = false;
  isNewUser: boolean = false;
  editUserID: string = '';
  isInActiveUserChecked: boolean = false;

  userForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    phone: [''],
    isActive: [''],
  });

  constructor(private userservice: UsersService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.showAllUsers();
  }

  showInactive(result: boolean) {
    // this.showInativeUser = !this.showInativeUser;
    this.showAllUsers(result);
    this.isInActiveUserChecked = !this.isInActiveUserChecked;
  }

  showAllUsers(isActive: boolean = true) {
    this.subscription = this.userservice.getUsers(isActive).subscribe((data: User[]) => {
      this.userList = data;
    });
  }

  showEditUser(userID: string) {
    this.GetUserByID(userID);
    this.editUserID = userID;
    this.showNewUser(true);
  }

  GetUserByID(userID: string) {
    this.subscription = this.userservice.GetUserByID(userID).subscribe((data: User) => {
      console.log(data);
      this.userForm.patchValue(data);
    });
  }

  showNewUser(value: boolean) {
    this.showUser = value;
  }

  SaveUser(form: FormGroup) {
    let user = new User();
    user.firstName = form.value.firstName;
    user.lastName = form.value.lastName;
    user.email = form.value.email;
    user.phone = form.value.phone;
    user.isActive = form.value.isActive;


    let data = new EditUserModal();
    data.UserID = this.editUserID;
    data.user = user;

    this.subscription = this.userservice.saveUser(data).subscribe(
      (response) => {
        this.userForm.reset();
        this.showNewUser(false);
        this.showAllUsers();
        this.editUserID = '';
        this.isInActiveUserChecked = false;
      }, (error) => {
        console.log('error caught in component');
      });
  }

  deleteUser(userID: string) {
    let result = confirm("Do You want to Delete This User");
    // console.log(result);
    if (result) {
      this.subscription = this.userservice.DeleteUser(userID).subscribe((data) => {
        this.showAllUsers();
      });
    }
  }

  CancelForm() {
    this.showNewUser(false);
    this.userForm.reset();
    this.editUserID = '';
  }

  AddNewUser() {
    this.userForm.reset();
    this.editUserID = '';
    this.showNewUser(true);
   
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
