export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');


export interface Notification {
    recepientId:string;
    subject:string;
    message:string;
}

export interface INotification {
  send(notification: Notification): Promise<void>;
}