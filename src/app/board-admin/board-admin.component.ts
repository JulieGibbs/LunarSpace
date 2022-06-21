import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TransferService } from '../_services/transfer.service';
import { contractAddress } from '../../environments/config';
import { AccountInfo, validateAccountInfo } from '../app.component';

interface User {
  address: string;
  email: string;
  name: string;
}
@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css'],
})
export class BoardAdminComponent implements OnInit {
  content?: any;
  whiteLists: { [key: string]: boolean } = {};
  account: string;
  isAdmin: boolean;

  constructor(
    private userService: UserService,
    private transferService: TransferService
  ) {}

  async fetchWhiteLists(): Promise<void> {
    this.whiteLists = {};
    const queryResult = await this.transferService.runQuery(contractAddress, {
      get_white_users: {},
    });
    queryResult.forEach((item: string) => (this.whiteLists[item] = true));
  }

  async ngOnInit(): Promise<void> {
    this.userService.getAdminBoard().subscribe({
      next: (data) => {
        this.content = data.data;
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message;
      },
    });
    const accountInfo: AccountInfo = JSON.parse(
      window.localStorage.getItem('account-info')
    );
    this.account = accountInfo.address;
    await this.fetchWhiteLists();
  }

  async addToWhiteLists(user: User): Promise<void> {
    console.log('add user', user);
    try {
      const executeResult = await this.transferService.runExecute(
        contractAddress,
        {
          add_whit_user: {
            user: {
              address: user.address,
              email: user.email,
              name: user.name,
            },
          },
        }
      );
      await this.fetchWhiteLists();
      console.log('execute result', executeResult);
    } catch (e) {
      console.error('execute error', e);
    }
  }

  async removeFromWhiteLists(user: User): Promise<void> {
    console.log('remove user', user);
    try {
      const executeResult = await this.transferService.runExecute(
        contractAddress,
        {
          delete_white_user: {
            user: user.address,
          },
        }
      );
      await this.fetchWhiteLists();
      console.log('execute result', executeResult);
    } catch (e) {
      console.error('execute error', e);
    }
  }
}
