

export interface tab {
    id: string;
    title: string;
    innerHtml?: string;
    onRemove?: (tab: tab) => void;
  }