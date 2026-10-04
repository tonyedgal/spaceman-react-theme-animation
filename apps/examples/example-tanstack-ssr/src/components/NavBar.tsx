import { Link, useLocation } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useState } from 'react'

const navItems = [
  { name: 'With-Components', path: '/' },
  { name: 'With-Hook', path: '/hook' },
  { name: 'With-Cards', path: '/cards' },
]

export default function NavBar() {
  const location = useLocation()
  const pathName = location.pathname || '/'

  const [hoveredPath, setHoveredPath] = useState<string | null>(pathName)

  return (
    <div className='border-border fixed top-8 left-1/2 z-50 mx-auto flex w-fit -translate-x-1/2 transform items-center rounded-xs border bg-transparent p-1 shadow-sm backdrop-blur-md'>
      <nav className='relative z-100 mx-auto flex items-center justify-between rounded-lg'>
        <Link to='/' className='px-1'>
          <img
            src='/Spaceman.webp'
            alt='Portrait'
            height='32'
            width='32'
            className='mr-1 rounded-full'
          />
        </Link>
        {navItems.map((item) => {
          const active = pathName === item.path

          return (
            <Link
              key={item.path}
              className={`text-muted-foreground relative shrink rounded-none px-5 py-3 text-xs leading-[14px] no-underline duration-300 ease-in-out lg:text-sm ${
                active ? 'font-semibold' : ''
              }`}
              to={item.path}
              data-active={active}
              onMouseOver={() => setHoveredPath(item.path)}
              onMouseLeave={() => setHoveredPath(pathName)}
            >
              <span>{item.name}</span>
              {item.path === hoveredPath && (
                <motion.div
                  className='bg-muted absolute bottom-0 left-0 -z-10 h-full rounded-none mix-blend-difference'
                  layoutId='navbar'
                  aria-hidden='true'
                  style={{
                    width: '100%',
                  }}
                  transition={{
                    // type: "spring",
                    bounce: 0,
                    stiffness: 100,
                    damping: 10,
                    duration: 0.3,
                  }}
                />
              )}
              {active && (
                <motion.div
                  className='absolute right-0 bottom-[-6px] left-0 flex w-full items-center justify-center rounded-full px-2'
                  transition={{ duration: 0.5 }}
                  layoutId='pill'
                >
                  <div className='border-accent bg-accent h-[2px] w-full border'></div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
