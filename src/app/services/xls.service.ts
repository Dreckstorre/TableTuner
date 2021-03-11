import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XlsService {
  public highestValue: number | undefined = undefined;
  public lowestValue: number | undefined = undefined;
  private inputXls: Array<Array<number>> = [[]];
  private unClicSurDeux: boolean = false;
  
  public selectedCell: { value: number, x: number , y: number } = {} as { value: number, x: number , y: number };
  public selectedSecondCell: { value: number, x: number , y: number } = {} as { value: number, x: number , y: number };
  public selectedProjectionCell: { value: number; x: number; y: number; } = {} as { value: number, x: number , y: number };

  constructor() { }

  public evalXLS(inputedValue: string): Array<Array<number>> {
    this.highestValue = undefined;
    this.lowestValue = undefined;
    this.inputXls = [];
    const rows = inputedValue.split(' ');
    rows.forEach((row: string, i: number): void => {
      row.split('	').forEach((cell: string) => {
        if(this.inputXls[i] === undefined) {
          this.inputXls.push([]);
        }
        if(this.highestValue === undefined || this.highestValue < parseFloat(cell.replace(',','.'))) {
          this.highestValue = parseFloat(cell.replace(',','.'));
        }
        if(this.lowestValue === undefined || this.lowestValue > parseFloat(cell.replace(',','.'))) {
          this.lowestValue = parseFloat(cell.replace(',','.'));
        }
        this.inputXls[i].push(parseFloat(cell.replace(',','.')));
      });
    });
    return this.inputXls;
  }

  public revalXls(): void {
    this.highestValue = undefined;
    this.lowestValue = undefined;
    this.inputXls.forEach((row: Array<number>) => {
      row.forEach((cell: number) => {
        if(this.highestValue === undefined || this.highestValue < cell) {
          this.highestValue = cell;
        }
        if(this.lowestValue === undefined || this.lowestValue > cell) {
          this.lowestValue = cell;
        }
      })
    })
  }

  public setCell(param: any): void {
    this.assignCell(this.selectedCell.x, this.selectedCell.y, param.value);
    this.inputXls = Array.from(this.inputXls);
    this.revalXls();
  }
  

  public assignCell(x: number, y: number, v: number){
    this.inputXls[x][y] = v;
  }

  public select(x: number, y: number): void {
    if(!this.unClicSurDeux) {
      this.selectedCell = {
        value: this.inputXls[x][y],
        x,
        y
      }
    } else {
      this.selectedSecondCell = {
        value: this.inputXls[x][y],
        x,
        y
      }
    }
    this.unClicSurDeux = !this.unClicSurDeux;
  }

  public selectProjection(x: number, y: number): void {
    this.selectedProjectionCell = {
      value: this.inputXls[x][y],
      x,
      y
    }
  }

  public getInputXls(x: number, y: number): number {
    return this.inputXls[x][y];
  }


}
