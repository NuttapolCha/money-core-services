import { Request } from "express";

export class Pagination {
  private limit: number;
  private page: number;
  private total: number | null;

  constructor(limit: number, page: number) {
    if (page <= 0) {
      page = 1;
    }
    this.limit = limit;
    this.page = page;
    this.total = null;
  }

  public static FromRequest(req: Request): Pagination {
    const { limit: queryLimit, page: queryPage } = req.query;
    let limit = parseInt(queryLimit as string, 10);
    let page = parseInt(queryPage as string, 10);

    if (isNaN(limit) || limit <= 0) {
      limit = 10;
    }
    if (isNaN(page) || page <= 0) {
      page = 1;
    }
    return new Pagination(limit, page);
  }

  setTotal(total: number) {
    this.total = total;
  }

  getLimit(): number {
    return this.limit;
  }

  getOffset(): number {
    return (this.page - 1) * this.limit;
  }

  toResponse() {
    return {
      total: this.total,
      page: this.page,
      pageCount:
        this.total !== null ? Math.ceil(this.total / this.limit) : null,
      limit: this.limit,
    };
  }
}
