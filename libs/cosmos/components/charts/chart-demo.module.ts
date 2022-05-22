import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosInputModule } from '@cosmos/components/input';
import { HighchartsChartModule } from 'highcharts-angular';
import { CosChartDemoComponent } from './chart-demo.component';

@NgModule({
  declarations: [CosChartDemoComponent],
  imports: [CommonModule, HighchartsChartModule, CosInputModule],
  exports: [CosChartDemoComponent],
})
export class CosChartDemoModule {}
