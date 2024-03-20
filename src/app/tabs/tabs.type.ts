

export interface tab {
    id: string;
    title: string;
    onTabRemove?: (id: string) => void;
  }


  export enum tabType {
    Conditions = 1 //to be used for selecting the ng-template

  }