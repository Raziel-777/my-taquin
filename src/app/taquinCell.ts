export class TaquinCell {
  value: number;
  img: string;
  constructor(val: number) {
    this.value = val;
    this.img = 'mick' + val.toString() + '.jpg';
  }
}
