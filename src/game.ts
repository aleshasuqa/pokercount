import { dlist, value } from './dlist';

export type payout = {
    name: string,
    debt: number
}

export type player = {
    name: string,
    buyIn: number,
    chips: number
}

export class Player implements value {
    name: string;
    buyIn: number;
    chips: number;

    // constructor(name: string, buyIn: number, chips: number, rate?: number) {
    //     this.name = name;
    //     this.buyIn = rate ? buyIn * rate : buyIn;
    //     this.chips = chips;
    // }

    constructor({ name, buyIn, chips }: player) {
        this.name = name;
        this.buyIn = buyIn;
        this.chips = chips;
    }

    value() {
        return this.chips - this.buyIn;
    }
}

export class Game {
    players: Player[];
    rate: number;
    constructor(players: player[], rate: number) {
        this.players = players.map(p => new Player(p));
        this.rate = rate;
    }

    dividePlayers(): { winners: dlist<Player>, losers: dlist<Player> } {
        const winners = new dlist<Player>();
        const losers = new dlist<Player>();

        this.players.filter(p => p.value() > 0).forEach(p => winners.push(p));
        this.players.filter(p => p.value() < 0).forEach(p => losers.push(p));

        return { winners, losers };
    }

    error(): number {
        return this.players.flatMap(p => p.value()).reduce((acc, cur) => acc + cur, 0);
    }

    fixError(): player[] {
        let error = this.error();
        if (error === 0) return [];

        const toFix = error < 0 ? this.players.filter(p => p.value() < 0) : this.players.filter(p => p.value() > 0);

        while (error !== 0) {
            toFix.forEach(p => {
                if (error === 0) return;
                const i: number = error < 0 ? 1 : -1;
                p.chips += i;
                error += i;
                console.log(p.name, p.chips, error);
            });
        }
        return this.players.map(p => ({ name: p.name, buyIn: p.buyIn, chips: p.chips }));
    }

    getPayouts(): { [key: string]: payout[] } | null {
        if (this.error() !== 0) {
            return null;
        }

        const { winners, losers } = this.dividePlayers();
        const res: { [key: string]: payout[] } = {};

        while (!winners.isEmpty() && !losers.isEmpty()) {
            const loser = losers.popMax();
            const winner = winners.popMin();

            let pay = loser!.value();
            if (-pay > winner!.value()) {
                pay = -winner!.value();
            }

            if (pay !== 0) {
                const payout = { name: winner!.name, debt: -pay / this.rate };
                if (!res[loser!.name])
                    res[loser!.name] = [payout];
                else
                    res[loser!.name].push(payout);
            }

            loser!.chips += -pay;
            if (loser!.value() !== 0) losers.push(loser!);

            winner!.chips -= -pay;
            if (winner!.value() !== 0) winners.push(winner!);
        }

        return res;
    }

}
