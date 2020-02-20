import { Component, OnInit } from '@angular/core';
import { FetchService } from '../fetch.service';

@Component({
    selector: 'app-lvlup',
    templateUrl: './lvlup.component.html',
    styleUrls: ['./lvlup.component.scss']
})
export class LvlupComponent implements OnInit {

    // import math for binding
    math = Math;

    maxLevel: Array<Array<number>>;
    charExpMap: Array<Array<number>>;
    charUpCostMap: Array<Array<number>>;
    evolGoldCost: Array<Array<number>>;
    lsMapDetail: Array<Array<number>>;
    ceMapDetail: Array<Array<number>>;

    // Char
    star = 6;
    currentEvolve = 0;
    targetEvolve = 0;
    currentLvl = 1;
    targetLvl = 1;
    currentExp = 0;

    // Assets
    gold = 0;
    bookBasic = 0;
    bookPrimary = 0;
    bookMiddle = 0;
    bookAdvanced = 0;

    // Results
    lsCount = 0;
    ceCount = 0;
    lsAp = 0;
    ceAp = 0;
    expMinus = 0;
    goldMinus = 0;
    lvlupExp = 0;
    lvlupGold = 0;
    evolveGold = 0;

    lvlJson: any;

    // Maps:
    lsMap = '5';
    ceMap = '5';
    lsMapCost = 0;
    ceMapCost = 0;
    lsCost = 0;
    ceCost = 0;

    isExsm = false;


    constructor(private fetchService: FetchService) {
        this.isExsm = fetchService.getLocalStorage('s-exsm', false);
    }

