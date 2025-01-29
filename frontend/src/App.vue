<template>
	<div class="container">
		<h1>amoCRM Entity Creator</h1>

		<div class="content">
			<CustomDropdown v-model="selectedEntity" :options="entityOptions" />

			<CustomButton
				label="Создать"
				:disabled="!selectedEntity || selectedEntity.value === ''"
				:loading="store.loading"
				@click="createEntity"
			/>

			<div class="results" v-if="store.entities.length > 0">
				<h2>Созданные сущности:</h2>
				<ul>
					<li v-for="entity in store.entities" :key="entity.id">
						{{ entity.type }}: {{ entity.id }}
					</li>
				</ul>
			</div>

			<div class="error" v-if="store.error">
				{{ store.error }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomButton from './components/CustomButton.vue'
import CustomDropdown from './components/CustomDropdown.vue'
import { useAmoCRMStore } from './stores/amocrm'

interface EntityOption {
	value: string
	label: string
}

const store = useAmoCRMStore()
const selectedEntity = ref<EntityOption | null>(null)

const entityOptions = [
	{ value: '', label: 'Не выбрано' },
	{ value: 'deal', label: 'Сделка' },
	{ value: 'contact', label: 'Контакт' },
	{ value: 'company', label: 'Компания' },
]

const createEntity = async () => {
	if (selectedEntity.value?.value) {
		await store.createEntity(selectedEntity.value.value)
	}
}
</script>

<style scoped lang="scss">
.container {
	max-width: 800px;
	margin: 0 auto;
	padding: 2rem;

	h1 {
		text-align: center;
		margin-bottom: 2rem;
	}
}

.content {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
}

.results {
	margin-top: 2rem;
	width: 100%;
	max-width: 300px;

	h2 {
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	ul {
		list-style: none;
		padding: 0;

		li {
			padding: 0.5rem;
			border-bottom: 1px solid #eee;

			&:last-child {
				border-bottom: none;
			}
		}
	}
}

.error {
	color: #ff4d4f;
	margin-top: 1rem;
}
</style>
