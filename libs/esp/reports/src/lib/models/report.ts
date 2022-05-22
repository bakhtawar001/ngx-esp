export class Report {
  id!: string;
  name!: string;
  embedUrl!: string;
  embedToken!: {
    token: string;
    expiration: string;
  };
  username!: string;
}
