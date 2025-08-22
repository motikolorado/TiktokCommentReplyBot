export interface ChromeProfile {
    chromePath: string;
    userDataDir: string;
}
export declare function getChromeProfile(profileName: string): ChromeProfile;
