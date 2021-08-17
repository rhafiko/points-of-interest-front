import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

let defaultInnerButtonStyle =
  'cursor: pointer;  border-radius: 10px; border: none; color: white; padding: 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 0 5px;';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private messageService: MessageService) {}

  public getRemoveButton(onClickFunction) {
    return this.getInnerActionButton(onClickFunction, '#e61934', 'Remove');
  }

  public getEditButton(onClickFunction) {
    return this.getInnerActionButton(onClickFunction, '#04AA6D', 'Edit');
  }

  public getShareButton(onClickFunction) {
    return this.getInnerActionButton(onClickFunction, '#3F51B5', 'Share');
  }

  public getInnerActionButton(onClickFunction, color, label) {
    let actionButton = document.createElement('button');
    actionButton.setAttribute('style', `${defaultInnerButtonStyle} background-color: ${color};`);
    actionButton.innerText = label;
    actionButton.onclick = onClickFunction;

    return actionButton;
  }

  public buildPopupHtml(title, buttonRemove, buttonEdit, buttonShare) {
    var template = document.createElement('div');
    var span = document.createElement('span');
    span.appendChild(document.createTextNode(title));
    span.setAttribute('style', 'font-size: 16px; font-weight: 900; word-wrap:break-word;');
    template.setAttribute('style', 'min-width: 220px; max-width: 220px; text-align: center;');
    template.appendChild(span);

    var divButtons = document.createElement('div');
    divButtons.setAttribute('style', 'padding-top: 10px;');
    divButtons.appendChild(buttonEdit);
    divButtons.appendChild(buttonShare);
    divButtons.appendChild(buttonRemove);

    template.appendChild(divButtons);
    return template;
  }

  public getCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Geolocation',
              life: 6000,
              detail: `Error acquiring your current location: ${error.message}`,
            });
            console.error(error);
            reject(false);
          }
        );
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Geolocation',
          detail: 'Your Browser does not support geolocation',
        });
        console.log('Geolocalização não é suportada neste navegador.');
        reject(false);
      }
    });
  }
}
