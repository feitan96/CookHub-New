export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  name?: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
  ingredients?: string;
  instructions?: string;
};

export type IUpdatePost = {
  postId: string;
  name?: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  ingredients?: string;
  instructions?: string;
  tags?: string;
};

export type IComment = {
  postId: string;
  comment: string;
  userId: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type emailverify = {
  email: string;
};
