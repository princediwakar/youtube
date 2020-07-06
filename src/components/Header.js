import React from 'react'
import Logo from '../logo.svg'
import { MdNotifications, MdApps, MdVideoCall, MdMenu } from 'react-icons/md'

import { SearchBar } from './SearchBar'

export const Header = ({ handleSubmit }) => {
    return (
        <header className="flex items-center justify-between bg-white px-6 py-3">
            <MdMenu className="h-6 w-6" />
            <a href="/"><img src={Logo} alt="" className="h-6 w-6 ml-6" /></a>


            <SearchBar
                handleSubmit={handleSubmit}
            />



            <div className="flex items-center justify-between text-gray-700">
                <MdVideoCall className="h-6 w-6 mr-5" />
                <MdApps className="h-6 w-6 mr-5" />
                <MdNotifications className="hidden sm:block h-6 w-6 mr-5" />
                <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&h=140&auto=format&fit=facearea&facepad=2"
                    alt="User profile"
                />
            </div>
        </header>
    )
}

