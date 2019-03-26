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
  id: number;
  productName: string;
  productCode: string;
  releaseDate: string;
  description: string;
  price: number;
  starRating: number;
  imageUrl: string;
  tags?: string[];

  constructor(options: {
    id?: number;
    productName?: string;
    productCode?: string;
    releaseDate?: string;
    description?: string;
    price?: number;
    starRating?: number;
    imageUrl?: string;
    tags?: string[];
  }) {
    this.id = options.id || null;
    this.productName = options.productName || '';
    this.productCode = options.productCode || '';
    this.releaseDate = options.releaseDate || '';
    this.description = options.description || '';
    this.price = options.price || null;
    this.starRating = options.starRating || 0;
    this.imageUrl = options.imageUrl || '';
    this.tags = options.tags || [];
  }

  static of(product: IProduct): Product {
    return new Product({ ...product });
  }

  discountPrice(percent: number): number {
    return this.price - (this.price * percent) / 100;
  }
}
