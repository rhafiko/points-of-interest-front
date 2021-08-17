import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarComponent } from './components/avatar/avatar.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [MapComponent, AvatarComponent],
  imports: [
    CommonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    AvatarModule,
    AvatarGroupModule,
    ReactiveFormsModule,
    TieredMenuModule,
    ShareButtonsModule,
    ShareIconsModule,
    ConfirmDialogModule,
  ],
})
export class MapModule {}
