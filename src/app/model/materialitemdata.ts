export class MaterialItemData {
    have = 0;
    need = 0;
    lack = 0;
    canMerge = false;

    name: string;
    cn_name: string;
    constructor(name: string, cn_name: string) {
        this.name = name;
        this.cn_name = cn_name;
    }
    
    shouldHide() {
        return !(this.have || this.need || this.lack);
    }
}
