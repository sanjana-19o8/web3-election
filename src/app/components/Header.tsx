export default function Header() {

  // <nav className="z-10 w-screen max-w-5xl items-center text-xl bg-gradient-to-1 from-zinc-200 pt-8 backdrop-blur-2xl dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 lg:flex">
  //   <div className="fixed left-0 top-0 flex gap-2 w-screen justify-center font-bold">
  //     <div>
  //       Voter
  //     </div>

  //     <div>
  //       Owner
  //     </div>
  //   </div>
  // </nav>

  return (
    <div className="m-auto bg-gray w-full flex justify-between">
      <nav className="w-full bg-black text-white md:bgGray md:text-white fixed top-0 left-0 right-0 z-10">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <p className="fixed left-0 top-0 flex flex-col gap-2 w-screen justify-center text-cyan-600 font-bold">
            Election Hour.&nbsp;
          </p>
        </div>
      </nav>
    </div>
  )
}