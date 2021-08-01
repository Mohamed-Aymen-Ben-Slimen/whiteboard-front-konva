import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth-service/auth.service';
import UserModel from '../model/User.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  joinRoom = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) {
    this.formGroup = this.formBuilder.group({
      email: new FormControl(''),
      password: new FormControl(''),
      roomname: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  login(createNewRoom: boolean): void {
    const formValue = this.formGroup.value;
    this.authService.login(formValue.email, formValue.password)
      .subscribe((response) => {
        console.log(response);
        const user = new UserModel();
        user.setToken(response.token);
        user.setUserName(`${response.name} ${response.lastName}`);
        let data: any;
        if (createNewRoom) {
          const roomname = this.makeid(8);
          user.setRoomname(roomname);
          data = {
            roomname,
            username: user.username
          };
        } else {
          user.setRoomname(formValue.roomname);
          data = {
            roomname: formValue.roomname,
            username: user.username
          };
        }
        this.authService.setUser(user);
        this.authService.sendComing(data);
        this.router.navigateByUrl('/board');
      });
  }

  makeid(length: number): string {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?-';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
