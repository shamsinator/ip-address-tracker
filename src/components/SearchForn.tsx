import iconArrowSVG from '../assets/icon-arrow.svg'

const SearchForm = () => {
  return (
    <form method='get' className='relative flex flex-row justify-center'>
      <input
        type='text'
        placeholder='Search for any IP address or domain'
        required
        className='cursor-text w-4/5 max-w-md border-transparent rounded-l-lg placeholder:text-lg text-lg p-4 font-normal'
      />
      <button
        type='submit'
        className='bg-black text-white p-4 rounded-r-2xl transition ease-in-out duration-300 hover:bg-veryDarkGray'>
        <img className='' srcSet={iconArrowSVG} alt='icon arrow' />
      </button>
    </form>
  )
}

export default SearchForm
