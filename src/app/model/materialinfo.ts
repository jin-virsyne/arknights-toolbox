export class MaterialInfo {
    id: string;
    name: string;
    cn_name: string;
    rarity: number;
    source: {
        [key:string]:string
    };
    madeof: {
        [key:string]:number
    };
    icon: string;
}