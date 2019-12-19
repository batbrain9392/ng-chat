import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent {
  @Output()
  dropped = new EventEmitter<File>();
  isHovering: boolean;

  constructor() {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(event: FileList) {
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    this.dropped.emit(file);
  }
}
