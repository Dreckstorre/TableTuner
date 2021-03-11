import { Component, HostListener, ViewChild } from '@angular/core';
import { InterpolationService } from './services/interpolation.service';
import { XlsService } from './services/xls.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('inputString') inputString: any;
  @HostListener('contextmenu', ['$event']) onRightClick(event: any) {
    event.preventDefault();
  }

  public title: string = 'Table Tuner';
  public inputXls: Array<Array<number>> = [[]];
  public unClicSurDeux: boolean = false;

  public percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
  ];

  public constructor(private interpolationService: InterpolationService, 
                     public xls: XlsService) {}
  
  public evalXLS(value: string): void {
    this.inputXls = this.xls.evalXLS(value);
  }

  public getValueFromEvent(input: Event): string {
    const castEvent: any = input;
    return (castEvent.target.value)?castEvent.target.value:'';
  }

  public emptyInput(): void {
    this.inputXls = [];
    this.inputString.nativeElement.value = '';
  }

  public getColorByCell(cell: number): string {
    let pct : number = 0;
    if(this.xls.lowestValue !== undefined && this.xls.highestValue !== undefined) {
      pct = this.interpolationService.map(cell, this.xls.lowestValue, this.xls.highestValue, 1, 0)
    }
    return this.getColorForPercentage(pct);
  }

  public getColorForPercentage(pct: number): string {
    for (var i = 1; i < this.percentColors.length - 1; i++) {
        if (pct < this.percentColors[i].pct) {
            break;
        }
    }
    var lower = this.percentColors[i - 1];
    var upper = this.percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  };

  public setCell(param: any): void {
    this.xls.setCell(param);
  }

  public select(x: number, y: number): void {
    this.xls.select(x, y);
  }

  public selectProjection(x: number, y: number): void {
    this.xls.selectProjection(x, y);
  }

  public verticalInterpolation() {
    const selectedCell = this.xls.selectedCell;
    const selectedSecondCell = this.xls.selectedSecondCell;
    this.interpolationService.verticalInterpolation(selectedCell.x, selectedCell.y, selectedSecondCell.x, selectedSecondCell.y);
  }

  public horizontalInterpolation() {
    const selectedCell = this.xls.selectedCell;
    const selectedSecondCell = this.xls.selectedSecondCell;
    this.interpolationService.horizontalInterpolation(selectedCell.x, selectedCell.y, selectedSecondCell.x, selectedSecondCell.y);
  }

  public horizontalProjection() {
    const selectedCell = this.xls.selectedCell;
    const selectedSecondCell = this.xls.selectedSecondCell;
    const selectedProjectionCell = this.xls.selectedProjectionCell;
    this.interpolationService.horizontalProjection(selectedCell.x, selectedCell.y, selectedSecondCell.x, selectedSecondCell.y, selectedProjectionCell.x, selectedProjectionCell.y);
  }

  public verticalProjection() {
    const selectedCell = this.xls.selectedCell;
    const selectedSecondCell = this.xls.selectedSecondCell;
    const selectedProjectionCell = this.xls.selectedProjectionCell;
    this.interpolationService.verticalProjection(selectedCell.x, selectedCell.y, selectedSecondCell.x, selectedSecondCell.y, selectedProjectionCell.x, selectedProjectionCell.y);
  }


}
