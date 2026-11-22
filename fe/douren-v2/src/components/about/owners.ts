export interface OwnerProfile {
  name: string;
  title: string;
  description?: string;
  twitterName?: string;
  twitterLink?: string;
  githubName?: string;
  githubLink?: string;
  discordName?: string;
}

export const OWNERS: readonly OwnerProfile[] = [
  {
    name: "小黑蚊",
    title: "主要管理者/資訊整理者",
    twitterName: "シャオヘイウン(小黑蚊)",
    twitterLink: "https://twitter.com/MemoriesSwords",
    discordName: "lbm_1749",
  },
  {
    name: "Stangen",
    title: "網頁開發/UIUX",
    githubName: "Tantanok221",
    githubLink: "https://github.com/Tantanok221",
    discordName: "stangen_0",
  },
];
