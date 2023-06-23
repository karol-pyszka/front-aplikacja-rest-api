import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_api/api.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  constructor(private router:Router, private api: ApiService, private toastr: ToastrService, private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  register(f: NgForm): void{
    let user: User = {
      firstname: f.value.name.trim().replace(" ", ""),
      lastname: f.value.surname.trim().replace(" ", ""),
      email: f.value.login.trim().replace(" ", ""),
      password: f.value.password.trim().replace(" ", "")
    }
    this.api.registerUser(user).subscribe({
      next: (token) => {
        this.toastr.success("Udało się utworzyć konto");
        this.cookieService.set("userToken", token.token)
        this.router.navigate(["home"]);
      },
      error: (error) => {
        this.toastr.error("Istnieje użytkownik o podanym adresie email!","Błąd");
        console.log("sss")
      }
    });
  }

}
