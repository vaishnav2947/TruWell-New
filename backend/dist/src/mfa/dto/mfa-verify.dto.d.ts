export declare class MfaVerifyDto {
    userId: string;
    token: string;
    method: 'email' | 'sms' | 'authenticator';
    secret?: string;
}
