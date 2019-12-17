import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

@NgModule({
  exports: [FormsModule, MaterialModule]
})
export class SharedModule {}
