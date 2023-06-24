import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public userRole: any
  public isLogin = false

  constructor(private cookieService: CookieService){}

  ngOnInit(): void {
    if(this.cookieService.check("userToken")){
      this.isLogin = true
      let jwtData = this.cookieService.get("userToken").split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      this.userRole = decodedJwtData.role
    }
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
  }
  title = 'frontend-app-lab';
}