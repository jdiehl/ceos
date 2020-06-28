declare type ConfigType = 'string' | 'int' | 'float' | 'boolean';
export declare class Config {
    protected data: Record<string, any>;
    get<T = string>(key: string): T;
    define<T = string>(key: string, type?: ConfigType, defaultValue?: any): T;
}
export {};
//# sourceMappingURL=Config.d.ts.map