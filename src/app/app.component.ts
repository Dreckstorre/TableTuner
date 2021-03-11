import { Component, HostListener, ViewChild } from '@angular/core';

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

  public DECIMAL: number = 2;

  public title: string = 'Table Tuner';
  public tab: Array<Array<number>> = [
    [0, 0, 0],
    [0, 255, 0],
    [0, 0, 0]
  ];
  // public inputString: string = '';
  public inputXls: Array<Array<number>> = [[]];
  public xlsBool: boolean = false;
  public selectedCell: { value: number, x: number , y: number } = {} as { value: number, x: number , y: number };
  public selectedSecondCell: { value: number, x: number , y: number } = {} as { value: number, x: number , y: number };
  public selectedProjectionCell: { value: number; x: number; y: number; } = {} as { value: number, x: number , y: number };
  public highestValue: number | undefined = undefined;
  public lowestValue: number | undefined = undefined;
  public unClicSurDeux: boolean = false;

  public percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
  ];


  public evalXLS(inputedValue: string): void {
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
    })
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

  public getValueFromEvent(input: Event): string {
    const castEvent: any = input;
    return (castEvent.target.value)?castEvent.target.value:'';
  }

  public emptyInput(): void {
    this.inputXls = [];
    this.inputString.nativeElement.value = '';
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

  public selectSecond(x: number, y: number): void {
    this.selectedProjectionCell = {
      value: this.inputXls[x][y],
      x,
      y
    }
  }

  public setCell(param: any): void {
    this.assignCell(this.selectedCell.x, this.selectedCell.y, param.value);
    this.inputXls = Array.from(this.inputXls);
    this.revalXls();
  }

  public assignCell(x: number, y: number, v: number){
    this.inputXls[x][y] = v;
  }

  public getColorByCell(cell: number): string {
    let pct : number = 0;
    if(this.lowestValue !== undefined && this.highestValue !== undefined) {
      pct = this.map(cell, this.lowestValue, this.highestValue, 1, 0)
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

  public map(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number{
    const map: number = (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    return parseFloat(map.toFixed(this.DECIMAL));
  }

  // Vertical Interpolation 
  public simpleVerticalInterpolation(fx: number, fy: number, tx: number, ty: number) {
    let highestValue = tx;
    let lowestValue = fx;
    if(fx > tx) {
      highestValue = fx;
      lowestValue = tx;
    }

    for(let i = lowestValue; i <= highestValue; i++) {
      const value: number = this.map(i, fx, tx, this.inputXls[fx][fy], this.inputXls[tx][ty]);
      this.assignCell(i, fy, value);
    }
  }

  
  public verticalInterpolation(fx: number, fy: number, tx: number, ty: number) {
    let highestValue = ty;
    let lowestValue = fy;
    if(fy > ty) {
      highestValue = fy;
      lowestValue = ty;
    }

    for(let i = lowestValue; i <= highestValue; i++) {
      this.simpleVerticalInterpolation(fx, i, tx, i);
    }
  }


  // Horizontal Interpolation
  public simpleHorizontalInterpolation(fx: number, fy: number, tx: number, ty: number) {
    let highestValue = ty;
    let lowestValue = fy;
    if(fy > ty) {
      highestValue = fy;
      lowestValue = ty;
    }

    for(let i = lowestValue; i <= highestValue; i++) {
      const value: number = this.map(i, fy, ty, this.inputXls[fx][fy], this.inputXls[tx][ty]);
      this.assignCell(fx, i, value);
    }
  }

  
  public horizontalInterpolation(fx: number, fy: number, tx: number, ty: number) {
    let highestValue = tx;
    let lowestValue = fx;
    if(fx > tx) {
      highestValue = fx;
      lowestValue = tx;
    }

    for(let i = lowestValue; i <= highestValue; i++) {
      this.simpleHorizontalInterpolation(i, fy, i, ty);
    }
  }


  // Horizontal Projection
  public horizontalProjection(fx: number, fy: number, tx: number, ty: number, x: number, y: number) {
    let highestValue = tx;
    let lowestValue = fx;
    if(fx > tx) {
      highestValue = fx;
      lowestValue = tx;
    }

    for(let i = lowestValue; i <= highestValue; i++) {
      this.simpleHorizontalProjection(i, fy, i, ty, x, y);
    }
  }

  public simpleHorizontalProjection(fx: number, fy: number, tx: number, ty: number, x: number, y: number) {
    let highestValue = y;
    let lowestValue = fy;
    if(fy > y) {
      highestValue = fy;
      lowestValue = y;
    }

    for(let i = lowestValue; i <= highestValue; i++) {
      const value: number = this.map(i, fy, ty, this.inputXls[fx][fy], this.inputXls[tx][ty]);
      this.assignCell(fx, i, value);
    }
  }

  // Vertical Projection
  public verticalProjection(fx: number, fy: number, tx: number, ty: number, x: number, y: number) {
    let highestValue = ty;
    let lowestValue = fy;
    if(fy > ty) {
      highestValue = fy;
      lowestValue = ty;
    }

    for(let i = lowestValue; i <= highestValue; i++) {
      this.simpleVerticalProjection(fx, i, tx, i, x, y);
    }
  }

  public simpleVerticalProjection(fx: number, fy: number, tx: number, ty: number, x: number, y: number) {
    let highestValue = x;
    let lowestValue = fx;
    if(fy > y) {
      highestValue = fx;
      lowestValue = x;
    }

    for(let i = lowestValue; i <= highestValue; i++) {
      const value: number = this.map(i, fx, tx, this.inputXls[fx][fy], this.inputXls[tx][ty]);
      this.assignCell(i, fy, value);
    }
  }
}
