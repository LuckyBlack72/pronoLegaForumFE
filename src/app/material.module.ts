/*
    mettere qui tutte gli import che servono per angular material
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatTableModule, MatToolbarModule, MatPaginatorModule, MatSortModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule],
  exports: [CommonModule, MatToolbarModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
export class MaterialModule { }
