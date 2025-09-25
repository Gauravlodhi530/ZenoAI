import React, { useEffect, useState } from 'react'

const getInitialTheme = () => {
	const stored = localStorage.getItem('theme')
	if (stored === 'light' || stored === 'dark') return stored
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	return prefersDark ? 'dark' : 'light'
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState(getInitialTheme)

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'dark') {
			root.classList.add('dark')
			localStorage.setItem('theme', 'dark')
		} else {
			root.classList.remove('dark')
			localStorage.setItem('theme', 'light')
		}
	}, [theme])

	return (
		<button
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
			aria-label="Toggle theme"
		>
			{theme === 'dark' ? 'Light' : 'Dark'}
		</button>
	)
}


