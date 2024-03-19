

export interface tab {
    id: string;
    title: string;
    tabType: tabType,
    tabData: any,
    onRemove?: (tab: tab) => void;
  }


  export enum tabType {
    Conditions = 1 //to be used for selecting the ng-template

  }