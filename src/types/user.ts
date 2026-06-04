export type User = {
  id: number;
  vkId: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  city: string;
  age: number;
  friends: [];
  role: "user" | "moderation";
  interests: string[];
  photoUrl?: string;
};
