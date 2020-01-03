import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent {
  @ViewChild('inputFile')
  inputFileEl: ElementRef<HTMLInputElement>;

  constructor(public chatService: ChatService) {}

  onDrop(files: FileList) {
    const file = files.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    this.chatService.uploadImage(file);
    this.inputFileEl.nativeElement.value = null;
  }
}
