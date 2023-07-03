// import { abi, addr} from './contract'
import Card from "./components/Card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex flex-col gap-2 w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Election Hour&nbsp;
          <code className="font-mono font-bold">Cast your vote!</code>
        </p>
      </div>

      <div>
        <Card />
      </div>

      <footer className="mb-32 grid text-center lg:mb-0 lg:grid-cols-1 lg:text-left">&copy;&lt;sanjana-vajr /&gt;
      </footer>
    </main>
  )
}
