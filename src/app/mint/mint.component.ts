import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { contractAddress } from 'src/environments/config';
import { BoardAdminComponent } from '../board-admin/board-admin.component';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { TransferService } from '../_services/transfer.service';

const routes: Routes = [{ path: 'admin', component: BoardAdminComponent }];

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private transferService: TransferService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {}

  async mint(): Promise<void> {
    const mintInfoString: string = window.localStorage.getItem('mint-info');
    if (!mintInfoString) return;
    const mintInfo = JSON.parse(mintInfoString);
    const isAdmin = JSON.parse(window.localStorage.getItem('isAdmin') || '');
    console.log(mintInfo);

    let mintIndexArray: number[] = [];
    mintInfo.check_mint.forEach((item: boolean, index: number) => {
      if (item) mintIndexArray.push(index);
    });
    const selectedIndex = mintIndexArray.sort(() => 0.5 - Math.random()).pop();
    const message = {
      mint: { rand: `${(selectedIndex || 0) + 1}` },
    };
    try {
      const executeResult = await this.transferService.runExecute(
        contractAddress,
        message,
        !isAdmin
          ? {
              funds: `${+mintInfo.price > 0 ? +mintInfo.price / 1e6 : ''}`,
            }
          : null
      );
      console.log('execute result', executeResult);
    } catch (e) {
      console.error('execute error', e);
      window.alert('transaction failed!');
    }
  }
}