    toMaxLvl(isCurrent: boolean) {
        if (isCurrent) {
            this.currentLvl = this.lvlJson.maxLevel[+this.star - 1][this.currentEvolve];
        } else {
            this.targetLvl = this.lvlJson.maxLevel[+this.star - 1][this.targetEvolve];
        }
    }
    onStarChange() {
        //console.log(this.lvlJson.maxLevel);
        const star = Number(this.star);
        const maxEvolve = this.lvlJson.maxLevel[star - 1].length;
        if (this.currentEvolve >= maxEvolve) {
            this.currentEvolve = maxEvolve - 1;
        }
        if (this.targetEvolve >= maxEvolve) {
            this.targetEvolve = maxEvolve - 1;
        }
        if (this.currentLvl > this.lvlJson.maxLevel[star - 1][this.currentEvolve]) {
            this.currentLvl = this.lvlJson.maxLevel[star - 1][this.currentEvolve];
        }
        if (this.targetLvl > this.lvlJson.maxLevel[star - 1][this.targetEvolve]) {
            this.targetLvl = this.lvlJson.maxLevel[star - 1][this.targetEvolve];
        }
    }
    onLSChange() {
        const selectLS = Number(this.lsMap);
        this.lsMapCost = this.lsMapDetail[selectLS - 1][0];
    }
    onCEChange() {
        const selectCE = Number(this.ceMap);
        this.ceMapCost = this.ceMapDetail[selectCE - 1][0];
    }
    onEvolveChange(isTarget: boolean, isAdd: boolean) {
        const star = Number(this.star);
        if (isTarget) {
            if (isAdd) {
                this.targetEvolve += this.targetEvolve < this.lvlJson.maxLevel[star - 1].length - 1 ? 1 : 0;
            } else {
                this.targetEvolve -= this.targetEvolve > 0 ? 1 : 0;
            }
        } else {
            if (isAdd) {
                this.currentEvolve += this.currentEvolve < this.lvlJson.maxLevel[star - 1].length - 1 ? 1 : 0;
                if (this.targetEvolve < this.currentEvolve) {
                    this.targetEvolve = this.currentEvolve;
                }
            } else {
                this.currentEvolve -= this.currentEvolve > 0 ? 1 : 0;
            }
        }
    }
    calc(): void {
        // console.log(this);
        let cl = this.currentLvl;
        const ce = this.currentEvolve;
        const star = +this.star;
        const cex = this.currentExp;
        const tl = this.targetLvl;
        const te = this.targetEvolve;
        const selectLS = Number(this.lsMap);
        const selectCE = Number(this.ceMap);
        this.lsCost = this.lsMapCost;
        this.ceCost = this.ceMapCost;

        const higher = te > ce || (te === ce && tl > cl);
        const isHighest = this.maxLevel[star - 1][ce] === cl;
        let expSum = higher ? (isHighest ? 0 : this.charExpMap[ce][cl - 1] - cex) : 0;
        let costSum = higher ? (isHighest ? 0 : this.charUpCostMap[ce][cl - 1] * expSum / this.charExpMap[ce][cl - 1]) : 0;
        cl++;
        // console.log(expSum)
        // console.log(costSum)
        // lvlup
        for (let i = ce, j = cl; i <= te; i++) {
            while (i < te && j < this.maxLevel[star - 1][i]) {
                expSum += this.charExpMap[i][j - 1];
                costSum += this.charUpCostMap[i][j - 1];
                j++;
            }
            while (i === te && j < tl) {
                expSum += this.charExpMap[i][j - 1];
                costSum += this.charUpCostMap[i][j - 1];
                j++;
            }
            j = 1;
        }
        this.lvlupExp = expSum;
        this.lvlupGold = costSum;

        // evolve
        let ea = 0;
        console.log(this.evolGoldCost);
        console.log(star);
        for (let i = ce; i < te; i++) {
            ea += this.evolGoldCost[star - 1][i];
        }
        this.evolveGold = ea;

        // books
        const bb = this.bookBasic;
        const bp = this.bookPrimary;
        const bm = this.bookMiddle;
        const ba = this.bookAdvanced;
        const bs = bb * 200 + bp * 400 + bm * 1000 + ba * 2000;
        this.expMinus = bs;
        if (expSum <= bs) {
            this.lsCount = 0;
            this.lsAp = 0;
        } else {
            
            this.lsCount = Math.ceil((expSum - bs) / this.lsMapDetail[selectLS - 1][2]);
            this.lsAp = this.lsCount * this.lsMapCost;
        }
        const gs = this.gold + this.lsCount * this.lsMapDetail[selectLS - 1][1];
        this.goldMinus = gs;
        if (costSum + ea <= gs) {
            this.ceCount = 0;
            this.ceAp = 0;
        } else {
            this.ceCount = Math.ceil((costSum + ea - gs) / this.ceMapDetail[selectCE - 1][1]);
            this.ceAp = this.ceCount * this.ceMapCost;
        }
        // console.log(this);
        /*
        LS5 3,1,1,0 = 7400,360,30
        LS4 1,2,2,3 = 5400,300,25
        LS3 0,3,2,3 = 4400,240,20
        
        LS4
        1332 = 5000+1200+400 = 6600
        1142 = 3000+1600+400 = 5000
        1331 = 5000+1200+200 = 6400
        1231 = 4000+1200+200 = 5400
        
        LS3
        0313 = 3000+400+600=4000
        0321 = 3000+800+200=4000
        0322 = 3000+800+400=4200

        CE5 7500,30
        CE4 5000,25
        CE3 4100,20
        */
        }
ngOnInit() {
    this.fetchService.getJson('./assets/data/aklevel.json').subscribe(data => {
        this.lvlJson = data;
        this.maxLevel = data.maxLevel;
        this.charExpMap = data.characterExpMap;
        this.charUpCostMap = data.characterUpgradeCostMap;
        this.evolGoldCost = data.evolveGoldCost;
        this.lsMapDetail = data.lsMap;
        this.ceMapDetail = data.ceMap;

        const ls = Number(this.lsMap);
        const ce = Number(this.ceMap);
        this.lsMapCost = this.lsCost = this.lsMapDetail[ls - 1][0];
        this.ceMapCost = this.ceCost = this.ceMapDetail[ce - 1][0];
    });
}

}
