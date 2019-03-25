export interface IProduct {
  id: number;
  productName: string;
  productCode: string;
  releaseDate: string;
  description: string;
  price: number;
  starRating: number;
  imageUrl: string;
  tags?: string[];
}

export class Product implements IProduct {
  constructor(
    public id: number,
    public productName: string,
    public productCode: string,
    public releaseDate: string,
    public description: string,
    public price: number,
    public starRating: number,
    public imageUrl: string,
    public tags?: string[]
  ) {}

  static of(product: IProduct): Product {
    return new Product(
      product.id,
      product.productName,
      product.productCode,
      product.releaseDate,
      product.description,
      product.price,
      product.starRating,
      product.imageUrl,
      product.tags
    );
  }

  discountPrice(percent: number): number {
    return this.price - (this.price * percent) / 100;
  }
}
