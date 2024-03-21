<script>
	import { Toaster } from 'svelte-sonner';
	import '../app.pcss';
</script>

<div class="m-10">
	<Toaster richColors />

	<slot />
</div>
