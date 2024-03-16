<script lang="ts">
	import * as Button from '$lib/components/ui/button';

	type $$Props = Button.Props;
</script>

<Button.Root type="submit" class="mt-4" {...$$restProps}>
	<slot />
</Button.Root>
