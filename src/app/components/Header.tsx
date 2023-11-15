export default function Header() {

  return (
    <div className="m-auto bg-gray w-full flex justify-between">
      <nav className="w-full bg-black text-white md:bgGray md:text-white fixed top-0 left-0 right-0 z-10">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <p className="md:fixed md:left-0 md:top-0 flex flex-col w-screen text-cyan-600 font-bold">
            Election Hour.&nbsp;
          </p>
        </div>
      </nav>
    </div>
  )
}