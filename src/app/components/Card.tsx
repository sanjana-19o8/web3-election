import { Button } from "@mui/material";

interface Card{
    name: string,
    id: number,
    voteCount: number,
    isOwner: boolean,
    voteFn: () => void,
}

export default function Card({ name, id, voteCount, isOwner, voteFn}: Card) {
    return (
        <div className="flex flex-col gap-2 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 p-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            <p>NAME: {name}</p>
            <p>ID: {id}</p>
            {isOwner && <p>Vote Count: {voteCount}</p>}
            <Button variant="outlined" onClick={() => voteFn()}>VOTE!</Button>
        </div>
    )
}