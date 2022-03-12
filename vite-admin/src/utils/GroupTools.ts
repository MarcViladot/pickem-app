export interface NavItem {
  text: string;
  icon: string;
  link: string;
}

export class GroupTools {
  static getNavList(): NavItem[] {
    return [
      { text: `Dashboard`, link: ``, icon: `dashboard` },
      { text: `Leagues`, link: `leagues`, icon: `list` },
      { text: `Teams`, link: `teams`, icon: `adb` },
      { text: `Users`, link: `users`, icon: `group` },
      { text: `Translations`, link: `translations`, icon: `translate` },
    ];
  }
}
