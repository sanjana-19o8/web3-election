export default function Header() {
    return(
      <div className="z-10 w-screen max-w-5xl items-center justify-between text-xl bg-gradient-to-1 from-zinc-200 pt-8 backdrop-blur-2xl dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 lg:flex">
        <p className="fixed left-0 top-0 flex flex-col gap-2 w-screen justify-center font-bold">
          Election Hour&nbsp;
          <code className="font-mono font-light text-sm">Cast your vote!</code>
        </p>
      </div>
    )
}