import { DashboardService } from './../../services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { USER_COLS } from '../../constants/index';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  cols: any[];

  users: User[];
  isAdd = true;
  label: string;
  status: string;
  showAdd = true;
  header = 'Users';

  accessToken = '3847af13-fc47-4c99-a26c-42b40dbec589';
  constructor(private _dashboardservice: DashboardService) { }

  ngOnInit() {
    this.cols = USER_COLS;
    this.getUsers();
  }

  public getUsers(): void {
    this._dashboardservice.getUsers(this.accessToken).then(data => {
      this.users = data;
    });
  }

  onstateChange(event): void {
    console.log(event);
  }

  onFormDataSave(event): void {
    const type = event.action;
    // tslint:disable-next-line: variable-name
    this.doOperation(event).then(_data => {
      this.getUsers();
    });
  }

  doOperation(event): Promise<any> {
    const type = event.action;
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise( resolve => {
      switch (type) {
        case 'Add' :
          delete event.data.id;
          this._dashboardservice.addUser(event.data).then(data => {
            resolve(data);
          });
          break;
        case 'Update' :
              this._dashboardservice.updateUser(event.data).then(data => {
                resolve(data);
              });
              break;
        case 'delete' :
            this._dashboardservice.deleteUser(event.data).then(data => {
              resolve(data);
            });
            break;
         case '':
           resolve({});
           break;
      }
    });
  }



}
