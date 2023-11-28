export default class AccountDTO {
  ID: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  links: [{platform: string, url: string}];
  slug: string;
  bio: string;
}