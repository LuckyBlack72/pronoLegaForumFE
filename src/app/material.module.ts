/*
    mettere qui tutte gli import che servono per angular material
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatTableModule, MatToolbarModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatInputModule, MatTableModule],
  exports: [CommonModule, MatToolbarModule, MatInputModule, MatTableModule],
})
export class MaterialModule { }
