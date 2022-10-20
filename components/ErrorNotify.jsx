import React from 'react'
import Spinner from '../components/Spinner'

const ErrorNotify = ({isLoading, appErrorMessg}) => (
	<div className='flex justify-center'>
		{isLoading && (
			<>
				{Boolean(appErrorMessg) ? (
					<div className='mt-5' style={{width: '500px'}}>
						<h5 className='bg-white rounded-lg p-3' style={{whiteSpace: 'pre-line'}}>
							{appErrorMessg}
							{appErrorMessg.startsWith('Please install') && (
								<a target={'_blank'} href='https://metamask.io/' rel='noreferrer'>
									https://metamask.io/
								</a>
							)}
						</h5>
					</div>
				) : (
					<div className='mt-[150px] flex items-center justify-center bg-purple-600 rounded-lg px-5 py-3'>
						{Spinner}
						<div className='text-xl text-white'>Loading</div>
					</div>
				)}
			</>
		)}
	</div>
)

export default ErrorNotify
