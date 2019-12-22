import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'isMe'
})
export class IsMePipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  transform(chatUsername: string, type?: 'boolean') {
    return this.authService.user$.pipe(
      map(user => {
        let isMe = false;
        if (user) {
          isMe = user.displayName === chatUsername;
        }
        return type ? isMe : isMe ? 'Me' : chatUsername;
      })
    );
  }
}
