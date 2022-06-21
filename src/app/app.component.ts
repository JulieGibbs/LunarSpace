import { Component } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { TransferService } from './_services/transfer.service';
import { TokenStorageService } from './_services/token-storage.service';
import { UserService } from './_services/user.service';
import { contractAddress } from 'src/environments/config';

export interface AccountInfo {
  address: string;
  hash: string;
  name: string;
}

export const validateAccountInfo = (accountInfo: AccountInfo): boolean => {
  if (!accountInfo) return false;
  return Boolean(accountInfo.address && accountInfo.hash && accountInfo.name);
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  isAdmin = false;
  username?: string;
  account: any;

  node: Node;
  constructor(
    private tokenStorageService: TokenStorageService,
    private transferService: TransferService,
    private userService: UserService,
    private router: Router
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // console.log('navigation started', event);
        const url = event.url;
        switch (url) {
          case '/register':
            if (!this.account) this.router.navigate(['/home']);
            break;
          case '/mint':
            if (!this.account) this.router.navigate(['/home']);
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    const storedObjectString = window.localStorage.getItem('account-info');
    const storedObject: AccountInfo | null = storedObjectString
      ? JSON.parse(storedObjectString)
      : null;
    if (storedObject) {
      this.connectWallet(storedObject);
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  async connectWallet(accountInfo?: AccountInfo): Promise<void> {
    let storeObject: AccountInfo;
    if (validateAccountInfo(accountInfo)) {
      storeObject = accountInfo;
      this.username = storeObject.name;
      this.account = storeObject.address;
    } else {
      const account = await this.transferService.getAccount();
      this.username = account.info.name;
      this.account = account.address;

      storeObject = {
        address: this.account,
        hash: account.hash,
        name: this.username,
      };
    }
    window.localStorage.setItem('account-info', JSON.stringify(storeObject));

    this.userService
      .getUserBoard(storeObject.address, storeObject.hash)
      .subscribe({
        next: (data) => {
          const result = JSON.parse(data);
          const users = result?.users;
          if (!users || users.length == 0) {
            this.router.navigate(['/register']);
          } else {
            this.router.navigate(['/mint']);
          }
        },
        error: (err) => {},
      });

    const queryResult = await this.transferService.runQuery(contractAddress, {
      get_state_info: {},
    });
    window.localStorage.setItem('mint-info', JSON.stringify(queryResult));
    this.isAdmin = queryResult.owner === this.account;
    window.localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));

    // const queryResult = await this.transferService.runQuery(
    //   'juno1h6ft2tkl5c85ve0c30jnv3cne0fmk4ma3gytqjv36cf78se5faxq977cwk',
    //   {
    //     get_white_users: {},
    //   }
    // );
    // console.log('query result', queryResult);
    // try {
    //   const executeResult = await this.transferService.runExecute(
    //     'juno1h6ft2tkl5c85ve0c30jnv3cne0fmk4ma3gytqjv36cf78se5faxq977cwk',
    //     {
    //       add_whit_user: {
    //         user: {
    //           address: this.account.address,
    //           email: '',
    //           name: '',
    //         },
    //       },
    //     }
    //   );
    //   console.log('execute result', executeResult);
    // } catch (e) {
    //   console.error('execute error', e);
    // }
  }

  disconnectWallet() {
    this.username = '';
    this.account = '';
    this.isAdmin = false;
    window.localStorage.clear();
    this.router.navigate(['/home']);
  }
}
