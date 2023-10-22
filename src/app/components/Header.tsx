export default function Header() {
  return (
    <nav className="z-10 w-screen max-w-5xl items-center text-xl bg-gradient-to-1 from-zinc-200 pt-8 backdrop-blur-2xl dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 lg:flex">
      <div className="fixed left-0 top-0 flex gap-2 w-screen justify-center font-bold">
        <div>
          Voter
        </div>

        <div>
          Owner
        </div>
      </div>
    </nav>
  )
}