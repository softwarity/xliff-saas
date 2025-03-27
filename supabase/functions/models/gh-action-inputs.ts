export interface GhEstimateInputs {
    TOKEN: string;
    REPOSITORY_INFO: string;
    GIT_PROVIDER: string;
    EXT_XLIFF: string;
    STATE: string;
    WEBHOOK_URL: string;
    WEBHOOK_JWT: string;
}

export interface GhTranslateInputs extends GhEstimateInputs {
    PROCEEDED_STATE: string;
    DRY_RUN: 'true' | 'false';
    CREDITS: string;
}
