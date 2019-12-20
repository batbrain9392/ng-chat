export interface Chat {
  id?: string;
  text?: string;
  imgUrl?: string;
  timestamp: number;
  user: {
    displayName: string;
    photoURL?: string;
  };
}
