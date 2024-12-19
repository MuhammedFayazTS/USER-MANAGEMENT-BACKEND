export interface DefaultQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  sort?: string;
  order?: "ASC" | "DESC";
  attributes?: Array<string>;
}
