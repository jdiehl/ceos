import { Ceos } from './Ceos';
export interface Extension {
    init?(ceos: Ceos): Promise<void>;
    start?(ceos: Ceos): Promise<void>;
    stop?(ceos: Ceos): Promise<void>;
}
//# sourceMappingURL=Extension.d.ts.map