<template>
	<div class="dropdown">
		<div class="dropdown-header" @click="toggleDropdown">
			{{ selectedOption ? selectedOption.label : 'Не выбрано' }}
			<span class="dropdown-arrow" :class="{ open: isOpen }">▼</span>
		</div>
		<div class="dropdown-content" v-if="isOpen">
			<div
				v-for="option in options"
				:key="option.value"
				class="dropdown-item"
				@click="selectOption(option)"
				:class="{ selected: selectedOption?.value === option.value }"
			>
				{{ option.label }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Option {
	value: string
	label: string
}

const props = defineProps<{
	modelValue: Option | null
	options: Option[]
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: Option | null): void
}>()

const isOpen = ref(false)
const selectedOption = ref(props.modelValue)

const toggleDropdown = () => {
	isOpen.value = !isOpen.value
}

const selectOption = (option: Option) => {
	selectedOption.value = option
	emit('update:modelValue', option)
	isOpen.value = false
}
</script>

<style scoped lang="scss">
.dropdown {
	position: relative;
	width: 100%;
	max-width: 300px;
	user-select: none;

	&-header {
		padding: 12px 16px;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&-arrow {
		font-size: 12px;
		transition: transform 0.2s ease;

		&.open {
			transform: rotate(180deg);
		}
	}

	&-content {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #ddd;
		border-top: none;
		border-radius: 0 0 4px 4px;
		max-height: 200px;
		overflow-y: auto;
		z-index: 1000;
	}

	&-item {
		padding: 12px 16px;
		cursor: pointer;

		&:hover {
			background: #f5f5f5;
		}

		&.selected {
			background: #e6f7ff;
		}
	}
}
</style>
