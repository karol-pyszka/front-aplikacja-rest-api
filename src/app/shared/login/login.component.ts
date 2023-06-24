import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/_api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  

  constructor(private router:Router, private api: ApiService, private cookieService: CookieService, private toastr: ToastrService) { }

  ngOnInit(): void {
    if(this.cookieService.get("userToken")){
      this.cookieService.delete("userToken")
    }
  }

  login(f: NgForm): void{
    this.api.loginUser(f.value.login.trim().replace(" ", ""), f.value.password.trim().replace(" ", "")).subscribe({
      next: (token) => {
        this.toastr.success("Udało się zalogować");
        this.cookieService.set("userToken", token.token)
        this.router.navigate(["home"]).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        this.toastr.error("Błędny email lub hasło","Błąd");
      }
    });
  }

  register(){
    this.router.navigate(["register"])
  }
}
