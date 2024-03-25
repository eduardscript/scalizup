<script lang="ts">
	import { Badge, type Variant } from '$lib/components/ui/badge';

	export let name: string;
	export let isEnabled: boolean;

	let isEnabledProps: {
		name: string;
		variant: Variant;
	};

	$: isEnabledProps = {
		name: isEnabled ? 'Enabled' : 'Disabled',
		variant: isEnabled ? 'secondary' : 'default'
	};
</script>

<div class="flex flex-col">
	{name}
	<Badge variant={isEnabledProps.variant} class="w-fit">{isEnabledProps.name}</Badge>
</div>
