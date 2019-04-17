export class Activity {

  public name: string;
  public factor1: number;
  public factor2: number;
  public total: number;

  constructor(name: string) {
    this.name = name;
  }

  public calculateValue(): void {
    this.total = this.factor1 * this.factor2;
  }
}
