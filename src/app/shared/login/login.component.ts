import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  

  constructor(private router:Router, private api: ApiService) { }

  ngOnInit(): void {
  }

  login(f: NgForm): void{
    const login = f.value.login.trim().replace(" ", "")
    const password = f.value.password.trim().replace(" ", "")
    console.log(login)
    console.log(password)
    if(login != '' && password != ''){
      //this.api.loginUser(login, password)
    }
    //
    this.router.navigate(["home"])
  }

  register(){
    this.router.navigate(["register"])
  }
}
