export class Activity {

  public name: string;
  public money: number;
  public motivation: number;
  public total: number;

  constructor(_name: string) {
    this.name = _name;
  }

  public calculateValue(): void {
    this.total = this.money * this.motivation;
  }
}
