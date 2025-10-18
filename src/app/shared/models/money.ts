import {Currency} from "./currency";

export class Money {
  readonly _amount: number;
  private readonly _currency: Currency;

  constructor(amount: number, currency: Currency) {
    if (amount <0) {
      throw new Error("Amount must be non-negative");
    }
    this._amount = amount;
    this._currency = currency;
  }

  public get amount(): number {
    return this._amount;
  }

  public get currency(): Currency {
    return this._currency;
  }

  public toString = (): string => `${this._currency.code} ${this._amount.toFixed(2)} `;

  public format = (locale: string = "en-US"): string =>
    this._currency.formatAmount(this._amount, locale);

  public add = (other: Money): Money => {
    if (this._currency.code !== other._currency.code) {
      throw new Error("Cannot add Money with different currencies");
    }
    return new Money(this._amount + other.amount, this._currency);
  }
}