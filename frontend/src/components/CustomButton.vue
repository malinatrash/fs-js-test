<template>
	<button
		class="custom-button"
		:class="{ disabled: disabled, loading: loading }"
		:disabled="disabled || loading"
		@click="$emit('click')"
	>
		<div v-if="loading" class="loader"></div>
		<span v-else>{{ label }}</span>
	</button>
</template>

<script setup lang="ts">
defineProps<{
	label: string
	disabled?: boolean
	loading?: boolean
}>()

defineEmits<{
	(e: 'click'): void
}>()
</script>

<style scoped lang="scss">
@use 'sass:color';

.custom-button {
	padding: 12px 24px;
	border-radius: 4px;
	border: none;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.2s ease;
	background: #4b6fdd;
	color: white;
	min-width: 120px;
	position: relative;

	&:hover:not(.disabled) {
		background: color.adjust(#4b6fdd, $lightness: -10%);
	}

	&.disabled {
		background: #f5f5f5;
		color: #999;
		cursor: not-allowed;
	}

	&.loading {
		color: transparent;
	}

	.loader {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 20px;
		height: 20px;
		border: 2px solid #ffffff;
		border-radius: 50%;
		border-top-color: transparent;
		animation: spin 1s linear infinite;
	}
}

@keyframes spin {
	to {
		transform: translate(-50%, -50%) rotate(360deg);
	}
}
</style>
