// Card component to contain candidate details
export default function Card() {
    return (
        <div id="all-candidates" className="grid gap-12 lg:grid-cols-4">
            <div className="fixed left-0 top-0 flex flex-col gap-2 w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                <p>Candidate name: xx</p>
                <p>Candidate ID: xx</p>
                <p>Vote Count: 00xx</p>
            </div>
        </div>
    )
}