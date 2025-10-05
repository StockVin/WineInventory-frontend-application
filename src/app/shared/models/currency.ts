type UppercaseLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

/**
 * Represents a currency code.
 * The code is a string of three uppercase letters (e.g., "USD", "EUR").
 */
export type CurrencyCode = `${UppercaseLetter}${UppercaseLetter}${UppercaseLetter}`;

/**
 * Represents a currency.
 */
export class Currency {
  private readonly _code: CurrencyCode;

  /**
   * Creates a new Currency instance.
   * @param code {CurrencyCode} The currency code (e.g., "USD", "EUR").
   */
  constructor(code: CurrencyCode) {
    this._code = code;
  };

  /**
   * Gets the currency code.
   * @returns {string} The currency code.
   */
  public get code(): string { return this._code; }

  /**
   * Formats an amount in the currency.
   * @param amount {number} The amount to format.
   * @param locale {string} The locale to use for formatting (default is "en-US").
   * @returns {string} The formatted amount.
   */
  public formatAmount = (amount: number, locale: string = "en-US"): string => {
    return amount.toLocaleString(locale, {
      style: "currency",
      currency: this._code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  /**
   * Gets the string representation of the currency code.
   * @returns {string} The currency code.
   */
  public toString = (): string => this._code;
}