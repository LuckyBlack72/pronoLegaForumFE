/*
    mettere qui tutte gli import che servono per angular material
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatInputModule, MatTableModule, MatToolbarModule, MatPaginatorModule, MatSortModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatToolbarModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule],
  exports: [CommonModule, MatButtonModule, MatToolbarModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
export class MaterialModule { }
