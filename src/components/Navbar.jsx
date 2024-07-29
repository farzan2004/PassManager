import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-custom-teal text-white flex justify-between items-center md:px-8 h-11 mdl:px-4 '>
        {/* <div className="logo">
        <img src="icons/logo.svg" alt="logo" />
        </div> */}
        <div className="flex name mdl:font-normal justify-center">
            <img src="icons/logo.svg" alt="logo" />
            <span className="text-white mdl:font-normal md:font-extrabold ml-4 pl-3 ">&lt;</span>
            <span className='mdl:font-normal md:font-bold'>PassHandler</span>
            <span className="text-white mdl:font-normal md:font-extrabold">/&gt;</span>
        </div>
        <ul className='flex justify-center items-center md:gap-5 mdl:gap-2 mdl:font-light'>
            <li className='hover:font-medium '><a href="/">Home</a></li>
            <li className='hover:font-medium'><a href="/about">About</a></li>
            <li className='hover:font-medium'><a href="/contact">Contact</a></li>
        </ul>
    </nav>
  )
}

export default Navbar
