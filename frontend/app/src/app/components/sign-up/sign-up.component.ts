import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router, RouterLink} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{

  inscrFormGroup! : FormGroup

  constructor(private  fb: FormBuilder, private loginServ : LoginService, private router : Router) {
  }
  ngOnInit(): void {

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