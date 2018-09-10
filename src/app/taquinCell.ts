export class TaquinCell {
  value: number;
  display: number;
  img: string;

  constructor(val: number, endCell?: boolean) {
    this.value = val;
    this.display = val + 1;
    this.img = 'mickey' + (val + 1).toString() + '.jpg';
  }

  switchPattern(pattern: string): void {
    this.img = pattern + this.display + '.jpg';
  }
}
