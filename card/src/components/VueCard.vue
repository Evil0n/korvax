<template>
  <div class="card">
    <template v-if="isLoading">
      <div class="card-body">
        <h5 class="card-title">Loading...</h5>
      </div>
    </template>
    <template v-if="customTemplate">
      <component :is="customTemplate" v-bind="componentData"/>
      <span v-html="`<style>${customStyles}</style>`"/>
    </template>
    <div class="card-default" v-else>
      <img :src="componentData?.cardImageURL" alt="Card image" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">{{ componentData?.cardTitle }}</h5>
        <p class="card-text">{{ componentData?.cardText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {ComponentData} from "./types";

const defaultData: ComponentData = {
  "cardTitle": "Card title",
  "cardText": "Card text",
  "cardImageURL": "https://images.placeholders.dev/?width=840&height=439&text=Card%20Header&bgColor=%23434343&textColor=%23dfdfde"
}

const props = defineProps<{
  data?: ComponentData,
  component?: { template: string, styles: string },
  isLoading?: boolean
}>()

const innerData = ref<ComponentData | undefined>(props.data)
const isInnerLoading = ref(true)
const template = ref(null)
const styles = ref(null)

const isLoading = computed(() => {
  if (typeof props.isLoading !== 'undefined') {
    return props.isLoading
  }
  return isInnerLoading.value
})

const componentData = computed<ComponentData>(() => {
  if (props.data) return props.data
  if (innerData.value) return innerData.value
  return defaultData
})

const customTemplate = computed(() => {
  if (props.component) {
    const component = props.component
    const customProps = {
      data: props.data || defaultData,
      template: component.template,
      styles: component.styles || '',
    };

    return defineComponent({
      template: customProps.template,
      data() {
        return { data: customProps.data }
      },
    })
  }
  if (template.value) {
    const customProps = {
      data: innerData.value || defaultData,
      template: template.value,
      styles: styles.value || '',
    };
    return defineComponent({
      template: customProps.template,
      data() {
        return { data: customProps.data }
      },
    })
  }
  return null
})
const customStyles = computed(() => props.component?.styles ? props.component?.styles || '' : styles.value || '')

onMounted(async () => {
  if (!props.data) {
    const response = await fetch('http://localhost:3000/data').then(res => res?.json());
    if (response) {
      innerData.value = JSON.parse(response);
    }
  }
  if (!props.component) {
    const response = await fetch('http://localhost:3000/template').then(res => res?.json());

    if (response?.template) {
      template.value = response.template
    }
    if (response?.styles) {
      styles.value = response.styles;
    }
  }

  isInnerLoading.value = false
})
</script>

<style scoped>
.card-default {
  width: 300px;
  margin: 10px;
  border: 1px solid #ccc;
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 15px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
}

.card-text {
  font-size: 16px;
}
</style>
