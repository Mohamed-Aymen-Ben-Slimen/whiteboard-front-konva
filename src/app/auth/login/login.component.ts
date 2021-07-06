import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) {
    this.formGroup = this.formBuilder.group({
      username: new FormControl(''),
      roomname: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    this.router.navigateByUrl('/board')
      .then(
        () => {
          this.authService.sendComing(this.formGroup.value);
        }
      );
  }

}
