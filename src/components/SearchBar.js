import React from 'react'
import { MdSearch } from 'react-icons/md'
import { useState } from 'react'

export const SearchBar = ({ handleSubmit }) => {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <form
            onSubmit={(e) => {
                handleSubmit(searchTerm)
                e.preventDefault()
            }}
            className="flex items-center mx-auto border border-gray-500  bg-gray-100 overflow-hidden rounded-sm w-2/5">
            
            <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                type="text"
                className="w-full py-1 pl-2 border-r border-gray-500 shadow-inner focus:border-blue-500 placeholder-gray-700"
                placeholder="Search"
            />


            <button type="submit" className="px-4 text-gray-700 focus:outline-none">
                <MdSearch className="h-5 w-5" />
            </button>
        </form>
    )
}
