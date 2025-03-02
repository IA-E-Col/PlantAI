import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router, RouterLink} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginFormGroup! : FormGroup

  constructor(private  fb: FormBuilder, private loginServ : LoginService, private router : Router) {
  }
  ngOnInit(): void {

    this.loginFormGroup = this.fb.group({
        email : this.fb.control( "admin@example.com", [Validators.required]),
        password : this.fb.control("admin123", [Validators.required]),
      }
    );
    
  }

  login() {
    let user =  this.loginFormGroup.value;
    this.loginServ.login(user).subscribe({
      next:(data)=>{
        if(data.password == user.password){
          this.loginServ.authenticateUser(data).subscribe({
            next:(data)=>{
              this.loginServ.authenticatedOK();
              this.router.navigateByUrl('/admin/corpus');
            },
            error:err => {
              Swal.fire('Error', 'Failed to authenticate user', 'error');
            }
          });
        }
        else{
          Swal.fire('Error', 'Incorrect password', 'error');
        }
      },
      error:err =>{
        Swal.fire('Error', 'User does not exist', 'error');
      }
    });
  }



}
