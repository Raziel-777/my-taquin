export class TaquinCell {
  value: number;
  display: number;
  img: string;
  constructor(val: number) {
    this.value = val;
    this.display = val + 1;
    this.img = 'mickey' + (val + 1).toString() + '.jpg';
  }
  changePattern(pattern: string): void {
    this.img = pattern + this.value + '.jpg';
  }
}
