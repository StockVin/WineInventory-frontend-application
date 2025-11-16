export class Report {
    id: number;
    productName: string;
    productNameText: string;
    productDisplayName?: string;
    productLiquorType?: string;
    type: string;
    price: number;
    amount: number;
    reportDate: string;
    lostAmount: number;

    constructor(reports: { id?: number; productName?: string; productNameText?: string; type?: string; price?: number; amount?: number; reportDate?: string; lostAmount?: number; }) {
      this.id = reports.id || 0;
      this.productName = reports.productName || '';
      this.productNameText = reports.productNameText || '';
      this.productDisplayName = reports.productNameText;
      this.type = reports.type || '';
      this.price = reports.price || 0;
      this.amount = reports.amount || 0;
      this.reportDate = reports.reportDate || '';
      this.lostAmount = reports.lostAmount || 0;
    }
}