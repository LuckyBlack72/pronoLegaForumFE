/*
    mettere qui tutte gli import che servono per angular material
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatSortModule,
        MatRadioModule,
        MatSelectModule
      } from '@angular/material';

@NgModule({
  imports: [
              CommonModule,
              MatButtonModule,
              MatToolbarModule,
              MatInputModule,
              MatTableModule,
              MatPaginatorModule,
              MatSortModule,
              MatRadioModule,
              MatSelectModule
            ],
  exports: [
              CommonModule,
              MatButtonModule,
              MatToolbarModule,
              MatInputModule,
              MatTableModule,
              MatPaginatorModule,
              MatSortModule,
              MatRadioModule,
              MatSelectModule
            ]
})
export class MaterialModule { }
