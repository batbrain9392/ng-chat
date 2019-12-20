import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Pipe({
  name: 'isMe'
})
export class IsMePipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  async transform(chatUsername: string, type?: 'boolean') {
    const { displayName: myUsername } = await this.authService.user;
    const isMe = myUsername === chatUsername;
    return type ? isMe : isMe ? 'Me' : chatUsername;
  }
}
