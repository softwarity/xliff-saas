export interface GhInputs {
    GIT_PROVIDER: string;
    OPTIONS: string;
    WEBHOOK_URL: string;
    WEBHOOK_JWT: string;
}

export interface GhEstimateOptions {
    GIT_TOKEN: string;
    NAMESPACE: string;
    REPOSITORY: string;
    BRANCH: string;
    EXT_XLIFF: string;
    STATE: string;
}

export interface GhTranslateOptions extends GhEstimateOptions {
    PROCEEDED_STATE: string;
    CREDITS: number;
    MEMBERSHIP_LEVEL: 'DIAMOND' | 'GOLD' | 'SILVER' | 'BRONZE';
    DRY_RUN: 'true' | 'false';
    MODEL: 'gpt-4o-mini' | 'gpt-4o' | 'gpt-3.5-turbo';
}