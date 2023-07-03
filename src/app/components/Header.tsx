export default function Header() {
    return(
      <div className="z-10 w-full max-w-5xl items-center justify-between text-xl lg:flex">
        <p className="fixed left-0 top-0 flex flex-col gap-2 w-full justify-center font-bold border-1 border-gray-300 bg-gradient-to-1 from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Election Hour&nbsp;
          <code className="font-mono font-light">Cast your vote!</code>
        </p>
      </div>
    )
}