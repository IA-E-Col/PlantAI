import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProjetService} from "../../services/projet.service";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  cheminPlante = 'assets/plante.png';

  loginFormGroup! : FormGroup
  inscrFormGroup! : FormGroup

  constructor(private  fb: FormBuilder, private loginServ : LoginService, private router : Router) {
  }
  ngOnInit(): void {

    this.loginFormGroup = this.fb.group({
        email : this.fb.control( "yb@gmail.com", [Validators.required]),
        password : this.fb.control("azer", [Validators.required]),
      }
    );
    this.inscrFormGroup = this.fb.group({
        username : this.fb.control( "test", [Validators.required]),
        nom : this.fb.control( null, [Validators.required]),
        prenom : this.fb.control( null, [Validators.required]),
        email : this.fb.control( null, [Validators.required]),
        tel : null,
        departement : this.fb.control( null, [Validators.required]),
        password : this.fb.control(null, [Validators.required]),
        password1 : this.fb.control(null, [Validators.required]),
      }
    );

    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });

      signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });
    }
  }

  login() {
    let user =  this.loginFormGroup.value;
    this.loginServ.login(user).subscribe({
      next:(data)=>{
        if(data.password == user.password){
          this.loginServ.authenticateUser(data).subscribe({
            next:(data)=>{
              this.loginServ.authenticatedOK();
              this.router.navigateByUrl('/admin');
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

  inscr() {
    let user =  this.inscrFormGroup.value;
    if(user.password ===  user.password1  ) {
      this.loginServ.inscr(user).subscribe({
        next:(data) => {
          Swal.fire('Success', 'User created successfully!', 'success').then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to create user', 'error');
        }
      });
    }
    else {
      Swal.fire('Error', 'Passwords do not match', 'error');
    }
  }


}
