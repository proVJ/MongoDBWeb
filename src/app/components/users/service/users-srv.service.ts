import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/EntityClasses/user';
import { environment } from 'src/environments/environment';
import { EditUserModal } from '../modals/editUserModal';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  serviceURL = environment.serviceURL;

  constructor(private http: HttpClient) { }

  getUsers(showActiveUser: boolean = false) {
    return this.http.get<User[]>(this.serviceURL + "api/values/GetAllUsers?showActiveUser=" + showActiveUser);
  }

  GetUserByID(userID: string) {
    return this.http.get<User>(this.serviceURL + "api/values/GetUserByID?userID=" + userID);
  }

  saveUser(userData: EditUserModal): Observable<any> {

    return this.http.post(this.serviceURL + "api/values/SaveUser", userData);
  }

  DeleteUser(userID: string) {
    // return this.http.post(this.serviceURL + "api/values/DeleteUser", JSON.stringify({ userID: userID }));
    return this.http.get(this.serviceURL + "api/values/DeleteUser?userID=" + userID);

  }
}
