export class TaquinCell {
  value: number;
  img: string;
  constructor(val: number) {
    this.value = val;
    this.img = 'mickey' + val.toString() + '.jpg';
  }
  changePattern(pattern: string): void {
    this.img = pattern + this.value + '.jpg';
  }
}
