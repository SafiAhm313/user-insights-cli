export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface ApiPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface ApiTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface UserRecord {
  name: string;
  email: string;
  city: string;
  postCount: number;
  completedTodos: number;
  openTodos: number;
}

export interface Summary {
  totalUsers: number;
  totalPosts: number;
  averagePosts: number;
  topCompleter: string | null;
}