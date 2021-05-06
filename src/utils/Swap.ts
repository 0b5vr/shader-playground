/**
 * Useful for swap buffer
 */
export class Swap<T> {
  public i: T;
  public o: T;

  public constructor( a: T, b: T ) {
    this.i = a;
    this.o = b;
  }

  public swap(): void {
    const i = this.i;
    this.i = this.o;
    this.o = i;
  }
}
