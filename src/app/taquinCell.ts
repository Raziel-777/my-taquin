export class TaquinCell {
  value: number;
  show: boolean;
  img: string;
  constructor(val: number, state: boolean = true) {
    this.value = val;
    this.show = state;
    this.img = 'mick' + val.toString() + '.jpg';
  }
}
