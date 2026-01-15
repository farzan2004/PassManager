import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-custom-teal text-white flex justify-around md:justify-between items-center md:px-8 h-11 mdl:px-4 '>
      <div className="flex name mdl:font-normal justify-center">
        <img className="w-6 h-6" src="icons/logo.svg" alt="logo" />
        <span className='mdl:font-normal  md:font-bold ml-2'>PassMan</span>
        <span className="text-white mdl:font-normal md:bold">(&#183; _ &#183;)</span>
      </div>
      <ul className='flex justify-between items-center md:gap-5 mdl:gap-2 gap-2 md:font-medium font-light'>
        <li className='hover:scale-105 hover:opacity-100 opacity-90'>
          <a href="/manager">Home</a>
        </li>
        <li className='hover:scale-105 hover:opacity-100 opacity-90'>
          <a href="/profile">Profile</a>
        </li>
        <li className='hover:scale-105 hover:opacity-100 opacity-90'>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
