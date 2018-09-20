export interface ApiErrorResponse {
    FriendlyMessage: string;
    ExtraData: any;
    StatusCode: number;
    ErrorType: string;
    Debug: Debug;
}

export interface Debug {
    Message: string;
    StackTrace: string;
    InnerMessage?: any;
    InnerStackTrace?: any;
}
