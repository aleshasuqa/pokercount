import { FC, useState } from 'react'
import { Game, payout, player } from './game'

interface PlayerTileProps {
    player: player,
    rate: number,
    onRemove: () => void
}

const PlayerTile: FC<PlayerTileProps> = ({ onRemove, rate, player: { name, buyIn, chips } }) => {
    return (
        <div className="bg-back-light w-full grid grid-cols-[35%_27%_28%_10%] justify-center items-center py-3 px-2 rounded-lg">
            <span className="font-bold">{name}</span>
            <div className="flex justify-start items-baseline gap-1">
                <span className="text-txt-gray text-xs">buy in</span>
                <span className="">{buyIn / rate}</span>
            </div>
            <div className="flex justify-start items-baseline gap-1">
                <span className="text-txt-gray text-xs">chips</span>
                <span className="">{chips}</span>
            </div>
            <button onClick={onRemove} className="bg-red rounded-lg py-0.5">-</button>
        </div>
    )
}

const PlayerForm: FC<{ action: (formData: any) => void }> = ({ action }) => {
    return (
        <form action={action} className="bg-back-light w-full grid grid-cols-[35%_27%_28%_10%] justify-center items-center px-2 py-3 rounded-lg">
            <div className="flex flex-row justify-center items-baseline gap-1">
                <input name="name" className="font-bold w-full focus:outline-none" placeholder="name" required />
            </div>
            <div className="flex flex-row justify-start items-baseline gap-1">
                <span className="text-txt-gray text-xs">buy in</span>
                <input name="buyIn" type="number" className="w-9 focus:outline-none" placeholder="10" required />
            </div>
            <div className="flex flex-row justify-start items-baseline gap-1">
                <span className="text-txt-gray text-xs">chips</span>
                <input name="chips" type="number" className="w-12 focus:outline-none" placeholder="2000" required />
            </div>
            <button type="submit" className="bg-primary rounded-lg p-0.5">+</button>
        </form>
    )
}

type PayoutsProps = {
    loser: string,
    payout: payout
}

const PayoutTile: FC<PayoutsProps> = ({ loser, payout: { name, debt } }) => {
    return (
        <div className="bg-back-light w-full grid grid-cols-[35%_27%_28%_10%] justify-center items-center py-3 px-2 rounded-lg">
            <span className="font-bold">{loser}</span>
            <div className="flex justify-start items-baseline gap-1">
                <span className="text-txt-gray text-xs">{name}</span>
                <span className="">{debt}</span>
            </div>
        </div>
    )
}

function App() {
    const rate = 10;

    const [players, setPlayers] = useState<player[]>([
        { name: "Player 1", buyIn: 100, chips: 90 },
        { name: "Player 2", buyIn: 100, chips: 20 },
        { name: "Player 3", buyIn: 100, chips: 140 },
        { name: "Player 4", buyIn: 100, chips: 150 },
        { name: "Player 5", buyIn: 100, chips: 110 }
    ]);

    const [payouts, setPayouts] = useState<{ [key: string]: payout[] } | null>(null);
    const [cheat, setCheat] = useState(0);

    const addPlayer = (formData: any) => {
        const player: player = {
            name: formData.get('name'),
            buyIn: formData.get('buyIn') * rate,
            chips: formData.get('chips') * 1 // dont even try to understand
        };
        console.log(player);
        setPlayers([...players, player]);
    }

    const removePlayer = (player: player) => {
        setPlayers(players.filter(p => p.name != player.name));
    }

    const getPayouts = () => {
        const game = new Game(players, rate);
        const error = game.error();
        if (error !== 0) {
            setPayouts(null);
            setCheat(error);
            return;

        }
        const payouts = game.getPayouts();
        setPayouts(payouts);
    }

    const fixError = () => {
        const game = new Game(players, rate);
        setCheat(0);
        setPlayers(game.fixError());
    }


    return (
        <>
            <div className="bg-back-black font-poppins p-5 h-screen w-screen max-w-md flex flex-col mx-auto m-0">
                <div className="flex flex-col w-full justify-center items-center p-5 text-white gap-7">
                    <div className="flex flex-col justify-end items-baseline w-full gap-3">
                        <span className="flex mr-5 font-bold self-end">Players</span>
                        <div className="flex flex-col w-full gap-3">
                            {players.map(player => <PlayerTile
                                rate={rate}
                                onRemove={() => removePlayer(player)}
                                player={player}
                            />)}
                            <PlayerForm action={addPlayer} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-end items-baseline w-full gap-3">
                        <div className="flex justify-between items-baseline w-full">
                            <span className="ml-5 font-bold">Payouts</span>
                            <button onClick={getPayouts} className="bg-primary rounded-lg p-2 font-bold">calculate</button>
                        </div>
                        {payouts && <div className="flex flex-col w-full gap-3">
                            {Object.keys(payouts).map(loser => payouts[loser].map(payout => <PayoutTile loser={loser} payout={payout} />))}
                        </div>}
                        {cheat !== 0 && <div className="flex flex-col w-full gap-3 justify-center items-center">
                            <div className="flex justify-end items-baseline gap-1">
                                {cheat > 0 ?
                                    <span className="text-txt-gray text-lg">someone found <span className="font-bold text-red-100">{cheat}</span> extra chips</span> :
                                    <span className="text-txt-gray text-lg">someone lost <span className="font-bold">{cheat}</span> chips</span>}
                            </div>
                            <button onClick={fixError} className="bg-red rounded-lg py-2 w-full font-bold">redistribute among players</button>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
