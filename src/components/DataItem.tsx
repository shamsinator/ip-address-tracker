import React from 'react'
import SkeletonLoader from './SkeletonLoader'

interface DataItemProps {
  title: string
  data: string | undefined
}

const DataItem: React.FC<DataItemProps> = ({ title, data }) => (
  <article className='flex-1 sm:w-64'>
    <h2 className='text-dark-gray text-xs uppercase'>{title}</h2>
    {data ? (
      <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl'>
        {data}
      </p>
    ) : (
      <SkeletonLoader />
    )}
  </article>
)

export default DataItem
