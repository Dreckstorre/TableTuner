import { Injectable } from '@angular/core';
import { XlsService } from './xls.service';

@Injectable({
  providedIn: 'root'
})
export class InterpolationService {

  private DECIMAL: number = 2;

  constructor(private xls: XlsService) { }

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
      const value: number = this.map(i, fx, tx, this.xls.getInputXls(fx,fy), this.xls.getInputXls(tx,ty));
      this.xls.assignCell(i, fy, value);
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
      const value: number = this.map(i, fy, ty, this.xls.getInputXls(fx,fy), this.xls.getInputXls(tx,ty));
      this.xls.assignCell(fx, i, value);
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
      const value: number = this.map(i, fy, ty, this.xls.getInputXls(fx,fy), this.xls.getInputXls(tx,ty));
      this.xls.assignCell(fx, i, value);
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
      const value: number = this.map(i, fx, tx, this.xls.getInputXls(fx,fy), this.xls.getInputXls(tx,ty));
      this.xls.assignCell(i, fy, value);
    }
  }
}
