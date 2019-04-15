export class Activity {

  public name: string;
  public factor1: number;
  public factor2: number;
  public total: number;

  constructor(_name: string) {
    this.name = _name;
  }

  public calculateValue(): void {
    this.total = this.factor1 * this.factor2;
  }
}
