<script lang="ts">
	import { Tag } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	export let data: {
		tenantId: number;
		tagGroupId: number;
	};
</script>

<div class="flex items-center gap-4">
	<a href={`/${data.tenantId}/tag-groups/${data.tagGroupId}/tags`}>
		<Badge
			variant="outline"
			class="flex flex-col items-center gap-0.5 p-2 transition-transform duration-200 hover:scale-90 hover:border-black"
		>
			<Tag class="h-3 w-3" />
			<span>Tags</span>
		</Badge>
	</a>
</div>
