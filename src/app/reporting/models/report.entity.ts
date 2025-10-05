export class Report {
    id: number;
    products: string;
    type: string;
    price: number;
    amount: number;
    date: string;
    lost: number;
  
    constructor(reports: {id?:number,products?:string,type?:string,price?:number,amount?:number,date?:string,lost?:number}) {
      this.id = reports.id || 0;
      this.products = reports.products || '';
      this.type = reports.type || '';
      this.price = reports.price || 0;
      this.amount = reports.amount || 0;
      this.date = reports.date || '';
      this.lost = reports.lost || 0;
    }
}