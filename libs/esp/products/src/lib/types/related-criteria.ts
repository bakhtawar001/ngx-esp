export interface MoreFromSupplierCriteria extends BaseRelatedCriteria {
  asiNumber: string;
}

export interface RelatedProductsCriteria extends BaseRelatedCriteria {
  productId: number;
}

interface BaseRelatedCriteria {
  count?: number;
}
