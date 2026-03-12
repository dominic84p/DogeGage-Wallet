<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	
	// Dynamic meta tags based on route
	$: pageTitle = $page.url.pathname === '/' ? 'DogeGage Wallet - Secure Multi-Chain Crypto Wallet' :
		$page.url.pathname === '/wallet' ? 'My Wallet - DogeGage' :
		$page.url.pathname === '/create' ? 'Create Wallet - DogeGage' :
		$page.url.pathname === '/import' ? 'Import Wallet - DogeGage' :
		$page.url.pathname === '/portfolio' ? 'Portfolio - DogeGage' :
		$page.url.pathname === '/exchange' ? 'Exchange - DogeGage' :
		$page.url.pathname === '/settings' ? 'Settings - DogeGage' :
		'DogeGage Wallet';
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<slot />
