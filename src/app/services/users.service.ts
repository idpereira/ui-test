import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../components/user/user.component";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersUrl = 'https://uitest.free.beeceptor.com/usernames';

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.usersUrl);
  }
}
