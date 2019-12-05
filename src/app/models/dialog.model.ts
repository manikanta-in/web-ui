export interface Dialog {
    allowClose?: boolean;
    titleText?: string;
    bodyText?: string;
    actions: DialogAction[];
}

export interface DialogAction {
    buttonText: string;
    isDefaultedChoice: boolean;
    callbackFunction(): any;
}
