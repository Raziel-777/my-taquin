export class ShuffleArray {
  public static shuffle(array: Array<number>): Array<number> {
    let ctr = array.length, temp, index;
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = array[ctr];
      array[ctr] = array[index];
      array[index] = temp;
    }
    return array;
  }
}
