export interface IGallery {
  id?: number;
  name?: string;
  alt?: string;
  path: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryResponse {
  success: boolean;
  categories: ICategory[];
}

export interface ICategory {
  id?: number;
  title: string;
  slug: string;
  content?: string;
  image?: IGallery;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostResponse {
  success: boolean;
  posts: IPost[];
}

export interface IPost {
  id?: number;
  title: string;
  slug: string;
  content?: string;
  categories?: ICategory[];
  image?: IGallery;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGalleryResponse {
  success: boolean;
  gallery: IGallery[];
}
