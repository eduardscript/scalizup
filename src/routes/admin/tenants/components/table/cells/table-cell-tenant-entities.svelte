<script lang="ts">
	import { SquareStack } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	export let tenantId: number;
</script>

<div class="flex items-center gap-4">
	<a href={`/${tenantId}/tag-groups`}>
		<Badge
			variant="outline"
			class="flex flex-col items-center gap-0.5 p-2 transition-transform duration-200 hover:scale-90 hover:border-black"
		>
			<SquareStack class="h-3 w-3" />
			<span>Tag Groups</span>
		</Badge>
	</a>
</div>
